import { Cell } from "./cell";

export class Board {
  rows: number;
  cols: number;
  numMines: number;
  cells: Cell[][];

  elem: HTMLElement;

  constructor(rows: number, cols: number, numMines: number) {
    const boardElem = document.getElementById("board");
    if (boardElem == null) {
      throw new Error("Board element not found.");
    }
    this.elem = boardElem;

    this.rows = rows;
    this.cols = cols;
    this.numMines = numMines;

    // Create cells
    this.cells = [];
    for (let row = 0; row < this.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < this.cols; col++) {
        const cell = new Cell(row, col);
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
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function setupBoard() {
  const board = new Board(9, 9, 10);
}

interface CreateElementOpts {
  type: keyof HTMLElementTagNameMap;
  content?: string;
  id?: string;
  classes?: string[];
  attributes?: Pick<Attr, "name" | "value">[];
}
export function createElement({
  type,
  content,
  attributes,
  classes,
  id,
}: CreateElementOpts): HTMLElement {
  const newElem = document.createElement(type);
  if (content != null) {
    const newContent = document.createTextNode(content);
    newElem.append(newContent);
  }

  if (attributes != null && attributes.length > 0) {
    attributes.forEach(attr => {
      newElem.setAttribute(attr.name, attr.value);
    });
  }

  if (id != null) {
    newElem.id = id;
  }

  if (classes != null && classes.length > 0) {
    newElem.classList.add(...classes);
  }

  return newElem;
}

setupBoard();
