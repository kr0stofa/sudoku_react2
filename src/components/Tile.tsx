import React from "react";
import "./sudoku.css";

interface TileProps {
  x: number;
  y: number;
  value: number;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}

const Tile = ({
  x,
  y,
  value,
  onClick,
  isSelected,
  isHighlighted,
  onHover,
  onHoverEnd,
}: TileProps) => {
  const borderLeft = x % 3 === 0;
  const borderTop = y % 3 === 0;

  const getBordersClassNames = () =>
    `${borderTop ? "border-top" : ""} ${borderLeft ? "border-left" : ""} ${
      y === 8 ? "border-bottom" : ""
    } 
    ${x === 8 ? "border-right" : ""}`;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      className={`tile ${getBordersClassNames()}`}
    >
      <span
        className={`tile-content ${isSelected ? "selected" : ""} ${
          isHighlighted ? "highlight" : ""
        }`}
      >
        {value > 0 ? value : ""}
      </span>
    </div>
  );
};

export default Tile;
