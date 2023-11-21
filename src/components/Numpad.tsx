import React from "react";
import "./numpad.css";
interface Props {
  onSet: (n: number) => void;
  currVal: number;
  availableNums: Array<number>;
}
const Numpad = ({ onSet, currVal, availableNums }: Props) => {
  return (
    <div className="numpad">
      {new Array(9).fill(null).map((_, i) => (
        <button
          key={`num-${i + 1}`}
          onClick={() => onSet(i + 1)}
          className={`number ${currVal === i + 1 ? "highlight" : ""} ${
            !availableNums.includes(i + 1) ? "badnum" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Numpad;
