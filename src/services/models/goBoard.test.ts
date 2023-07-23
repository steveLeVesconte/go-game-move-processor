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
