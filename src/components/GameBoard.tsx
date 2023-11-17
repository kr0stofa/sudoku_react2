import React, { useState } from "react";
import Tile from "./Tile";
import "./sudoku.css";
import type { Board } from "./types";

const getTileID = (x: number, y: number) => y * 100 + x;
const getTileFromId = (id: number) => [id % 100, Math.floor(id / 100)];

interface BoardProps {
  currBoard: Board;
  setCurrBoard: (b: Board) => void;
  hoveredTile: number;
  setHoveredTile: (t: number) => void;
  selectedTile: number;
  setSelectedTile: (t: number) => void;
}

const GameBoard = ({
  currBoard,
  setCurrBoard,
  hoveredTile,
  setHoveredTile,
  selectedTile,
  setSelectedTile,
}: BoardProps) => {
  const clearNumber = (x: number, y: number) => {
    if (!currBoard) return;
    setCurrBoard(currBoard.slice());
  };
  const setNumber = (x: number, y: number) => {
    return (val: number) => {
      const nb = currBoard.slice();
      nb[y][x] = val;
      setCurrBoard(nb);
    };
  };

  const handleHover = (x: number, y: number) => {
    return () => {
      setHoveredTile(getTileID(x, y));
    };
  };

  const handleHoverEnd = (x: number, y: number) => {
    return () => {
      setHoveredTile(-1);
    };
  };

  const isHighlighted = (x: number, y: number) => {
    const [hx, hy] = getTileFromId(hoveredTile);
    return x === hx || y === hy;
  };

  const handleClick = (x: number, y: number) => {
    return () => {
      setSelectedTile(getTileID(x, y));
      setNumber(x, y)(Math.round(1 + Math.random() * 8));
    };
  };

  return (
    <div className="gameboard">
      {currBoard?.map((r, y) => (
        <div className="row" key={`row-${y}`}>
          {r.map((v, x) => (
            <Tile
              key={`t-${getTileID(x, y)}`}
              x={x}
              y={y}
              value={v}
              isHighlighted={isHighlighted(x, y)}
              onHover={handleHover(x, y)}
              onHoverEnd={handleHoverEnd(x, y)}
              isSelected={getTileID(x, y) === selectedTile}
              onClick={handleClick(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
