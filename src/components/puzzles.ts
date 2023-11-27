import { Board } from "./types";

const garena = [
  "409253071",
  "020981560",
  "518607203",
  "694070325",
  "001302740",
  "230495018",
  "170504906",
  "980016432",
  "046800150",
];

const easy = [
  "702051900",
  "304920100",
  "000070650",
  "931000000",
  "200007380",
  "670340019",
  "497680201",
  "100030000",
  "000009407",
];

const medium = [
  "000500000",
  "950000080",
  "038007250",
  "103000009",
  "009704162",
  "046219000",
  "017000300",
  "000050720",
  "000000090",
];

const hard = [
  "300040960",
  "900008010",
  "600005000",
  "008004090",
  "100300020",
  "000000000",
  "000000506",
  "001050002",
  "007002040",
];

const puzzleToBoard = (p: Array<string>) => {
  const b = [] as Board;
  p.forEach((sr: string) => {
    const row = [];
    for (let i = 0; i < sr.length; i++) {
      row.push(parseInt(sr[i]));
    }
    b.push(row);
  });
  return b;
};

export const puzzles = {
  easy: puzzleToBoard(garena),
  medium: puzzleToBoard(medium),
  hard: puzzleToBoard(hard),
};
