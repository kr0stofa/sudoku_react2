import React, { useState } from "react";
import Tile from "./Tile";
import "./sudoku.css";
import type { Board } from "./types";

const getTileID = (x: number, y: number) => y * 100 + x;
const getTileFromId = (id: number) => [id % 100, Math.floor(id / 100)];

interface BoardProps {
  currBoard: Board;
  validBoard: Board;
  hoveredTile: number;
  setHoveredTile: (t: number) => void;
  selectedTile: number;
  chooseSelectedTile: (t: number) => void;
}

const GameBoard = ({
  currBoard,
  validBoard,
  hoveredTile,
  setHoveredTile,
  selectedTile,
  chooseSelectedTile,
}: BoardProps) => {
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
      chooseSelectedTile(getTileID(x, y));
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
              isValid={!!validBoard[y][x]}
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
