import { useState, useEffect } from 'react';
import { INITIAL_STATE, PLAYERS, THEMES } from '@/constants.js';
import Square from '@/components/square/square';
import GameModal from '@/components/modal/modal';

import './field.scss';

const Field = () => {
  const size = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState('Kris');
  const [grid, setGrid] = useState(INITIAL_STATE);
  const [activeSquares, setActiveSquares] = useState([]);
  const [clickedPlayer, setClickedPlayer] = useState();
  const [roundStart, setRoundStart] = useState(false);
  const [playerSelection, setPlayerSelection] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = [...array]; // Copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };
  const themes = shuffleArray(THEMES);

  const getRandomIndex = (limit) => {
    return Math.floor(Math.random() * limit);
  };

  const getActivePlayers = (playerToExclude) => {
    return PLAYERS.filter((player) => player !== playerToExclude);
  };

  const getNewPlayer = () => {
    const availablePlayers = getActivePlayers();
    const newIndex = getRandomIndex(availablePlayers.length);
    return availablePlayers[newIndex];
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
    const lostPlayerAvailableSquares = getAvailableSquares(activePlayers).filter(
      (square) => grid[square] === 'default'
    );
    const newIndex = getRandomIndex(lostPlayerAvailableSquares.length);
    gridClone[lostPlayerAvailableSquares[newIndex]] = clickedPlayer;
  };

  const onSelectSquare = (cords, clickedPlayer) => {
    if (clickedPlayer === activePlayer) return;
    if (!activeSquares.includes(cords)) return;
    if (grid[cords] === 'default') return;

    setClickedPlayer(clickedPlayer);
    setIsModalOpen(true);
    setRoundStart(true);
  };

  const onWin = () => {
    setRoundStart(false);
    const newGrid = structuredClone(grid);
    absorbField(newGrid, clickedPlayer, activePlayer);
    getSquareForAbsorbedPlayer(newGrid, clickedPlayer);
    setGrid(newGrid);
    setActiveSquares([]);
    setPlayerSelection(true);
  };

  const onLose = () => {
    setRoundStart(false);
    const newGrid = structuredClone(grid);
    absorbField(newGrid, activePlayer, clickedPlayer);
    getSquareForAbsorbedPlayer(newGrid, activePlayer);
    setGrid(newGrid);
    setActiveSquares([]);
    setActivePlayer(clickedPlayer);
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

  const getPlayerField = (player) => {
    const playerField = [];
    for (const key in grid) {
      if (grid[key] === player) {
        playerField.push(key);
      }
    }
    return playerField;
  };

  const getAvailableSquares = (players, squareCords) => {
    const availableSquares = [];
    const playerList = Array.isArray(players) ? players : [players];
    playerList.forEach((player) => {
      const playerField = squareCords ? getPlayerField(squareCords) : getPlayerField(player);
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
      <GameModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} player1={activePlayer} player2={clickedPlayer} />
      <div>
        <div className='active_player'>Active player: {activePlayer}</div>
        {roundStart && (
          <div>
            <button onClick={onWin}>Win</button>
            <button onClick={onLose}>Lose</button>
          </div>
        )}
        {playerSelection && (
          <div>
            <button onClick={onNextPlayer}>Next Player</button>
            <button onClick={onGoOn}>Go On!</button>
          </div>
        )}
      </div>
      <div className='field_container'>{generateGrid(size)}</div>
    </>
  );
};

export default Field;
