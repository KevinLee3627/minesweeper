import { Cell } from "./cell";
import { getRandomInt } from "./util";

export interface BoardSettings {
  rows: number;
  cols: number;
  numMines: number;
}

export class Board {
  rows: number;
  cols: number;
  numMines: number;
  cells: Cell[][];

  elem: HTMLElement;

  constructor({ rows, cols, numMines }: BoardSettings) {
    const boardElem = document.getElementById("board");
    if (boardElem == null) {
      throw new Error("Board element not found.");
    }
    this.elem = boardElem;

    this.elem.addEventListener("click", e => {
      const cell = this.getCellFromClick(e);
      if (cell == null) return;

      this.cellClick(Number(cell.row), Number(cell.col));
    });

    this.elem.addEventListener("contextmenu", e => {
      e.preventDefault();
      const cell = this.getCellFromClick(e);
      if (cell == null) return;

      cell.flag();
    });

    // Adjust the grid based on the board size.
    this.elem.style.gridTemplateColumns = `repeat(${cols}, 24px)`;
    this.elem.style.gridTemplateRows = `repeat(${rows}, 24px)`;

    this.rows = rows;
    this.cols = cols;
    this.numMines = numMines;

    // Create cells
    this.cells = [];
    for (let row = 0; row < this.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < this.cols; col++) {
        const cell = new Cell({ row, col });
        rowCells.push(cell);
        this.elem.append(cell.elem);
      }
      this.cells.push(rowCells);
    }

    // Place mines
    let minesAssigned = 0;
    while (minesAssigned < this.numMines) {
      const row = getRandomInt(0, this.rows - 1);
      const col = getRandomInt(0, this.cols - 1);
      const cell = this.cells[row][col];
      if (!cell.isMine) {
        cell.placeMine();
        minesAssigned++;
      }
    }

    // Compute square values
    for (let boardRow = 0; boardRow < this.rows; boardRow++) {
      const rowCells = this.cells[boardRow];
      for (let boardCol = 0; boardCol < this.cols; boardCol++) {
        const cell = rowCells[boardCol];
        if (cell.isMine) continue;

        // Get all cells around this cell. Count how many are mines
        cell.neighbors = this.getAdjacent(cell);
        const mineCount = cell.neighbors.reduce((acc: number, cell: Cell) => {
          if (cell.isMine) acc++;
          return acc;
        }, 0);
        cell.setMinesAround(mineCount);
      }
    }
  }

  cellClick(row: number, col: number): void {
    const cell = this.cells[row][col];
    if (cell.isMine) {
      this.gameOver();
      return;
    }

    if (!cell.isRevealed) {
      cell.reveal();
      return;
    }

    // If clicking on a revealed cell, check if # of flags around it
    // is equal to number of mines arouund it. If true, reveal the remaining squares.
    // If false, do nothing.

    const numFlagsAround = cell.neighbors.reduce((acc, cell) => {
      if (cell.isFlagged) acc++;
      return acc;
    }, 0);

    if (numFlagsAround === cell.minesAround) {
      // Check if the flagged squares match the actual mines.
      // If not, game over.
      const isCorrectFlags = cell.neighbors.reduce((_, cell) => {
        // TODO: Fix
        // cell = mine, cell = no flag     --> incorrect
        // cell = mine, cell = flag        --> correct
        // cell = not mine, cell = no flag --> correct
        // cell = not mine, cell = flag    --> incorrect
        return (
          (cell.isMine && cell.isFlagged) || (!cell.isMine && !cell.isFlagged)
        );
      }, true);
      console.log(isCorrectFlags);
      if (!isCorrectFlags) {
        this.gameOver();
        return;
      }
      // If true, Reveal remaining squares
      cell.neighbors.forEach(cell => {
        if (cell.isFlagged || cell.isRevealed || cell.isMine) return;

        cell.reveal();
      });
    }
  }

  getCellFromClick(e: MouseEvent): Cell | null {
    if (!(e.target instanceof HTMLElement)) return null;

    if (!e.target.classList.contains("cell")) return null;
    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);
    if (row == null || col == null) return null;

    return this.cells[row][col];
  }

  getAdjacent(cell: Cell): Cell[] {
    const topRow = cell.row > 0 ? cell.row - 1 : 0;
    const bottomRow = cell.row < this.rows - 1 ? cell.row + 1 : this.rows - 1;
    const leftCol = cell.col > 0 ? cell.col - 1 : 0;
    const rightCol = cell.col < this.cols - 1 ? cell.col + 1 : this.cols - 1;

    const adjacentCells: Cell[] = [];

    for (let boardRow = topRow; boardRow <= bottomRow; boardRow++) {
      for (let boardCol = leftCol; boardCol <= rightCol; boardCol++) {
        const adjacentCell = this.cells[boardRow][boardCol];
        if (boardRow === cell.row && boardCol === cell.col) {
          continue;
        }
        adjacentCells.push(adjacentCell);
      }
    }

    return adjacentCells;
  }

  gameOver() {
    alert("game ove!");
  }
}
