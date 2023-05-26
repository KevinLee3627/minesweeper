import { Board } from "./board";

export enum Difficulty {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
}

export class Game extends EventTarget {
  board: Board;
  time = 0;
  difficulty: Difficulty = Difficulty.BEGINNER;

  constructor(board: Board) {
    super();
    this.board = board;
  }

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }
}

function main() {
  const board = new Board(16, 30, 99);
  const game = new Game(board);
}

main();
