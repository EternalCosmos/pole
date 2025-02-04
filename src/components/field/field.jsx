import { useState, useEffect } from 'react';
import { COLORS, INITIAL_STATE } from '@/constants.js';
import Square from '@/components/square/square';

import './field.scss';

const Field = () => {
  const size = 6;
  const [activeColor, setActiveColor] = useState('red');
  const [colors, setColors] = useState(INITIAL_STATE);

  const toggleColor = (cords, previousColor) => {
    if (previousColor === activeColor) return;
    if (previousColor != 'default') {
      const newColors = structuredClone(colors);
      for (const key in newColors) {
        if (newColors[key] === previousColor) {
          newColors[key] = activeColor;
          console.log('newColors', newColors);
        }
      }
      setColors(newColors);
    } else {
      setColors({ ...colors, [cords]: activeColor });
    }
    const availableColors = Object.keys(COLORS).filter((color) => color != 'default');
    const newIndex = Math.floor(Math.random() * availableColors.length);
    setActiveColor(COLORS[availableColors[newIndex]]);
  };

  useEffect(() => {}, []);

  const generateGrid = (size) => {
    const grid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        const cords = `${i},${y}`;
        row.push(<Square cords={cords} color={colors[cords]} onClick={toggleColor} />);
      }
      grid.push(<div className='row'>{row}</div>);
    }
    return grid;
  };

  return (
    <>
      <div className='active_color'>Active color: {activeColor}</div>
      <div className='field_container'>{generateGrid(size)}</div>
    </>
  );
};

export default Field;
