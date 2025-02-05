import clsx from 'clsx';
import { PLAYERS } from '../../constants';
import './square.scss';

const Square = ({ activeSquares, cords, player, onClick }) => {
  return (
    <div
      className={clsx('square_container', activeSquares.includes(cords) && 'active')}
      data-cords={cords}
      onClick={() => onClick(cords, player)}
      style={{ backgroundColor: PLAYERS[player] }}
    >
      {cords}
    </div>
  );
};

export default Square;
