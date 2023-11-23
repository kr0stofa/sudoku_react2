import React from "react";
import Tile from "./Tile";
import "./sudoku.css";
import type { Board } from "./types";
import { getTileID, getTileFromId } from "./game-logic";

interface BoardProps {
  getTileValue: (x: number, y: number) => number;
  validBoard: Board;
  fixedBoardNumbers: Board;
  hoveredTile: number;
  setHoveredTile: (t: number) => void;
  selectedTile: number;
  handleSelectTile: (t: number) => void;
}

const DEFAULT_BOARD = new Array(9)
  .fill(null)
  .map((_, i) => new Array(9).fill(null));

const GameBoard = ({
  getTileValue,
  validBoard,
  hoveredTile,
  setHoveredTile,
  selectedTile,
  fixedBoardNumbers,
  handleSelectTile,
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

  const isHovered = (x: number, y: number) => hoveredTile === getTileID(x, y);

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
      handleSelectTile(getTileID(x, y));
    };
  };

  const getTileProps = (x: number, y: number) => ({
    x: x,
    y: y,
    value: getTileValue(x, y),
    isValid: !!validBoard[y][x],
    isFocused: isHovered(x, y),
    isFixed: fixedBoardNumbers[y][x] > 0,
    isHighlighted: isHighlighted(x, y),
    onHover: handleHover(x, y),
    onHoverEnd: handleHoverEnd(x, y),
    isSelected: getTileID(x, y) === selectedTile,
    onClick: handleClick(x, y),
  });

  return (
    <div className="gameboard">
      {DEFAULT_BOARD.map((r, y) => (
        <div className="row" key={`row-${y}`}>
          {r.map((v, x) => (
            <Tile key={`t-${getTileID(x, y)}`} {...getTileProps(x, y)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
