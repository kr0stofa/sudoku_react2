import React, { useCallback, useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import { Action, AvailBoard, Board } from "./types";
import "./sudoku.css";
import Numpad from "./Numpad";
import { puzzles } from "./puzzles";

const getTileID = (x: number, y: number) => y * 100 + x;
const getTileFromId = (id: number) => [id % 100, Math.floor(id / 100)];

const ROWS = 9;
const COLS = 9;

const getEmptyBoard = () =>
  new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0)) as Board;

const Sudoku = () => {
  const [currBoard, setCurrBoard] = useState<Board>(getEmptyBoard());
  const [prevBoard, setPrevBoard] = useState<Board>(getEmptyBoard());
  const [validBoard, setValidBoard] = useState<Board>(getEmptyBoard());
  const [availBoard, setAvailBoard] = useState<AvailBoard>();
  const [selectedTile, setSelectedTile] = useState<number>(-1);
  const [hoveredTile, setHoveredTile] = useState<number>(-1);
  const [currAvailNums, setCurrAvailNums] = useState<Array<number>>([]);

  // ==================== Tile Helper Functions ====================
  const getTileValue = (x: number, y: number) => currBoard[y][x];
  const getTileValueById = (id: number) => {
    if (selectedTile < 0) {
      return 0;
    }
    const [x, y] = getTileFromId(id);
    return getTileValue(x, y);
  };

  const getAvailableNumbers = (x: number, y: number, b: Board) => {
    const avail = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const unavail = new Map<number, boolean>();
    b[y].forEach((v: number) => unavail.set(v, true));
    b.forEach((r: Array<number>) => unavail.set(r[x], true));

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

    boxRows.forEach((y) => boxCols.forEach((x) => unavail.set(b[y][x], true)));

    return avail.filter((n) => !unavail.has(n));
  };

  const getAvailableNumbersById = (id: number, b: Board) => {
    if (id < 0) {
      return [];
    }
    const [x, y] = getTileFromId(id);
    const a = getAvailableNumbers(x, y, b);
    // console.log(`Available numbers at [${x},${y}]: ${a}`);
    return a;
  };

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

  const updateAvailBoard = useCallback(
    (b: Board) => {
      // console.log("Updating AvailBoard");
      const newAB = new Map() as AvailBoard;
      currBoard.forEach((r, y) =>
        r.forEach((v, x) =>
          newAB.set(getTileID(x, y), getAvailableNumbers(x, y, b))
        )
      );
      setAvailBoard(newAB);
      // console.log("Finished updating AvailBoard", newAB);
    },
    [currBoard]
  );

  const setNumber = (x: number, y: number, val: number) => {
    const nb = currBoard.map((r) => [...r]);
    nb[y][x] = val;
    setCurrBoard(nb);
  };

  const clearNumber = (x: number, y: number) => {
    setNumber(x, y, 0);
  };

  const handleSetValue = (tileId: number, val: number) => {
    if (tileId < 0) {
      return;
    }

    if (getTileValueById(tileId) === val) {
      return;
    }

    // Capture previous board
    const pb = currBoard.map((r) => [...r]);
    setPrevBoard(pb);

    const [x, y] = getTileFromId(tileId);
    // const v = isTileValid(x, y, val, pb);

    // Set the number
    setNumber(x, y, val);
  };

  const chooseSelectedTile = async (id: number) => {
    setSelectedTile(id);
    setCurrAvailNums(getAvailableNumbersById(id, currBoard));
  };

  // ==================== Constraint solver ====================
  const getBestMove = () => {
    let r = { tileId: -1, val: 1 } as Action;

    if (!availBoard) {
      return r;
    }

    let min = 10;
    let bestId = -1;
    let bestOptions = [] as Array<number>;

    availBoard.forEach((nums, id) => {
      const l = nums.length;
      if (l < 1) {
        // Some square has run out of moves!
        return r;
      }

      if (getTileValueById(id) === 0) {
        // Get most constrained space
        if (l < min) {
          min = l;
          bestId = id;
          bestOptions = nums;
        }
      }
    });

    r.tileId = bestId;
    r.val = bestOptions[Math.floor(Math.random() * bestOptions.length)];

    console.log(`Best move is: ${r.tileId} ${r.val}`);
    return r;
  };

  const doBestMove = () => {
    const { tileId, val } = getBestMove();

    chooseSelectedTile(tileId);
    setTimeout(() => handleSetValue(tileId, val), 100);
  };

  // ==================== Hooks ====================
  // Update validBoard whenever currBoard changes
  useEffect(() => {
    updateValidBoard(currBoard);
    updateAvailBoard(currBoard);
  }, [updateValidBoard, updateAvailBoard, currBoard]);

  useEffect(() => {
    setCurrBoard(puzzles.medium);
  }, [setCurrBoard]);

  const boardProps = {
    currBoard,
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
        <Numpad
          availableNums={currAvailNums}
          currVal={getTileValueById(selectedTile)}
          onSet={(v: number) => handleSetValue(selectedTile, v)}
        />

        <button className="btn-next" onClick={doBestMove}>
          Fill Next
        </button>
        <button className="btn-next" onClick={clearBoard}>
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default Sudoku;
