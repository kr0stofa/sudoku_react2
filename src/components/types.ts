export type Board = Array<Array<number>>;

export type AvailBoard = Map<number, Array<number>>;

export interface Action {
  tileId: number,
  val: number
}