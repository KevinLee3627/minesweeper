import { Board, BoardSettings } from "./board";
import { Timer } from "./timer";

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

export class Game {
  board: Board | null = null;
  time = 0;
  difficulty: Difficulty = Difficulty.BEGINNER;

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  setBoard(board: Board): void {
    this.board = board;
  }

  start(difficulty: Difficulty) {
    // Clear Cell HTML elements that may exist.
    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(element => {
      element.remove();
    });

    this.board?.cleanup();

    const boardSettings = difficultySettings.get(difficulty);
    if (boardSettings == null) {
      throw new Error("Invalid game settings loaded.");
    }
    const timer = new Timer(1000);
    const board = new Board({ ...boardSettings, timer });
    this.setBoard(board);
  }
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

  const game = new Game();

  difficultySelectBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      if (!(e.target instanceof HTMLElement)) return;

      const difficulty = Number(e.target.dataset.difficulty);
      game.start(difficulty);
    });
  });
}

main();
