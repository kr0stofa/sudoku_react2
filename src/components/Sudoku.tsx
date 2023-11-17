import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { Board } from "./types";
import "./sudoku.css";
import Numpad from "./Numpad";

const getTileID = (x: number, y: number) => y * 100 + x;
const getTileFromId = (id: number) => [id % 100, Math.floor(id / 100)];

const ROWS = 9;
const COLS = 9;

const getEmptyBoard = () =>
  new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0));

const Sudoku = () => {
  const [currBoard, setCurrBoard] = useState<Board>(getEmptyBoard());
  const [selectedTile, setSelectedTile] = useState<number>(-1);
  const [hoveredTile, setHoveredTile] = useState<number>(-1);

  const boardProps = {
    currBoard,
    selectedTile,
    setSelectedTile,
    hoveredTile,
    setHoveredTile,
  };

  const getTileValue = (x: number, y: number) => currBoard[y][x];
  const getTileValueById = (id: number) => {
    if (selectedTile < 0) {
      return 0;
    }
    const [x, y] = getTileFromId(id);
    return getTileValue(x, y);
  };

  const setNumber = (x: number, y: number, val: number) => {
    const nb = currBoard.slice();
    nb[y][x] = val;
    setCurrBoard(nb);
  };

  const clearNumber = (x: number, y: number) => {
    setNumber(x, y, 0);
  };

  const handleSetValue = (val: number) => {
    if (selectedTile < 0) {
      return;
    }
    const [x, y] = getTileFromId(selectedTile);
    setNumber(x, y, val);
  };

  return (
    <div className="sudoku">
      <GameBoard {...boardProps} />
      <Numpad currVal={getTileValueById(selectedTile)} onSet={handleSetValue} />
    </div>
  );
};

export default Sudoku;
