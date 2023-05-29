import { msToTime } from "./util";

export class GameEndBox {
  gameEndBoxElem: HTMLElement;
  titleElem: HTMLElement;
  timeElapsedElem: HTMLElement;

  title = "";

  constructor() {
    const gameEndBoxElem = document.getElementById("gameEndBox");
    if (gameEndBoxElem == null) throw new Error(`Could not find gameEndBox`);
    this.gameEndBoxElem = gameEndBoxElem;

    const titleElem = document.getElementById("gameEndBoxTitle");
    if (titleElem == null) throw new Error(`Could not find gameEndBoxTitle`);
    this.titleElem = titleElem;

    const timeElapsedElem = document.getElementById("timeElapsed");
    if (timeElapsedElem == null) throw new Error(`Could not find timeElapsed`);
    this.timeElapsedElem = timeElapsedElem;
  }

  setWin() {
    this.title = "You win!";
    this.titleElem.textContent = this.title;
  }

  setLose() {
    this.title = "You lose :(";
    this.titleElem.textContent = this.title;
  }

  setTimeElapsed(ms: number) {
    this.timeElapsedElem.textContent = msToTime(ms);
  }

  show() {
    this.gameEndBoxElem.classList.remove("invisible");
  }

  hide() {
    this.gameEndBoxElem.classList.add("invisible");
  }
}
