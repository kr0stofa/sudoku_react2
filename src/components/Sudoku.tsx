import React, { useCallback, useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import { Board } from "./types";
import "./sudoku.css";
import "./ui.css";
import Numpad from "./Numpad";
import { puzzles } from "./puzzles";
import {
  getAvailableNumbersById,
  getTileFromId,
  getTileID,
  getTileValue,
  getTileValueById,
  isBoardFilled,
  isInvalidCoords,
  useAutoSolver,
} from "./game-logic";

const ROWS = 9;
const COLS = 9;

const getEmptyBoard = () =>
  new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0)) as Board;

interface Args {
  mobile: boolean;
}

const difficulties = [
  ["Easy", 0],
  ["Medium", 1],
  ["Hard", 2],
];

const Sudoku = ({ mobile }: Args) => {
  const [autosolveTimeout, setAutosolveTimeout] = useState<number>();
  const [isAutosolving, setAutosolving] = useState<boolean>(false);

  const [btnDisabled, setBtnDisabled] = useState<string>("");
  const [currBoard, setCurrBoard] = useState<Board>(getEmptyBoard());
  const [fixedBoardNumbers, setFixedBoardNumbers] = useState<Board>(
    getEmptyBoard()
  );
  const [autoSolveDelay, setAutoSolveDelay] = useState<number>(500);
  const [prevBoard, setPrevBoard] = useState<Board>(getEmptyBoard());
  const [validBoard, setValidBoard] = useState<Board>(getEmptyBoard());
  const [selectedTile, setSelectedTile] = useState<number>(-1);
  const [hoveredTile, setHoveredTile] = useState<number>(-1);
  const [difficulty, setDifficulty] = useState<number>(-1);
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
    setDifficulty(-1);
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

  const handleSetValue = (tileId: number, val: number, b: Board) => {
    if (tileId < 0) {
      return;
    }

    if (getTileValueById(tileId, b) === val) {
      return;
    }

    const [x, y] = getTileFromId(tileId);

    // Check if it is a puzzle piece
    if (fixedBoardNumbers[y][x] > 0) {
      return;
    }

    // Capture previous board
    const pb = b.map((r) => [...r]);
    setPrevBoard(pb);

    // Set the number
    return setNumber(x, y, val, b);
  };

  const clearNumber = (x: number, y: number, b: Board) => {
    handleSetValue(getTileID(x, y), 0, b);
  };

  const handleSelectTile = (id: number) => {
    setSelectedTile(id);
    setCurrAvailNums(getAvailableNumbersById(id, currBoard));
  };

  // ==================== Auto solver ====================

  const autosolver = useAutoSolver();
  const doBestMove = (board: Board) => {
    if (isBoardFilled(board)) {
      return;
    }

    const { tileId, val } = autosolver.getMove(board);

    handleSelectTile(tileId);
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

    autosolver.startNewAttempt();
    setAutosolving(true);
    setBtnDisabled("disabled");
    autoSolve(currBoard);
  };

  // ==================== Game functions ====================
  const setBoardToPuzzle = (d: number) => {
    setPrevBoard(getEmptyBoard());
    setDifficulty(d);
    let newPuzzle = [];
    switch (d) {
      case 1:
        newPuzzle = puzzles.medium;
        break;
      case 2:
        newPuzzle = puzzles.hard;
        break;
      default:
        newPuzzle = puzzles.easy;
    }

    handleSelectTile(-1);
    setFixedBoardNumbers(newPuzzle);
    setCurrBoard(newPuzzle);
  };

  // ==================== Keyboard handlers ====================

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    const [x, y] = getTileFromId(selectedTile);
    let [nx, ny] = [-1, -1];

    let newVal = -1;

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

      case "0":
      case "Escape":
      case "Backspace":
        clearNumber(x, y, currBoard);
        break;

      default:
        const n = parseInt(key);
        console.log("key", key, n, !!n);
        if (n) {
          newVal = n;
        }
        break;
    }

    if (nx > -1) {
      // A move
      if (isInvalidCoords(nx, ny)) {
        return;
      }

      const id = getTileID(nx, ny);
      handleSelectTile(id);
      setHoveredTile(id);
    }

    if (newVal > -1) {
      // A number
      console.log("set val", newVal);
      handleSetValue(selectedTile, newVal, currBoard);
    }
  };

  // ==================== Hooks ====================
  // Update validBoard whenever currBoard changes
  useEffect(() => {
    if (!isAutosolving || true) {
      updateValidBoard(currBoard);
    }
  }, [isAutosolving, updateValidBoard, currBoard]);

  useEffect(() => {
    setBoardToPuzzle(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const boardProps = {
    getTileValue: (x: number, y: number) => getTileValue(x, y, currBoard),
    validBoard,
    selectedTile,
    handleSelectTile,
    hoveredTile,
    fixedBoardNumbers,
    setHoveredTile,
  };

  // Sub-elements
  const PuzzleSelector = () => {
    return (
      <div className="puzzle-select">
        {difficulties.map(([txt, puzzleId]) => (
          <button
            className={`btn-ui${
              difficulty === (puzzleId as number) ? " active" : ""
            }`}
            disabled={isAutosolving}
            onClick={() => setBoardToPuzzle(puzzleId as number)}
          >
            {txt}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      tabIndex={0}
      className={`sudoku${mobile ? " mobile" : ""}`}
      onKeyDown={handleKeyDown}
    >
      {mobile && <PuzzleSelector />}

      <GameBoard {...boardProps} />

      {!mobile && (
        <div className="actions-group">
          <PuzzleSelector />

          <Numpad
            availableNums={currAvailNums}
            currVal={getTileValueById(selectedTile, currBoard)}
            onSet={(v: number) => handleSetValue(selectedTile, v, currBoard)}
          />

          <div className="slidecontainer">
            <input
              disabled={isAutosolving}
              type="range"
              min="20"
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
      )}

      {mobile && (
        <Numpad
          availableNums={currAvailNums}
          currVal={getTileValueById(selectedTile, currBoard)}
          onSet={(v: number) => handleSetValue(selectedTile, v, currBoard)}
          mobile
        />
      )}
    </div>
  );
};

export default Sudoku;
