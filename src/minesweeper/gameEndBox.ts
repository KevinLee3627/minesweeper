export class GameEndBox {
  gameEndBoxElem: HTMLElement;
  titleElem: HTMLElement;

  title = "";

  constructor() {
    const gameEndBoxElem = document.getElementById("gameEndBox");
    if (gameEndBoxElem == null) throw new Error(`Could not find gameEndBox`);
    this.gameEndBoxElem = gameEndBoxElem;

    const titleElem = document.getElementById("gameEndBoxTitle");
    if (titleElem == null) throw new Error(`Could not find gameEndBoxTitle`);
    this.titleElem = titleElem;
  }

  setWin() {
    this.title = "You win!";
  }

  show() {
    this.gameEndBoxElem.classList.remove("invisible");
  }

  hide() {
    this.gameEndBoxElem.classList.add("invisible");
  }
}
