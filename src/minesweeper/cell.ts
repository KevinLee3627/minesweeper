import { createElement } from "./dom";

interface CellConstructor {
  row: number;
  col: number;
  isMine?: boolean;
}

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

  constructor({ row, col, isMine = false }: CellConstructor) {
    this.row = row;
    this.col = col;
    this.isMine = isMine;

    this.elem = createElement({
      type: "div",
      classes: ["cell"],
      attributes: [
        { name: "row", value: row.toString(10) },
        { name: "col", value: col.toString(10) },
      ],
    });
  }

  placeMine() {
    this.isMine = true;
    this.elem.classList.add("mine");
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
}
