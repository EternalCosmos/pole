import { COLORS } from '@/constants';
import './square.scss';

const Square = ({ cords, color, onClick }) => {
  return (
    <div
      className='square_container'
      data-cords={cords}
      onClick={() => onClick(cords, color)}
      style={{ backgroundColor: COLORS[color] }}
    ></div>
  );
};

export default Square;
