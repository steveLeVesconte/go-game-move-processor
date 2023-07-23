import { Intersection } from "./intersection";
import { StoneGroup } from "./stoneGroup";

export class GoBoard{
    constructor(stringBoard : string[][]){
       this.board = this.populateGoBoard(stringBoard);
    }
    public board:Intersection[][];
    public stoneGroups: StoneGroup[]=[];



populateGoBoard(stringBoard : string[][]):Intersection[][]{
    const result: Intersection [][]=[];
    for (let i = 0; i < 19; i++) {
        const goBoardRow:Intersection[]=[];
        for (let j = 0; j < 19; j++) {
          goBoardRow[j]=new Intersection(i,j,stringBoard[i][j])
        }
        result.push(goBoardRow);
      }
      return result;
}
}

// function applyFunctionTo2DArray(
//   array: Intersection[][],
//   fn: (value: Intersection) => {
    
//   }
// ): void {
//   return array.map((row) => row.map((cell) => fn(cell)));
// }

// function Fill2DArray(
//   array: string[][],
//   fn: (value: string) => string
// ): string[][] {
//   return array.map((row) => row.map((cell) => fn(cell)));
// }