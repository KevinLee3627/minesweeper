import { Board, BoardSettings } from "./board";

export enum Difficulty {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
}

const difficultySettings: Map<Difficulty, BoardSettings> = new Map();
difficultySettings.set(Difficulty.BEGINNER, {
  rows: 9,
  cols: 9,
  numMines: 10,
});
difficultySettings.set(Difficulty.INTERMEDIATE, {
  rows: 16,
  cols: 16,
  numMines: 40,
});
difficultySettings.set(Difficulty.EXPERT, {
  rows: 16,
  cols: 30,
  numMines: 99,
});

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

function startGame(difficulty: Difficulty) {
  // Clear Cell HTML elements that may exist.
  const cells = Array.from(document.getElementsByClassName("cell"));
  cells.forEach(element => {
    element.remove();
  });

  const boardSettings = difficultySettings.get(difficulty);
  if (boardSettings == null) {
    throw new Error("Invalid game settings loaded.");
  }
  const board = new Board(boardSettings);
  const game = new Game(board);
}

function main() {
  const btnSelectBeginner = document.getElementById("selectBeginner");
  const btnSelectIntermediate = document.getElementById("selectIntermediate");
  const btnSelectExpert = document.getElementById("selectExpert");
  if (
    btnSelectBeginner == null ||
    btnSelectIntermediate == null ||
    btnSelectExpert == null
  ) {
    throw new Error("Difficulty select buttons not found.");
  }
  const difficultySelectBtns = [
    btnSelectBeginner,
    btnSelectIntermediate,
    btnSelectExpert,
  ];

  difficultySelectBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      if (!(e.target instanceof HTMLElement)) return null;

      const difficulty = Number(e.target.dataset.difficulty);
      startGame(difficulty);
    });
  });
}

main();
