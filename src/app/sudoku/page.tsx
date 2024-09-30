'use client';
import React, { useState, useEffect } from 'react';
import './sudoku.css';

type Board = number[][];
type Cell = `${number}-${number}`;

const generateSudoku = (): { board: Board; solvedBoard: Board } => {
  const board: Board = Array(9).fill(null).map(() => Array(9).fill(0));

  const canPlace = (board: Board, row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }
    let startRow = row - (row % 3), startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }
    return true;
  };

  const fillBoard = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (canPlace(board, row, col, num)) {
              board[row][col] = num;
              if (fillBoard(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillBoard(board);
  const solvedBoard: Board = JSON.parse(JSON.stringify(board));

  let cellsToRemove = 40;
  while (cellsToRemove > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      cellsToRemove--;
    }
  }

  return { board, solvedBoard };
};

const checkSolution = (board: Board): boolean => {
  for (let i = 0; i < 9; i++) {
    if (!isValidGroup(board[i]) || !isValidGroup(board.map(row => row[i]))) {
      return false;
    }
  }
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      if (!isValidGroup(getSubgrid(board, i, j))) {
        return false;
      }
    }
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
};

const isValidGroup = (group: number[]): boolean => {
  const seen = new Set<number>();
  for (const num of group) {
    if (num !== 0) {
      if (seen.has(num)) return false;
      seen.add(num);
    }
  }
  return true;
};

const getSubgrid = (board: Board, startRow: number, startCol: number): number[] => {
  const subgrid: number[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      subgrid.push(board[startRow + i][startCol + j]);
    }
  }
  return subgrid;
};

const isValidInput = (value: string): boolean => {
  return /^[1-9]?$/.test(value);
};

interface CustomAlertProps {
  message: string;
  type: 'success' | 'error';
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type }) => (
  <div className={`mt-4 p-4 rounded-md ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {message}
  </div>
);

const SudokuGame: React.FC = () => {
  const [board, setBoard] = useState<Board>([]);
  const [originalBoard, setOriginalBoard] = useState<Board>([]);
  const [solvedBoard, setSolvedBoard] = useState<Board>([]);
  const [hintCells, setHintCells] = useState<Set<Cell>>(new Set());
  const [showingHints, setShowingHints] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const handleInputChange = (row: number, col: number, value: string) => {
    if (originalBoard[row][col] !== 0) return;
    if (!isValidInput(value)) return;

    const newBoard = [...board];
    newBoard[row][col] = value === '' ? 0 : parseInt(value, 10);
    setBoard(newBoard);
    setMessage(null);
  };

  const handleCheckSolution = () => {
    const newIncorrectCells = new Set<Cell>();
    
    let isCorrect = true; 
  
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (originalBoard[i][j] === 0 && board[i][j] !== solvedBoard[i][j]) {
          newIncorrectCells.add(`${i}-${j}` as Cell);
          isCorrect = false;
        }
      }
    }
  
    setIncorrectCells(newIncorrectCells);
  
    if (isCorrect) {
      setMessage({ type: 'success', text: 'Congratulations! You solved the puzzle!' });
    } else {
      setMessage({ type: 'error', text: 'Solution is incorrect. Keep trying!' });
    }
  };
  

  const resetGame = () => {
    const { board: newBoard, solvedBoard: newSolvedBoard } = generateSudoku();
    setBoard(newBoard);
    setOriginalBoard(JSON.parse(JSON.stringify(newBoard)));
    setSolvedBoard(newSolvedBoard);
    setHintCells(new Set());
    setShowingHints(false);
    setMessage(null);
  };

  const handleShowSolution = () => {
    if (showingHints) {
      const revertedBoard = board.map((row, rowIndex) =>
        row.map((num, colIndex) =>
          hintCells.has(`${rowIndex}-${colIndex}` as Cell) ? 0 : num
        )
      );
      setBoard(revertedBoard);
      setHintCells(new Set());
      setShowingHints(false);
    } else {
      const hintCellsSet = new Set<Cell>();
      const newBoard = board.map((row, rowIndex) =>
        row.map((num, colIndex) => {
          if (num === 0) {
            hintCellsSet.add(`${rowIndex}-${colIndex}` as Cell);
            return solvedBoard[rowIndex][colIndex];
          }
          return num;
        })
      );
      setBoard(newBoard);
      setHintCells(hintCellsSet);
      setShowingHints(true);
    }
  };

  const getCellClassName = (rowIndex: number, colIndex: number): string => {
    const baseClass = 'w-[50px] h-[50px] text-center text-lg';
    const isSubgridLeft = colIndex % 3 === 0;
    const isSubgridTop = rowIndex % 3 === 0;
    const borderClass = `${isSubgridLeft ? 'border-l-2' : ''} ${isSubgridTop ? 'border-t-2' : ''} border-gray-800`;
    const fontClass = originalBoard[rowIndex][colIndex] !== 0 ? 'font-bold' : '';
    const incorrectClass = incorrectCells.has(`${rowIndex}-${colIndex}` as Cell) ? 'border-red-500 bg-red-100' : '';
  
    return `${baseClass} ${borderClass} ${fontClass} ${incorrectClass}`; 
  };
  

  const [incorrectCells, setIncorrectCells] = useState<Set<Cell>>(new Set());


  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Sudoku Game</h1>
      <div className="grid grid-cols-9 mb-4 border-2 border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((num, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength={1}
              className={getCellClassName(rowIndex, colIndex)}
              value={num === 0 ? '' : num.toString()}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              disabled={originalBoard[rowIndex][colIndex] !== 0}
            />
          ))
        )}
      </div>
      <div className="flex justify-center space-x-4">
        <button className="w-full h-12 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleCheckSolution}>
          Check Result
        </button>
        <button className="w-full h-12 px-4 mr-3 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={resetGame}>
          New Game
        </button>
        <button className="w-full h-12 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={handleShowSolution}>
          {showingHints ? 'Hide Hints' : 'Show Hints'}
        </button>
      </div>
      {message && <CustomAlert message={message.text} type={message.type} />}
    </div>
  );
};

export default SudokuGame;