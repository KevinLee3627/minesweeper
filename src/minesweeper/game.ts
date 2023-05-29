import { Board, BoardSettings } from "./board";
import { Settings, SettingsManager } from "./settings";
import { Timer } from "./timer";
import { isCustomEvent } from "./util";

export enum Difficulty {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
}

export enum GameStatus {
  WIN,
  LOSE,
  RESET,
}

export interface GameEndEvent {
  status: GameStatus;
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
  timer: Timer = new Timer(1000);
  difficulty: Difficulty = Difficulty.BEGINNER;
  settings: Settings;

  element: HTMLElement;

  constructor(settings: Settings) {
    this.settings = settings;
    const element = document.getElementById("gameContainer");
    if (element == null) throw new Error(`Could not gameContainer}`);
    this.element = element;
    this.element.addEventListener("gameEnd", this.end.bind(this));
  }

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  setBoard(board: Board): void {
    this.board = board;
  }

  start() {
    const boardSettings = difficultySettings.get(this.difficulty);
    if (boardSettings == null) {
      throw new Error("Invalid game settings loaded.");
    }

    if (this.settings.showTimer) {
      this.timer.show();
    } else {
      this.timer.hide();
    }

    const board = new Board({ ...boardSettings, timer: this.timer });
    this.setBoard(board);
  }

  end(e: Event) {
    if (!isCustomEvent<GameEndEvent>(e, "status"))
      throw new Error("Not gameEnd event");
    this.board?.cleanup();
    this.timer.reset();
    this.timer.hide();

    if (this.settings.autoRestart) {
      this.start();
    }
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

  const settingsManager = new SettingsManager();
  settingsManager.save();

  let activeGame: Game | null = null;

  difficultySelectBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      if (!(e.target instanceof HTMLElement)) return;

      const gameEndEvent = new CustomEvent("gameEnd", {
        bubbles: true,
        detail: { status: GameStatus.RESET },
      });
      activeGame?.board?.elem.dispatchEvent(gameEndEvent);

      activeGame = new Game(settingsManager.load());

      const difficulty = Number(e.target.dataset.difficulty);
      activeGame.setDifficulty(difficulty);
      activeGame.start();
    });
  });
}

main();
