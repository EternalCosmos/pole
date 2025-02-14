import { useEffect, useState, useMemo } from 'react';
import Modal from 'react-modal';
import clsx from 'clsx';

import { THEME_URIS } from '../../constants';
import { shuffleArray } from '../../utils';

import './modal.scss';

const GameModal = ({ isOpen, setIsOpen, player1, player2, onWin, onLose, theme }) => {
  const time = 2;
  const [index, setIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [timer1, setTimer1] = useState(time);
  const [timer2, setTimer2] = useState(time);
  const [activeTimer, setActiveTimer] = useState(0);
  const [winner, setWinner] = useState();
  const [showControls, setShowControls] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  // const sources = import.meta.glob(THEME_URIS[theme]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const images = useMemo(() => shuffleArray(THEME_URIS[theme]), [player1, player2]);

  const onNext = () => {
    const newIndex = index + 1;
    if (newIndex > images.length - 1) {
      setIsOpen(false);
    } else {
      setIndex(newIndex);
    }
  };

  const onStart = () => {
    setShowImage(true);
    setActiveTimer(1);
  };

  const reset = () => {
    setIndex(0);
    setShowImage(false);
    setActiveTimer(0);
    setTimer1(time);
    setTimer2(time);
    setWinner('');
    setShowControls(true);
  };

  const onClose = () => {
    reset();
    setIsOpen(false);
    winner === player1 ? onWin() : onLose();
  };

  const onCorrect = () => {
    setActiveTimer((prev) => (prev === 1 ? 2 : 1));
    setShowAnswer(true);
    setTimeout(() => {
      onNext();
      setShowAnswer(false);
    }, 1200);
  };

  const onPass = () => {
    setShowAnswer(true);
    setTimeout(() => {
      onNext();
      setShowAnswer(false);
    }, 3000);
  };

  const getTextBetweenDots = (filename) => {
    const match = filename.match(/(?<=\.)[^.]+(?=\.)/);
    return match ? match[0] : '';
  };

  useEffect(() => {
    if (timer1 > 0 && timer2 > 0) {
      const interval1 = setInterval(() => {
        setTimer1((prev) => (activeTimer === 1 && prev > 0 ? prev - 1 : prev));
        setTimer2((prev) => (activeTimer === 2 && prev > 0 ? prev - 1 : prev));
      }, 1000);

      return () => clearInterval(interval1);
    } else {
      setShowImage(false);
      setShowControls(false);
      timer1 === 0 ? setWinner(player2) : setWinner(player1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimer, timer1, timer2]);

  return (
    <Modal isOpen={isOpen} ariaHideApp={false} overlayClassName='overlay' className='modal'>
      <div className='modal_container'>
        <div className='modal_header'>
          <button className='modal_btn' onClick={onClose}>
            X
          </button>
        </div>
        {!showImage && showControls && (
          <div className='modal_btn_container'>
            <button className='modal_btn' onClick={onStart}>
              Start
            </button>
          </div>
        )}
        {showImage && (
          <div className='image_container'>
            <img key={index} src={images[index]} />
            <p className={clsx('answer', showAnswer && 'visible')}>{getTextBetweenDots(images[index])}</p>
          </div>
        )}
        {winner && <p>{winner} Won!</p>}
        {showControls && (
          <div className='controls_container'>
            <div className='timers'>
              <div className={clsx('player', activeTimer === 1 && 'active')}>
                {player1}: {timer1}s
              </div>
              <div className={clsx('player', activeTimer === 2 && 'active')}>
                {player2}: {timer2}s
              </div>
            </div>
            <div className='control_btns'>
              <button className='modal_btn' onClick={onCorrect}>
                Correct
              </button>
              <button className='modal_btn' onClick={onPass}>
                Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GameModal;
