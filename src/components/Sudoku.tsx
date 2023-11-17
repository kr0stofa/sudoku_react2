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
  const [prevBoard, setPrevBoard] = useState<Board>(getEmptyBoard());
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

  const getAvailableNumbers = (x: number, y: number, val: number, b: Board) => {
    const avail = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const unavail = new Map<number, boolean>();
    b[y].forEach((v: number) => unavail.set(v, true));
  };

  const isTileValid = (x: number, y: number, val: number, b: Board) => {
    let valid = true;

    // Horizontal check
    valid = !b[y].some((v: number) => v === val);

    if (!valid) {
      // console.log("hori fail", b[y]);
      return false;
    }

    // Vertical check
    valid = !b.some((e) => e[x] === val);

    if (!valid) {
      // console.log("vert fail");
      return false;
    }

    // Box check
    let boxCols = [6, 7, 8];
    if (x < 3) {
      boxCols = [0, 1, 2];
    } else if (x < 6) {
      boxCols = [3, 4, 5];
    }

    let boxRows = [6, 7, 8];
    if (y < 3) {
      boxRows = [0, 1, 2];
    } else if (y < 6) {
      boxRows = [3, 4, 5];
    }

    valid = !boxRows.some((y) => boxCols.some((x) => b[y][x] === val));

    return valid;
  };

  const setNumber = (x: number, y: number, val: number) => {
    const nb = currBoard.map((r) => [...r]);
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

    if (getTileValueById(selectedTile) === val) {
      return;
    }

    // Capture previous board
    const pb = currBoard.map((r) => [...r]);
    setPrevBoard(pb);

    const [x, y] = getTileFromId(selectedTile);
    const v = isTileValid(x, y, val, pb);

    console.log("Valid?", v);
    // Set the number
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
