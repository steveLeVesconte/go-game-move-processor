import { EMPTY_INTERSECTION } from "../services/models/constants";

export function emptyBoard():string[][]{
    const result = new Array(19).fill(EMPTY_INTERSECTION).map(()=>new Array(19).fill(EMPTY_INTERSECTION));
    return result;
}

export function stringBoardToArray(boardString: string): string[][] {

    const rows: string[] = boardString.split(' ').join('').split(',');
    const board: string[][] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cols = Array.from(row);
      const outputCol: string[] = [];
      for (let j = 0; j < row.length; j++) {
        outputCol.push(cols[j]);
      }
      board.push(outputCol);
    }
    return board;
  }