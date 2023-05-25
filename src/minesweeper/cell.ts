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
        cell.reveal();
      });
    } else {
      // If the square you click on originally is a number,
      // this
      this.isRevealed = true;
      this.elem.classList.add("revealed");
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
      return;
    }

    if (!this.isRevealed) {
      this.reveal();
      return;
    }

    // If clicking on a revealed cell, check if # of flags around it
    // is equal to number of mines arouund it. If true, reveal the remaining squares.
    // If false, do nothing.

    const numFlagsAround = this.neighbors.reduce((acc, cell) => {
      if (cell.isFlagged) acc++;
      return acc;
    }, 0);

    if (numFlagsAround === this.minesAround) {
      // Reveal remaining squares
      this.neighbors.forEach(cell => {
        if (cell.isFlagged || cell.isRevealed || cell.isMine) return;

        cell.reveal();
      });
    }
  }

  rightclick() {
    this.flag();
  }
}
