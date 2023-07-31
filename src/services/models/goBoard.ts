import { Intersection } from "./intersection";
import { StoneGroup } from "./stoneGroup";
//import { Submission } from "./submission";
//import { SubmissionResult } from "./submissionResult";

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

groupAnIntersection(intersection:Intersection, stoneColor:string, stoneGroup :StoneGroup|null):void{
  let currentGroup:StoneGroup|null = null;
  //let currentGroupNumber:number|null=null;
  //if(intersection.strinColor==='_') return;
  if(intersection.group)return;
  if(intersection.strinColor!==stoneColor) return;
  if(stoneGroup){
    currentGroup=stoneGroup;
    intersection.group=stoneGroup;
    currentGroup.intersections.push(intersection);
  //  currentGroupNumber=stoneGroup.groupNumber;
  }else{
      
  //const  stoneGroupNumber=this.stoneGroups.length;
  currentGroup=new StoneGroup(stoneColor);
  currentGroup.intersections.push(intersection);
  this.stoneGroups.push(currentGroup);
  //currentGroupNumber=stoneGroupNumber;
  }
  intersection.group=currentGroup;
  intersection.adjacentIntersections.forEach((i)=>{
    
    const targetIntersection=this.board[i.row][i.col];
    if(targetIntersection.strinColor==='_') {
      currentGroup!.liberties++;
      currentGroup?.libertiesSet.add(targetIntersection.row.toString().padStart(2, '0')+ targetIntersection.col.toString().padStart(2, '0'));
    }
    this.groupAnIntersection(targetIntersection,stoneColor,currentGroup);
  })
}



applyGroupAnIntersectionToBoard(
  // array: targetObject[][],
  // updateFunction: (color: string) => number
): void {
  for (const row of this.board) {
    for (const intersection of row) {
      if((intersection.strinColor!=='_') && !intersection.group){
     //   if(['w','b'].includes(intersection.strinColor) && !intersection.group){
          this.groupAnIntersection(intersection,intersection.strinColor,null);
      }
      // if(intersection.strinColor==="w"&& !intersection.group){
  
      // this.groupAnIntersection(intersection,'w',null);
      // }
    }
  }
}



// evaluateSubmission(sumission:Submission):SubmissionResult{
// let result=new SubmissionResult();

// let board=sumission.currentBoard


// }




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