import React, { useCallback, useState } from "react";
import Tile from "./Tile";
import "./sudoku.css";
import type { Board } from "./types";
import { getTileID, getTileFromId } from "./game-logic";

interface BoardProps {
  getTileValue: (x: number, y: number) => number;
  validBoard: Board;
  hoveredTile: number;
  setHoveredTile: (t: number) => void;
  selectedTile: number;
  chooseSelectedTile: (t: number) => void;
}

const DEFAULT_BOARD = new Array(9)
  .fill(null)
  .map((_, i) => new Array(9).fill(null));

const isInvalidCoords = (x: number, y: number) =>
  x > 8 || y > 8 || x < 0 || y < 0;

const GameBoard = ({
  getTileValue,
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
    if (x === hx || y === hy) {
      return true;
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

    return boxCols.includes(hx) && boxRows.includes(hy);
  };

  const handleClick = (x: number, y: number) => {
    return () => {
      chooseSelectedTile(getTileID(x, y));
    };
  };

  // ==================== Keyboard handlers ====================

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    const [x, y] = getTileFromId(selectedTile);
    let [nx, ny] = [-1, -1];

    switch (key) {
      case "w":
      case "ArrowUp":
        [nx, ny] = [x, y - 1];
        break;

      case "s":
      case "ArrowDown":
        [nx, ny] = [x, y + 1];
        break;
      case "a":
      case "ArrowLeft":
        [nx, ny] = [x - 1, y];

        break;
      case "d":
      case "ArrowRight":
        [nx, ny] = [x + 1, y];
        break;

      default:
        console.log("key", key);
    }

    if (isInvalidCoords(nx, ny)) {
      return;
    }
    handleHover(nx, ny)();
    handleClick(nx, ny)();
  };

  return (
    <div tabIndex={0} className="gameboard" onKeyDown={handleKeyDown}>
      {DEFAULT_BOARD.map((r, y) => (
        <div className="row" key={`row-${y}`}>
          {r.map((v, x) => (
            <Tile
              key={`t-${getTileID(x, y)}`}
              x={x}
              y={y}
              value={getTileValue(x, y)}
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
