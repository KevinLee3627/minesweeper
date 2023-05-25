import { Board } from "./board";

export class Game extends EventTarget {
  board: Board;
  time = 0;

  constructor(board: Board) {
    super();
    this.board = board;
  }
}

function main() {
  const board = new Board(16, 30, 99);
}

main();
