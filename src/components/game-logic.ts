import { Action, Board, AvailBoard } from "./types";

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
  b[y].forEach((v: number) => unavail.set(v, true));
  b.forEach((r: Array<number>) => unavail.set(r[x], true));

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

  boxRows.forEach((y) => boxCols.forEach((x) => unavail.set(b[y][x], true)));

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
        newAB.set(getTileID(x, y), getAvailableNumbers(x, y, b));
      }
    })
  );
  return newAB;
};

// ==================== Constraint solver ====================
export const getBestMove = (b: Board) => {
  let r = { tileId: -1, val: 1 } as Action;

  if (isBoardFilled(b)) {
    return r;
  }

  const ab = generateAvailBoard(b);
  if (!ab) {
    return r;
  }

  let min = 10;
  let bestId = -1;
  let bestOptions = [] as Array<number>;

  // console.log("availboard", ab, "board", b);

  ab.forEach((nums, id) => {
    const l = nums.length;
    if (l < 1) {
      // Some square has run out of moves!
      return r;
    }

    if (getTileValueById(id, b) === 0) {
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
