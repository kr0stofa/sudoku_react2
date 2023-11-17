import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { Board } from "./types";
import "./sudoku.css";

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
    setCurrBoard,
    selectedTile,
    setSelectedTile,
    hoveredTile,
    setHoveredTile,
  };

  return (
    <div className="sudoku">
      <GameBoard {...boardProps} />
    </div>
  );
};

export default Sudoku;
