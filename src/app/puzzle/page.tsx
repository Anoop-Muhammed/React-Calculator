"use client";
import React, { useState, useEffect } from "react";
import "./puzzle.css";

const PuzzleGame = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(15);

  useEffect(() => {
    initGame();
  }, []);

  const shuffleArray = (array: (number | null)[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initGame = () => {
    const shuffledTiles = shuffleArray([...Array.from({ length: 15 }, (_, i) => i), null]);
    setTiles(shuffledTiles);
    setEmptyIndex(shuffledTiles.indexOf(null));
  };

  const isMovable = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
  };

  const handleTileClick = (index: number) => {
    if (isMovable(index)) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = null;
      setTiles(newTiles);
      setEmptyIndex(index);
    }
  };

  const checkPuzzleSolved = () => {
    const correctTiles = [...Array(15).keys()].concat(null); // Correct order is [0, 1, 2, ..., 14, null]
    return JSON.stringify(tiles) === JSON.stringify(correctTiles);
  };
  

  const showSolvedPuzzle = () => {
    const solvedTiles = [...Array(15).keys()].map(n => n);
    solvedTiles.push(null); // Add the empty tile at the end
    setTiles(solvedTiles);
    setEmptyIndex(15); // Empty tile index at the last position
  };

  return (
    <>
    <h1 className="puzzleHeading">Puzzle Game</h1>
    <div className="puzzleContainer">
      {tiles.map((tile, index) => (
        <div 
          key={index} 
          className={`tile ${tile === null ? "empty" : ""}`} 
          onClick={() => handleTileClick(index)}
        >
          {tile !== null ? tile + 1 : ""}
        </div>
      ))}
      <div className="buttonsContainer">
  <p className={`solvedMessage ${checkPuzzleSolved() ? "visible" : "hidden"}`}>Puzzle Solved!</p>
  <div className="buttons">
    <button onClick={initGame} className="resetButton">Reset</button>
    <button onClick={showSolvedPuzzle} className="solveButton">Solved</button>
  </div>
</div>

    </div>
    </>
  );
};

export default PuzzleGame;
