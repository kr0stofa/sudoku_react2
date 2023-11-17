import React from "react";
import "./numpad.css";
interface Props {
  onSet: (n: number) => void;
  currVal: number;
}
const Numpad = ({ onSet, currVal }: Props) => {
  return (
    <div className="numpad">
      <div className="num-grid">
        {new Array(9).fill(null).map((_, i) => (
          <button
            onClick={() => onSet(i + 1)}
            className={`number ${currVal === i + 1 ? "highlight" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Numpad;
