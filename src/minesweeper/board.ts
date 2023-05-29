import { Cell } from "./cell";
import { GameStatus } from "./game";
import { Timer } from "./timer";
import { getRandomInt } from "./util";

export interface BoardSettings {
  rows: number;
  cols: number;
  numMines: number;
}

export interface BoardConstructor extends BoardSettings {
  timer: Timer;
}

export class Board {
  id: string = new Date().toISOString();
  rows: number;
  cols: number;
  numMines: number;
  cells: Cell[][];
  boardStarted = false;
  numRevealed = 0;

  headerElem: HTMLElement;
  elem: HTMLElement;
  timer: Timer;

  // https://stackoverflow.com/questions/9720927/removing-event-listeners-as-class-prototype-functions
  clickHandler = this.handleClick.bind(this);
  rightClickHandler = this.handleRightClick.bind(this);
  revealHandler = this.handleReveal.bind(this);

  constructor({ rows, cols, numMines, timer }: BoardConstructor) {
    const boardElem = document.getElementById("board");
    if (boardElem == null) {
      throw new Error("Board element not found.");
    }
    this.elem = boardElem;

    const headerElem = document.getElementById("boardHeader");
    if (headerElem == null) {
      throw new Error("Board header element not found.");
    }
    this.headerElem = headerElem;

    this.elem.addEventListener("click", this.clickHandler);
    this.elem.addEventListener("contextmenu", this.rightClickHandler);
    this.elem.addEventListener("reveal", this.revealHandler);

    this.timer = timer;

    // Adjust the grid based on the board size.
    this.elem.style.gridTemplateColumns = `repeat(${cols}, 24px)`;
    this.elem.style.gridTemplateRows = `repeat(${rows}, 24px)`;
    this.elem.style.height = `${rows * 24}px`;
    this.elem.style.width = `${cols * 24}px`;
    this.headerElem.style.width = `${cols * 24}px`;

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
    console.log(this.id);
    if (!this.boardStarted) {
      this.boardStarted = true;
      this.timer.start();
    }
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

  clickRevealedCell(row: number, col: number) {
    // AKA Chording
    const cell = this.cells[row][col];

    const flaggedNeighbors = cell.neighbors.filter(cell => cell.isFlagged);
    if (flaggedNeighbors.length !== cell.minesAround) return;

    // Check if the flagged squares match the actual mines.
    // If not, game over.
    const flaggedMineNeighbors = cell.neighbors.filter(
      cell => cell.isMine && cell.isFlagged
    );

    if (flaggedMineNeighbors.length !== cell.minesAround) {
      this.gameOver();
      return;
    }
    // If the correct mines are flagged, Reveal remaining squares
    cell.neighbors.forEach(cell => {
      if (cell.isFlagged || cell.isRevealed || cell.isMine) return;
      cell.reveal();
    });
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
    if (this.numRevealed !== this.rows * this.cols - this.numMines) {
      return;
    }

    this.timer.stop();

    const gameEndEvent = new CustomEvent("gameEnd", {
      bubbles: true,
      detail: { status: GameStatus.WIN },
    });
    this.elem.dispatchEvent(gameEndEvent);
  }

  gameOver() {
    this.timer.stop();

    const gameEndEvent = new CustomEvent("gameEnd", {
      bubbles: true,
      detail: { status: GameStatus.LOSE },
    });
    this.elem.dispatchEvent(gameEndEvent);
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

    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(element => {
      element.remove();
    });
  }
}
