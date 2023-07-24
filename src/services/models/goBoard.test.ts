import { test, expect } from 'vitest';
// import {evaluatePlay} from '../playProcessor';
// import { Submission } from '../models/submission';
// import { StonePlay } from '../models/stonePlay';
import { emptyBoard } from '../../utilities/boardUtilities';
import { GoBoard } from './goBoard';
test('new goBoard to be constructed correctly', () => {
  const testBoard = emptyBoard();
  const goBoard = new GoBoard( testBoard);
  // const stonePlay = new StonePlay(3,4,'b');
  // const sumission=new Submission(stonePlay, emptyBoard(), emptyBoard());
  // const result=evaluatePlay(sumission);
  expect(goBoard.board.length).toBe(19);
  expect(goBoard.board[18].length).toBe(19);
  expect(goBoard.board[18][18].strinColor).toBe('_');
  expect(goBoard.board[15][15].col).toBe(15);
  expect(goBoard.board[15][15].row).toBe(15);
  expect (countIn2DArray(goBoard, '_' )).toBe(361);
});

test('new goBoard to be contain 2 stones', () => {
  const testBoard = emptyBoard();

  testBoard[3][4]='b';
  testBoard[15][5]='w';

  const goBoard = new GoBoard( testBoard);

  // const stonePlay = new StonePlay(3,4,'b');
  // const sumission=new Submission(stonePlay, emptyBoard(), emptyBoard());
  // const result=evaluatePlay(sumission);
  expect(goBoard.board.length).toBe(19);
  expect(goBoard.board[18].length).toBe(19);
  expect(goBoard.board[18][18].strinColor).toBe('_');
  expect(goBoard.board[3][4].strinColor).toBe('b');
  expect(goBoard.board[15][5].strinColor).toBe('w');
  expect(goBoard.board[15][15].col).toBe(15);
  expect(goBoard.board[15][15].row).toBe(15);
  expect (countIn2DArray(goBoard, '_' )).toBe(359);
});



test('if two adjacent siblings, then group with two intersections', () => {
  const testBoard = emptyBoard();

  testBoard[3][4]='b';
  testBoard[3][5]='b';

  const goBoard = new GoBoard( testBoard);
  goBoard.groupAnIntersection(goBoard.board[3][4],'b',null);

  // const stonePlay = new StonePlay(3,4,'b');
  // const sumission=new Submission(stonePlay, emptyBoard(), emptyBoard());
  // const result=evaluatePlay(sumission);
  expect(goBoard.stoneGroups.length).toBe(1);

  expect(goBoard.stoneGroups[0].intersections.length).toBe(2);
  expect(goBoard.stoneGroups[0].intersections[1].col).toBe(5);
  expect(goBoard.stoneGroups[0].liberties).toBe(6);
  
  // expect(goBoard.board.length).toBe(19);
  // expect(goBoard.board[18].length).toBe(19);
  // expect(goBoard.board[18][18].strinColor).toBe('_');
  // expect(goBoard.board[3][4].strinColor).toBe('b');
  // expect(goBoard.board[15][5].strinColor).toBe('w');
  // expect(goBoard.board[15][15].col).toBe(15);
  // expect(goBoard.board[15][15].row).toBe(15);
  // expect (countIn2DArray(goBoard, '_' )).toBe(359);
});


test('if black stones in u shape, then group with 7 intersections', () => {
  const testBoard = emptyBoard();

  testBoard[13][4]='b';
  testBoard[14][4]='b';
  testBoard[15][4]='b';
  testBoard[15][5]='b';
  testBoard[15][6]='b';
  testBoard[14][6]='b';
  testBoard[13][6]='b';


  const goBoard = new GoBoard( testBoard);
  goBoard.groupAnIntersection(goBoard.board[13][4],'b',null);

  expect(goBoard.stoneGroups.length).toBe(1);
    expect(goBoard.stoneGroups[0].intersections.length).toBe(7);
  expect(goBoard.stoneGroups[0].liberties).toBe(16);
  expect(goBoard.stoneGroups[0].libertiesSet.size).toBe(13);

});



test('if black stones in u shape, then not fooled by corner stones and white stones', () => {
  const testBoard = emptyBoard();

  testBoard[13][4]='b';
  testBoard[14][4]='b';
  testBoard[15][4]='b';
  testBoard[15][5]='b';
  testBoard[15][6]='b';
  testBoard[14][6]='b';
  testBoard[13][6]='b';
  testBoard[12][7]='b';// corner stone -- attempt to fool
  testBoard[14][5]='w';// adjacent white stone -- attempt to fool


  const goBoard = new GoBoard( testBoard);
  goBoard.groupAnIntersection(goBoard.board[13][4],'b',null);

  expect(goBoard.stoneGroups.length).toBe(1);
    expect(goBoard.stoneGroups[0].intersections.length).toBe(7);
  //expect(goBoard.stoneGroups[0].liberties).toBe(16);
  expect(goBoard.stoneGroups[0].libertiesSet.size).toBe(12);

});


test('if black stones in o shape, then group with 8 intersections', () => {
  const testBoard = emptyBoard();

  testBoard[13][4]='b';
  testBoard[14][4]='b';
  testBoard[15][4]='b';
  testBoard[15][5]='b';
  testBoard[15][6]='b';
  testBoard[14][6]='b';
  testBoard[13][6]='b';
  testBoard[13][5]='b';


  const goBoard = new GoBoard( testBoard);
  goBoard.groupAnIntersection(goBoard.board[13][4],'b',null);

  // const stonePlay = new StonePlay(3,4,'b');
  // const sumission=new Submission(stonePlay, emptyBoard(), emptyBoard());
  // const result=evaluatePlay(sumission);
  expect(goBoard.stoneGroups.length).toBe(1);
  
  expect(goBoard.stoneGroups[0].intersections.length).toBe(8);
 // expect(goBoard.stoneGroups[0].intersections[1].col).toBe(5);
  
  // expect(goBoard.board.length).toBe(19);
  // expect(goBoard.board[18].length).toBe(19);
  // expect(goBoard.board[18][18].strinColor).toBe('_');
  // expect(goBoard.board[3][4].strinColor).toBe('b');
  // expect(goBoard.board[15][5].strinColor).toBe('w');
  // expect(goBoard.board[15][15].col).toBe(15);
  // expect(goBoard.board[15][15].row).toBe(15);
  // expect (countIn2DArray(goBoard, '_' )).toBe(359);
});



test('if white stones in test template board, then group with 2 intersections', () => {

  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
  /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //07
  /* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //08
  /* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18


  const templateBoard:string[][]=stringBoardToArray(boardString);

  const goBoard = new GoBoard( templateBoard);
  goBoard.groupAnIntersection(goBoard.board[0][0],'w',null);

  expect(goBoard.stoneGroups.length).toBe(1);
  
  expect(goBoard.stoneGroups[0].intersections.length).toBe(2);
 // expect(goBoard.stoneGroups[0].intersections[1].col).toBe(5);
  
});





test('if white stones in spirole shapge board, then group with 45 intersections', () => {

  const boardString =
  //        1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
  /* 00  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w w w w w w w w w w _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ w w w w w _ _ w _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"_ _ w _ _ _ w _ _ w _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"_ _ w _ w _ w _ _ w _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"_ _ w _ w _ w _ _ w _ _ _ _ _ _ _ _ _,"+  //06
  /* 07  */"_ _ w _ w w w _ _ w _ _ _ _ _ _ _ _ _,"+  //07
  /* 08  */"_ _ w _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _,"+  //08
  /* 09  */"_ _ w w w w w w w w _ _ _ _ _ _ _ _ _,"+  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18


  const templateBoard:string[][]=stringBoardToArray(boardString);

  const goBoard = new GoBoard( templateBoard);
  goBoard.groupAnIntersection(goBoard.board[0][0],'w',null);

  expect(goBoard.stoneGroups.length).toBe(1);
  
  expect(goBoard.stoneGroups[0].intersections.length).toBe(44);
 // expect(goBoard.stoneGroups[0].intersections[1].col).toBe(5);
  
});




test('if two groups in spirole shapge board, then group with 45 intersections', () => {

  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w w w w w w w w w w _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ w _ _ b b b b b b _,"+  //02
  /* 03  */"_ _ w w w w w _ _ w _ _ b _ _ _ _ _ _,"+  //03
  /* 04  */"_ _ w _ _ _ w _ _ w _ _ b _ _ _ _ _ _,"+  //04
  /* 05  */"_ _ w _ w _ w _ _ w _ _ b _ _ _ _ _ _,"+  //05
  /* 06  */"_ _ w _ w _ w _ _ w _ _ b _ _ _ _ _ _,"+  //06
  /* 07  */"_ _ w _ w w w _ _ w _ _ b _ _ _ _ _ _,"+  //07
  /* 08  */"_ _ w _ _ _ _ _ _ w _ _ b _ _ _ _ _ _,"+  //08
  /* 09  */"_ _ w w w w w w w w _ _ b _ _ _ _ _ _,"+  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ b _ _ _ _ _ _,"+  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ b b b b _ _ _ _ _ _,"+  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ b _ _ _ _ _ _ _ _ _,"+  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ b _ _ b b b b _ _ _,"+  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ b _ _ _ _ _ b _ _ _,"+  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ b _ _ _ _ _ b _ _ _,"+  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ b b b b b b b _ _ _,"+  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18


  const templateBoard:string[][]=stringBoardToArray(boardString);

  const goBoard = new GoBoard( templateBoard);
  goBoard.groupAnIntersection(goBoard.board[0][0],'w',null);

  expect(goBoard.stoneGroups.length).toBe(1);
  
  expect(goBoard.stoneGroups[0].intersections.length).toBe(44);

  goBoard.groupAnIntersection(goBoard.board[2][17],'b',null);

  expect(goBoard.stoneGroups.length).toBe(2);
  
  expect(goBoard.stoneGroups[1].intersections.length).toBe(35);
 
});





test('if two groups with blobs and wholes board, then group with correct intersections', () => {

  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ w w w w w _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ _ w w w w w _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"_ _ w w w w w _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"_ _ _ w w w w w _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
  /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //07
  /* 08  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _,"+  //08
  /* 09  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _,"+  //09
  /* 10  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
  /* 11  */"_ _ b _ b _ b _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
  /* 12  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
  /* 13  */"_ _ b b _ b b _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
  /* 14  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18


  const templateBoard:string[][]=stringBoardToArray(boardString);

  const goBoard = new GoBoard( templateBoard);
  goBoard.groupAnIntersection(goBoard.board[2][2],'w',null);

  expect(goBoard.stoneGroups.length).toBe(1);
  
  expect(goBoard.stoneGroups[0].intersections.length).toBe(20);

  goBoard.groupAnIntersection(goBoard.board[14][6],'b',null);

  expect(goBoard.stoneGroups.length).toBe(2);
  
  expect(goBoard.stoneGroups[1].intersections.length).toBe(32);
 
});



function countIn2DArray(goBoard : GoBoard, target: string ):number{
  let result: number=0;
  for (let i = 0; i < 19; i++) {
     // const goBoardRow:Intersection[]=[];
      for (let j = 0; j < 19; j++) {
        if(goBoard.board[i][j].strinColor==target){
          result++;
        }
        //goBoardRow[j]=new Intersection(i,j,stringBoard[i][j])
      }
      //result.push(goBoardRow);
    }
    return result;
}







function stringBoardToArray(boardString: string): string[][] {

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