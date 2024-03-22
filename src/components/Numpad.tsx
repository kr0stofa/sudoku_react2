import React, { memo } from "react";
import "./numpad.css";
interface Props {
  onSet: (n: number) => void;
  currVal: number;
  availableNums: Array<number>;
  mobile?: boolean;
}
const Numpad = ({ onSet, currVal, availableNums, mobile }: Props) => {
  // console.log("Numpad Rerender");

  const getButtonClassName = (i: number) =>
    `number${currVal === i + 1 ? " highlight" : ""}${
      !availableNums.includes(i + 1) ? " badnum" : ""
    }`;

  return (
    <div className="numpad">
      {new Array(9).fill(null).map((_, i) => (
        <button
          key={`num-${i + 1}`}
          onClick={() => onSet(i + 1)}
          className={getButtonClassName(i)}
        >
          {i + 1}
        </button>
      ))}
      {mobile && (
        <button className="number clear" onClick={() => onSet(0)}>
          X
        </button>
      )}
    </div>
  );
};

export default memo(Numpad);
