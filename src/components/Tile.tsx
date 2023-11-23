import React, { memo } from "react";
import "./sudoku.css";

interface TileProps {
  x: number;
  y: number;
  value: number;
  isFixed: boolean;
  isValid: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}

const Tile = memo(function Tile({
  x,
  y,
  value,
  onClick,
  isFixed,
  isValid,
  isFocused,
  isSelected,
  isHighlighted,
  onHover,
  onHoverEnd,
}: TileProps) {
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
      <div
        className={`tile-content ${isSelected ? "selected" : ""} 
        ${isFixed ? "fixed" : ""} 
        ${isFocused ? "focused" : ""} 
        ${isHighlighted ? "highlight" : ""} 
        ${!isValid ? "invalid" : ""}`}
      >
        <div className={`tile-number ${value === 0 ? "no-val" : ""}`}>
          {value > 0 ? value : ""}
        </div>
      </div>
    </div>
  );
});

// Memoize Tile
export default Tile;
