import { useState, useEffect } from 'react';
import { INITIAL_STATE, PLAYERS, THEMES, THEME_NAMES } from '@/constants.js';
import Square from '@/components/square/square';
import GameModal from '@/components/modal/modal';

import './field.scss';
import clsx from 'clsx';

const Field = () => {
  const size = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState('Kris');
  const [grid, setGrid] = useState(INITIAL_STATE);
  const [activeSquares, setActiveSquares] = useState([]);
  const [clickedPlayer, setClickedPlayer] = useState();
  const [playerSelection, setPlayerSelection] = useState(false);
  const [themeMap, setThemeMap] = useState(THEMES);
  const [playerThemes, setPlayerThemes] = useState({
    Fima: 'potatoes',
    Tema: 'sport',
    Kris: 'cheese',
    Anya: 'birthday',
  });
  const [activePlayers, setActivePlayers] = useState(PLAYERS);

  const getRandomIndex = (limit) => {
    return Math.floor(Math.random() * limit);
  };

  const getActivePlayers = (playerToExclude) => {
    return activePlayers.filter((player) => player !== playerToExclude);
  };

  const getNewPlayer = () => {
    const newIndex = getRandomIndex(activePlayers.length);
    return activePlayers[newIndex];
  };

  const absorbField = (gridClone, loser, winner) => {
    for (const key in gridClone) {
      if (gridClone[key] === loser) {
        gridClone[key] = winner;
      }
    }
  };

  const getSquareForAbsorbedPlayer = (gridClone, clickedPlayer) => {
    const activePlayers = getActivePlayers(clickedPlayer);
    const lostPlayerAvailableSquares = getAvailableSquares(activePlayers, gridClone).filter(
      (square) => gridClone[square] === 'default'
    );
    if (!lostPlayerAvailableSquares.length) {
      setActivePlayers(getActivePlayers(clickedPlayer));
    } else {
      const newIndex = getRandomIndex(lostPlayerAvailableSquares.length);
      gridClone[lostPlayerAvailableSquares[newIndex]] = clickedPlayer;
    }
  };

  const getThemeForAbsorbedPlayer = (player) => {
    const themeMapClone = structuredClone(themeMap);
    const availableThemes = Object.keys(themeMapClone).filter((theme) => !themeMapClone[theme]);
    const newIndex = getRandomIndex(availableThemes.length);
    const newTheme = availableThemes[newIndex];
    themeMapClone[newTheme] = true;
    setPlayerThemes({ ...playerThemes, [player]: newTheme });
    setThemeMap(themeMapClone);
  };

  const onSelectSquare = (cords, player) => {
    if (player === activePlayer) return;
    if (!activeSquares.includes(cords)) return;
    if (grid[cords] === 'default') return;

    setClickedPlayer(player);
    setIsModalOpen(true);
  };

  const onWin = () => {
    const newGrid = structuredClone(grid);
    absorbField(newGrid, clickedPlayer, activePlayer);
    getSquareForAbsorbedPlayer(newGrid, clickedPlayer);
    getThemeForAbsorbedPlayer(clickedPlayer);
    setGrid(newGrid);
    setActiveSquares([]);
    setPlayerSelection(true);
  };

  const onLose = () => {
    const newGrid = structuredClone(grid);
    absorbField(newGrid, activePlayer, clickedPlayer);
    getSquareForAbsorbedPlayer(newGrid, activePlayer);
    getThemeForAbsorbedPlayer(activePlayer);
    setGrid(newGrid);
    setActiveSquares([]);
    setActivePlayer(clickedPlayer);
    setClickedPlayer();
    setPlayerSelection(true);
  };

  const onNextPlayer = () => {
    const newPlayer = getNewPlayer();
    setActivePlayer(newPlayer);
    const availableSquares = getAvailableSquares(newPlayer).filter((square) => grid[square] !== 'default');
    setActiveSquares(availableSquares);
    setPlayerSelection(false);
  };

  const onGoOn = () => {
    const availableSquares = getAvailableSquares(activePlayer).filter((square) => grid[square] !== 'default');
    setActiveSquares(availableSquares);
    setPlayerSelection(false);
  };

  const getNeighbourSquares = (squareCords, player) => {
    const [x, y] = squareCords.split(',').map(Number);
    const neighbours = [];
    if (grid[`${x - 1},${y}`] !== player && x - 1 >= 0) neighbours.push(`${x - 1},${y}`); // top
    if (grid[`${x},${y + 1}`] !== player && y + 1 < size) neighbours.push(`${x},${y + 1}`); // right
    if (grid[`${x + 1},${y}`] !== player && x + 1 < size) neighbours.push(`${x + 1},${y}`); // bottom
    if (grid[`${x},${y - 1}`] !== player && y - 1 >= 0) neighbours.push(`${x},${y - 1}`); // left
    return neighbours;
  };

  const getPlayerField = (player, gridClone) => {
    const playerField = [];
    for (const key in gridClone) {
      if (gridClone[key] === player) {
        playerField.push(key);
      }
    }
    return playerField;
  };

  const getAvailableSquares = (players, gridClone = grid) => {
    const availableSquares = [];
    const playerList = Array.isArray(players) ? players : [players];
    playerList.forEach((player) => {
      const playerField = getPlayerField(player, gridClone);
      playerField.forEach((square) => {
        availableSquares.push(...getNeighbourSquares(square, player));
      });
    });
    const uniqueAvailableSquares = [...new Set(availableSquares)];
    return uniqueAvailableSquares;
  };

  const generateGrid = (size) => {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        const cords = `${i},${y}`;
        row.push(
          <Square
            activeSquares={activeSquares}
            cords={cords}
            key={i + y}
            player={grid[cords]}
            onClick={onSelectSquare}
          />
        );
      }
      matrix.push(
        <div className='row' key={i}>
          {row}
        </div>
      );
    }
    return matrix;
  };

  useEffect(() => {
    const availableSquares = getAvailableSquares(activePlayer).filter((square) => grid[square] !== 'default');
    setActiveSquares(availableSquares);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {clickedPlayer && (
        <GameModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          player1={activePlayer}
          player2={clickedPlayer}
          onWin={onWin}
          onLose={onLose}
          theme={playerThemes[clickedPlayer]}
        />
      )}
      <div>
        <div className='legend_container'>
          <div>
            <div className='player'>
              <span className={clsx('player_name', activePlayers.includes('Anya') && 'active')}>Anya:</span>
              <div className='color_block anya'>{THEME_NAMES[playerThemes.Anya]}</div>
            </div>
            <div className='player'>
              <span className={clsx('player_name', activePlayers.includes('Tema') && 'active')}>Tema:</span>
              <div className='color_block tema'>{THEME_NAMES[playerThemes.Tema]}</div>
            </div>
            <div className='player'>
              <span className={clsx('player_name', activePlayers.includes('Fima') && 'active')}>Fima:</span>
              <div className='color_block fima'>{THEME_NAMES[playerThemes.Fima]}</div>
            </div>
            <div className='player'>
              <span className={clsx('player_name', activePlayers.includes('Kris') && 'active')}>Kris:</span>
              <div className='color_block kris'>{THEME_NAMES[playerThemes.Kris]}</div>
            </div>
          </div>
          <div>Active Player: {activePlayer}</div>
          <div className={clsx('control_container', playerSelection && 'visible')}>
            <button className='control_btn' onClick={onNextPlayer}>
              Next Player
            </button>
            <button className='control_btn' onClick={onGoOn}>
              Go On!
            </button>
          </div>
        </div>
      </div>
      <div className='field_container'>{generateGrid(size)}</div>
    </>
  );
};

export default Field;
