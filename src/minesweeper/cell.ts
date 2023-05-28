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
        { name: "data-row", value: row.toString(10) },
        { name: "data-col", value: col.toString(10) },
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

    if (this.isRevealed) return;
    if (this.isFlagged) return;

    this.isRevealed = true;
    this.elem.classList.add("revealed");
    const revealEvent = new CustomEvent("reveal", { bubbles: true });
    this.elem.dispatchEvent(revealEvent);

    if (this.minesAround === 0) {
      this.neighbors.forEach(cell => {
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
}
