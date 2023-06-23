import {Component} from '@angular/core';

function arraysEqual(a: number[], b: number[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

class Square {
  values: number[][] = [[], [], []];

  constructor(init: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]) {
    this.values = init
  }

  public getSumAllValues(): number {
    let sum = 0;
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i].length; j++) {
        sum += this.values[i][j];
      }
    }
    return sum;
  }

  public getSumRow(row: number): number {
    let sum = 0;
    for (let i = 0; i < this.values[row].length; i++) {
      sum += this.values[row][i];
    }
    return sum;
  }

  public getSumColumn(column: number): number {
    let sum = 0;
    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i][column];
    }
    return sum;
  }

  public isValid(): boolean {
    let validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let insertedValues = []
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i].length; j++) {
        insertedValues.push(this.values[i][j])
      }
    }
    insertedValues.sort()
    // todo check
    return arraysEqual(validValues, insertedValues)
  }

  public getRowValues(row: number): number[] {
    let temp = []
    for (let i = 0; i < this.values[row].length; i++) {
      temp.push(this.values[row][i])
    }
    return temp;
  }

  public getColumnsValues(column: number): number[] {
    let temp = []
    for (let i = 0; i < this.values.length; i++) {
      temp.push(this.values[i][column])
    }
    return temp
  }

}

class Sudoku {
  values: Square[][] = [[], [], []];

  constructor(init: Square[][]) {
    this.values = init
  }

  public getSumAllValues(): number {
    let sum = 0;
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i].length; j++) {
        sum += this.values[i][j].getSumAllValues();
      }
    }
    return sum;
  }

  public getSumRow(row: number): number {
    let realRow = Math.floor(row / 3)
    let relativeRow = row % 3
    let sum = 0;
    for (let i = 0; i < this.values[realRow].length; i++) {
      sum += this.values[realRow][i].getSumRow(relativeRow);
    }
    return sum;
  }

  public getSumColumn(column: number): number {
    let realColumn = Math.floor(column / 3)
    let relativeColumn = column % 3
    let sum = 0;
    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i][realColumn].getSumColumn(relativeColumn);
    }
    return sum;
  }

  public getRowValues(row: number) {
    let realRow = Math.floor(row / 3)
    let relativeRow = row % 3
    let temp: number[] = []
    for (let i = 0; i < this.values[realRow].length; i++) {
      temp = temp.concat(this.values[realRow][i].getRowValues(relativeRow));
    }
    return temp
  }

  public getColumnValues(column: number) {
    let realColumn = Math.floor(column / 3)
    let relativeColumn = column % 3
    let temp: number[] = []
    for (let i = 0; i < this.values.length; i++) {
      temp = temp.concat(this.values[i][realColumn].getColumnsValues(relativeColumn));
    }
    return temp
  }


  public isValid(): boolean {
    let isValid = true
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values.length; j++) {
        isValid = isValid && this.values[i][j].isValid()

        if (!isValid) break
      }
    }

    // Row check
    for (let i = 0; i < 9; i++) {
      let rowValues = this.getRowValues(i)
      rowValues.sort()
      let validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      isValid && arraysEqual(validValues, rowValues)
      if (!isValid) break
    }

    // Column check
    for (let i = 0; i < 9; i++) {
      let rowValues = this.getColumnValues(i)
      rowValues.sort()
      let validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      isValid && arraysEqual(validValues, rowValues)
      if (!isValid) break
    }

    return isValid
  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public squares: Square[][]

  public isValid: boolean = false

  public sudoku: Sudoku

  constructor() {
    this.squares = [
      [new Square([[9, 2, 6], [7, 3, 1], [4, 8, 5]]), new Square([[3, 7, 1], [2, 9, 5], [8, 4, 6]]), new Square([[5, 4, 8], [6, 7, 9], [3, 1, 2]])],
      [new Square([[2, 8, 5], [6, 1, 3], [7, 9, 4]]), new Square([[1, 2, 4], [5, 3, 7], [6, 8, 9]]), new Square([[9, 8, 7], [4, 6, 2], [5, 3, 1]])],
      [new Square([[7, 5, 3], [8, 4, 6], [2, 9, 1]]), new Square([[7, 6, 8], [9, 1, 3], [4, 2, 5]]), new Square([[4, 9, 2], [7, 5, 6], [1, 3, 8]])]
    ]
    this.sudoku = new Sudoku(this.squares)
  }

  validate(): boolean {
    console.log("Sum of all values: " + this.sudoku.getSumAllValues())
    console.log("Column 0 sum: " + this.sudoku.getSumColumn(0))
    console.log("Row 0 sum: " + this.sudoku.getSumRow(0))
    this.isValid = this.sudoku.isValid()
    console.log("Sudoku validity: "  + this.isValid)
    return this.sudoku.isValid()
  }
}
