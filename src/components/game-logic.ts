import { Action, Board, AvailBoard } from "./types";

export const isInvalidCoords = (x: number, y: number) =>
  x > 8 || y > 8 || x < 0 || y < 0;

export const getTileID = (x: number, y: number) => y * 100 + x;
export const getTileFromId = (id: number) => [id % 100, Math.floor(id / 100)];

export const getTileValue = (x: number, y: number, b: Board) => b[y][x];

export const getTileValueById = (id: number, b: Board) => {
  if (id < 0) {
    return 0;
  }
  const [x, y] = getTileFromId(id);
  return getTileValue(x, y, b);
};

export const isBoardFilled = (b: Board) => {
  return b.every((r) => r.every((v) => v > 0));
};

export const getAvailableNumbers = (x: number, y: number, b: Board) => {
  const avail = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const unavail = new Map<number, boolean>();
  b[y].forEach((v: number, tx: number) => {
    if (tx !== x) {
      unavail.set(v, true);
    }
  });

  b.forEach((r: Array<number>, ty: number) => {
    if (ty !== y) {
      unavail.set(r[x], true);
    }
  });

  if (unavail.set.length === 9) {
    return [];
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

  boxRows.forEach((by) =>
    boxCols.forEach((bx) => {
      if (by !== y || bx !== x) {
        unavail.set(b[by][bx], true);
      }
    })
  );

  return avail.filter((n) => !unavail.has(n));
};

export const getAvailableNumbersById = (id: number, b: Board) => {
  if (id < 0) {
    return [];
  }
  const [x, y] = getTileFromId(id);
  const a = getAvailableNumbers(x, y, b);
  // console.log(`Available numbers at [${x},${y}]: ${a}`);
  return a;
};

export const generateAvailBoard = (b: Board) => {
  const newAB = new Map() as AvailBoard;

  b.forEach((r, y) =>
    // Skip tiles that already have value
    r.forEach((v, x) => {
      if (v === 0) {
        // Filter for unassigned tiles
        newAB.set(getTileID(x, y), getAvailableNumbers(x, y, b));
      }
    })
  );
  return newAB;
};

// ==================== Constraint solver ====================

export const useAutoSolver = () => {
  // Type of Availboard
  const badAssignBoard = new Map<number, number[]>();
  const guesses: Action[] = []; // Numbers randomly chosen
  const history: Action[] = [];
  let undoTarget = -1;
  let undoCount = 0;

  const startNewAttempt = () => {
    undoCount = 0;
    history.splice(0, history.length);
    guesses.splice(0, guesses.length);
    badAssignBoard.clear();
  };

  const getUndoAction = () => {
    const lastMove = { ...history.pop() } as Action;

    if (!lastMove) {
      console.error(`No history!`);
      return { tileId: -1, val: 0 } as Action;
    }

    // Clear bad guesses if undo
    if (lastMove.tileId !== undoTarget) {
      badAssignBoard.set(lastMove.tileId, []);
    }

    return {
      tileId: lastMove.tileId,
      val: 0,
    } as Action;
  };

  const getBestMove = (b: Board, badAssignBoard: AvailBoard) => {
    let r = { tileId: -1, val: 1 } as Action;

    if (undoCount > 0) {
      // console.log("Undoing!");
      undoCount -= 1;
      return getUndoAction();
    }

    if (isBoardFilled(b)) {
      return { ...r };
    }

    const ab = generateAvailBoard(b);
    if (!ab) {
      return { ...r };
    }

    let min = 10;
    let bestId = -1;
    let bestOptions = [] as Array<number>;

    const aba = Array.from(ab.entries());
    for (let [id, nums] of aba) {
      const badA = badAssignBoard.get(id) || [];
      const fnums =
        badA.length < 1 ? nums : nums.filter((e) => !badA.includes(e));
      const l = fnums.length;
      if (l < 1) {
        // Some square has run out of moves!
        // console.error(`No moves left for ${id}!`);

        // Pop the most recent guess
        const rg = { ...guesses.pop() } as Action;
        console.log("rg", rg, guesses.slice());
        if (!rg) {
          console.error(`No more guesses to pop!`);
          return { ...r };
        }

        // console.log(`Popping most recent guess: ${rg.tileId}=>${rg.val}`);

        // Record that the guess is bad (has led to a dead end)
        const gTileId = rg.tileId;
        const gVal = rg.val;
        const badguesses = badAssignBoard.get(gTileId) || [];
        badAssignBoard.set(gTileId, [...badguesses, gVal]);

        // Set undo count
        undoTarget = gTileId;
        const guessIdx = history.findIndex((e) => e.tileId === gTileId);
        if (guessIdx < 0) {
          console.error("Guess cannot be found in history!");
          console.log("Tile:", gTileId, "Value:", gVal);
          console.log("Err History:", history.slice());
          undoCount = 0;
          return { ...r };
        }

        undoCount = history.length - guessIdx - 1;
        // console.log(
        //   "History length:",
        //   history.length,
        //   "Moves to undo:",
        //   undoCount
        // );

        // Begin undo
        r = getUndoAction();
        return { ...r };
      }

      // Get unassigned tile
      if (getTileValueById(id, b) === 0) {
        // Get most constrained space
        if (l < min) {
          min = l;
          bestId = id;
          bestOptions = fnums;
        }
      }
    }

    r.tileId = bestId;
    r.val = bestOptions[Math.floor(Math.random() * bestOptions.length)];

    if (min > 1) {
      // console.log(`Guessing ${r.tileId}=${r.val} from: ${bestOptions}`);
      guesses.push({ ...r });
    }
    // console.log(`${min > 1 ? "Best" : "Only"} move is: ${r.tileId} ${r.val}`);

    history.push({ ...r });

    return { ...r };
  };

  const getMove = (b: Board) => getBestMove(b, badAssignBoard);

  return {
    startNewAttempt,
    getMove,
  };
};
