import React, { memo, useCallback, useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import { Board } from "./types";
import "./sudoku.css";
import Numpad from "./Numpad";
import { puzzles } from "./puzzles";
import {
  getAvailableNumbersById,
  getBestMove,
  getTileFromId,
  getTileValue,
  getTileValueById,
  isBoardFilled,
} from "./game-logic";

const ROWS = 9;
const COLS = 9;

const getEmptyBoard = () =>
  new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0)) as Board;

function useForceUpdate() {
  const [, setToggle] = useState(false);
  return () => setToggle((toggle) => !toggle);
}

const Sudoku = () => {
  const [isAutosolving, setAutosolving] = useState<boolean>(false);
  const [autosolveTimeout, setAutosolveTimeout] = useState<number>();
  const [btnDisabled, setBtnDisabled] = useState<string>("");
  const [currBoard, setCurrBoard] = useState<Board>(getEmptyBoard());
  const [autoSolveDelay, setAutoSolveDelay] = useState<number>(500);
  const [prevBoard, setPrevBoard] = useState<Board>(getEmptyBoard());
  const [validBoard, setValidBoard] = useState<Board>(getEmptyBoard());
  const [selectedTile, setSelectedTile] = useState<number>(-1);
  const [hoveredTile, setHoveredTile] = useState<number>(-1);
  const [currAvailNums, setCurrAvailNums] = useState<Array<number>>([]);

  // ==================== Tile Helper Functions ====================

  const isTileValid = (x: number, y: number, val: number, b: Board) => {
    if (val === 0) {
      return true;
    }

    let valid = true;

    // Horizontal check
    valid = !b[y].some((v: number, dx: number) => v === val && dx !== x);

    if (!valid) {
      // console.log("hori fail", b[y]);
      return false;
    }

    // Vertical check
    valid = !b.some((e, dy) => e[x] === val && dy !== y);

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

    valid = !boxRows.some((dy) =>
      boxCols.some((dx) => b[dy][dx] === val && (dx !== x || dy !== y))
    );

    return valid;
  };

  // ==================== Mutators ====================
  const clearBoard = () => {
    setAutosolving(false);
    setCurrBoard(getEmptyBoard());
  };

  const updateValidBoard = useCallback(
    (b: Board) => {
      // console.log("Updating Valid Board");
      const newVB = getEmptyBoard();
      currBoard.forEach((r, y) =>
        r.forEach((v, x) => (newVB[y][x] = isTileValid(x, y, v, b) ? 1 : 0))
      );
      setValidBoard(newVB);
      // console.log("Finished updating Valid Board");
    },
    [currBoard]
  );

  const setNumber = (x: number, y: number, val: number, b: Board) => {
    const nb = b.map((r) => [...r]);
    nb[y][x] = val;
    setCurrBoard(nb);
    return nb;
  };

  // const clearNumber = (x: number, y: number) => {
  //   setNumber(x, y, 0);
  // };

  const handleSetValue = (tileId: number, val: number, b: Board) => {
    if (tileId < 0) {
      return;
    }

    if (getTileValueById(tileId, b) === val) {
      return;
    }

    // Capture previous board
    const pb = b.map((r) => [...r]);
    setPrevBoard(pb);

    const [x, y] = getTileFromId(tileId);
    // const v = isTileValid(x, y, val, pb);

    // Set the number
    return setNumber(x, y, val, b);
  };

  const chooseSelectedTile = (id: number) => {
    setSelectedTile(id);
    setCurrAvailNums(getAvailableNumbersById(id, currBoard));
  };

  // ==================== Auto solver ====================
  const doBestMove = (board: Board) => {
    if (isBoardFilled(board)) {
      return;
    }

    const { tileId, val } = getBestMove(board);

    chooseSelectedTile(tileId);
    return handleSetValue(tileId, val, board);
  };

  const autoSolve = (board: Board) => {
    const nb = doBestMove(board);
    if (!nb) {
      window.console.log("ERROR doing best move");
      clearTimeout(autosolveTimeout);
      setAutosolveTimeout(0);
      setAutosolving(false);
      return;
    }
    setAutosolveTimeout(window.setTimeout(() => autoSolve(nb), autoSolveDelay));
  };

  const handleAutoSolve = () => {
    clearTimeout(autosolveTimeout);
    setAutosolveTimeout(0);

    if (isAutosolving) {
      setAutosolving(false);
      return;
    }

    setAutosolving(true);
    setBtnDisabled("disabled");
    autoSolve(currBoard);
  };

  // ==================== Game functions ====================
  const setBoardToPuzzle = (difficulty: number) => {
    setPrevBoard(getEmptyBoard());
    let newPuzzle = [];
    switch (difficulty) {
      case 1:
        newPuzzle = puzzles.medium;
        break;
      case 2:
        newPuzzle = puzzles.hard;
        break;
      default:
        newPuzzle = puzzles.easy;
    }

    setSelectedTile(-1);
    setCurrBoard(newPuzzle);
  };

  // ==================== Hooks ====================
  // Update validBoard whenever currBoard changes
  useEffect(() => {
    if (!isAutosolving) {
      updateValidBoard(currBoard);
    }
  }, [isAutosolving, updateValidBoard, currBoard]);

  useEffect(() => {
    setCurrBoard(puzzles.medium);
  }, [setCurrBoard]);

  const boardProps = {
    getTileValue: (x: number, y: number) => getTileValue(x, y, currBoard),
    validBoard,
    selectedTile,
    chooseSelectedTile,
    hoveredTile,
    setHoveredTile,
  };

  return (
    <div className="sudoku">
      <GameBoard {...boardProps} />
      <div className="actions-group">
        <div className="puzzle-select">
          <button className="btn-ui" onClick={() => setBoardToPuzzle(0)}>
            Easy
          </button>
          <button className="btn-ui" onClick={() => setBoardToPuzzle(1)}>
            Medium
          </button>
          <button className="btn-ui" onClick={() => setBoardToPuzzle(2)}>
            Hard
          </button>
        </div>

        <Numpad
          availableNums={currAvailNums}
          currVal={getTileValueById(selectedTile, currBoard)}
          onSet={(v: number) => handleSetValue(selectedTile, v, currBoard)}
        />

        <div className="slidecontainer">
          <input
            disabled={isAutosolving}
            type="range"
            min="50"
            max="2500"
            value={autoSolveDelay}
            className="slider"
            id="myRange"
            onChange={(e) => setAutoSolveDelay(parseInt(e.target.value))}
          />
          <span className="text-input-label">{autoSolveDelay}ms</span>

          <button
            className={`btn-ui btn-wide  ${btnDisabled}`}
            onClick={handleAutoSolve}
          >
            {!isAutosolving ? "Auto Solve" : "Stop"}
          </button>
        </div>

        <button
          className={`btn-ui btn-wide ${btnDisabled}`}
          onClick={clearBoard}
        >
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default Sudoku;
