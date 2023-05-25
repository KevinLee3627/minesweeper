import { createElement } from "./dom";

export class Cell {
  row: number;
  col: number;
  isMine: boolean;
  isFlagged = false;
  isRevealed = false;
  minesAround = 0;

  // TODO: Each cell should be aware of its neighbors?
  neighbors: Cell[] = [];

  elem: HTMLElement;

  constructor(row: number, col: number, isMine = false) {
    this.row = row;
    this.col = col;
    this.isMine = isMine;

    this.elem = createElement({
      type: "div",
      classes: ["cell"],
    });

    this.elem.addEventListener("click", () => this.click());
    this.elem.addEventListener("contextmenu", e => {
      e.preventDefault();
      this.rightclick();
    });
  }

  toggleFlag() {
    this.isFlagged = !this.isFlagged;
  }

  placeMine() {
    this.isMine = true;
    this.elem.classList.add("mine");
    console.log(`assigned mine @ ${this.row}, ${this.col}`);
  }

  reveal() {
    // Also reveal all adjacent cells where minesAround = 0;
    // Could probably be more efficient. Double-checks too many squares
    this.elem.textContent =
      this.minesAround === 0 ? "" : this.minesAround.toString();
    if (this.minesAround === 0 && !this.isRevealed) {
      this.isRevealed = true;
      this.elem.classList.add("revealed");
      this.neighbors.forEach(cell => {
        // if (cell.minesAround === 0 && !cell.isRevealed) cell.reveal();
        cell.reveal();
      });
    }
  }

  flag() {
    if (this.isRevealed) return;

    this.isFlagged = !this.isFlagged;
    if (this.isFlagged) this.elem.classList.add("flagged");
    else this.elem.classList.remove("flagged");
  }

  setMinesAround(num: number) {
    this.minesAround = num;
  }

  click() {
    if (this.isMine) {
      console.log("you lose");
    } else {
      if (!this.isRevealed) this.reveal();
    }
  }

  rightclick() {
    this.flag();
  }
}
