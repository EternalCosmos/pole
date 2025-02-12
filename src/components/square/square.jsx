import clsx from 'clsx';
import { COLORS } from '../../constants';
import './square.scss';

const Square = ({ activeSquares, cords, player, onClick }) => {
  return (
    <div
      className={clsx(`square_container ${player}`, activeSquares.includes(cords) && 'active')}
      data-cords={cords}
      onClick={() => onClick(cords, player)}
      style={{ backgroundColor: COLORS[player] }}
    />
  );
};

export default Square;
