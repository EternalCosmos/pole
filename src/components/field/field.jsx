import { useState, useEffect } from 'react';
import { INITIAL_STATE, PLAYERS } from '@/constants.js';
import Square from '@/components/square/square';

import './field.scss';

const Field = () => {
  const size = 6;
  const [activePlayer, setActivePlayer] = useState('Fima');
  const [grid, setGrid] = useState(INITIAL_STATE);
  const [activeSquares, setActiveSquares] = useState([]);

  const toggleColor = (cords, previousPlayer) => {
    if (previousPlayer === activePlayer) return;
    if (!activeSquares.includes(cords)) return;
    if (previousPlayer != 'default') {
      const newGrid = structuredClone(grid);
      for (const key in newGrid) {
        if (newGrid[key] === previousPlayer) {
          newGrid[key] = activePlayer;
        }
      }
      setGrid(newGrid);
    } else {
      setGrid({ ...grid, [cords]: activePlayer });
    }
    const availablePlayers = Object.keys(PLAYERS).filter(
      (player) => player !== 'default' && player !== 'active' && player !== activePlayer
    );
    const newIndex = Math.floor(Math.random() * availablePlayers.length);
    setActivePlayer(availablePlayers[newIndex]);
    getAvailableSquares(availablePlayers[newIndex]);
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

  const getPlayerField = (player) => {
    const playerField = [];
    for (const key in grid) {
      if (grid[key] === player) {
        playerField.push(key);
      }
    }
    return playerField;
  };

  const getAvailableSquares = (player, square) => {
    const playerField = square ? getPlayerField(square) : getPlayerField(player);
    const availableSquares = [];
    playerField.forEach((square) => availableSquares.push(...getNeighbourSquares(square, player)));
    const uniqueAvailableSquares = [...new Set(availableSquares)];
    setActiveSquares(uniqueAvailableSquares);
  };

  const generateGrid = (size) => {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        const cords = `${i},${y}`;
        row.push(<Square activeSquares={activeSquares} cords={cords} player={grid[cords]} onClick={toggleColor} />);
      }
      matrix.push(<div className='row'>{row}</div>);
    }
    return matrix;
  };

  useEffect(() => {
    getAvailableSquares(activePlayer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const playerField = getPlayerField(activePlayer);
    if (playerField.length > 0) return;
    const emptySquares = [];
    for (const key in grid) {
      if (grid[key] === 'default') {
        emptySquares.push(key);
      }
    }
    const newIndex = Math.floor(Math.random() * emptySquares.length);
    const newActivePlayerSquare = emptySquares[newIndex];
    setGrid({ ...grid, [newActivePlayerSquare]: activePlayer });
    setActiveSquares(getNeighbourSquares(newActivePlayerSquare));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlayer]);

  return (
    <>
      <div className='active_player'>Active player: {activePlayer}</div>
      <div className='field_container'>{generateGrid(size)}</div>
    </>
  );
};

export default Field;
