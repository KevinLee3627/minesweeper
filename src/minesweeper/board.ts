import { Cell } from "./cell";
import { getRandomInt } from "./util";

export interface BoardSettings {
  rows: number;
  cols: number;
  numMines: number;
}

export class Board {
  id: string = new Date().toISOString();
  rows: number;
  cols: number;
  numMines: number;
  cells: Cell[][];

  numRevealed = 0;

  elem: HTMLElement;

  // https://stackoverflow.com/questions/9720927/removing-event-listeners-as-class-prototype-functions
  clickHandler = this.handleClick.bind(this);
  rightClickHandler = this.handleRightClick.bind(this);
  revealHandler = this.handleReveal.bind(this);

  constructor({ rows, cols, numMines }: BoardSettings) {
    const boardElem = document.getElementById("board");
    if (boardElem == null) {
      throw new Error("Board element not found.");
    }
    this.elem = boardElem;

    this.elem.addEventListener("click", this.clickHandler);
    this.elem.addEventListener("contextmenu", this.rightClickHandler);
    this.elem.addEventListener("reveal", this.revealHandler);

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
    } else {
      this.clickRevealedCell(row, col);
    }

    this.checkWin();
  }

  // If clicking on a revealed cell, check if # of flags around it
  // is equal to number of mines arouund it. If true, reveal the remaining squares.
  // If false, do nothing.
  clickRevealedCell(row: number, col: number) {
    const cell = this.cells[row][col];

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

  checkWin() {
    // Check if all cells are revealed
    console.log(`num revealed: ${this.numRevealed}`);
    if (this.numRevealed !== this.rows * this.cols - this.numMines) {
      return;
    }

    console.log("YOU WIN!");

    // Check if flagged mines is correct
    // Check if locations of flagged mines are correct
    // const flaggedMineCells = this.cells
    //   .flat()
    //   .filter(cell => cell.isMine && cell.isFlagged);
    // console.log(flaggedMineCells);
    // if (flaggedMineCells.length !== this.numMines) {
    //   console.log("NOT RIGHT");
    //   return;
    // }
    // console.log("YOU WIN");
  }

  gameOver() {
    console.log("game ove!");
  }

  handleClick(e: MouseEvent) {
    const cell = this.getCellFromClick(e);
    if (cell == null) return;

    this.cellClick(Number(cell.row), Number(cell.col));
  }

  handleRightClick(e: MouseEvent) {
    e.preventDefault();
    const cell = this.getCellFromClick(e);
    if (cell == null) return;

    cell.flag();

    this.checkWin();
  }

  handleReveal() {
    this.numRevealed++;
  }

  cleanup() {
    this.elem.removeEventListener("click", this.clickHandler);
    this.elem.removeEventListener("contextmenu", this.rightClickHandler);
    this.elem.removeEventListener("reveal", this.revealHandler);
  }
}
