import { test, expect } from 'vitest';
import { countStringValueIn2DArray, emptyBoard, stringBoardToArray } from '../../utilities/boardUtilities';
import { GoBoard } from './goBoard';
import { BLACK_STONE, EMPTY_INTERSECTION, WHITE_STONE } from './constants';

test('new goBoard to be constructed correctly', () => {
  //arrange
  const testBoard = emptyBoard();
  //act
  const goBoard = new GoBoard(testBoard);
  //assert
  expect(goBoard.board.length).toBe(19);
  expect(goBoard.board[18].length).toBe(19);
  expect(goBoard.board[18][18].strinColor).toBe(EMPTY_INTERSECTION);
  expect(goBoard.board[15][15].col).toBe(15);
  expect(goBoard.board[15][15].row).toBe(15);
  expect(countStringValueIn2DArray(goBoard, EMPTY_INTERSECTION)).toBe(361);
});

test('new goBoard to be contain 2 stones', () => {
  //arrange
  const testBoard = emptyBoard();
  testBoard[3][4] = BLACK_STONE;
  testBoard[15][5] = WHITE_STONE;
  //act
  const goBoard = new GoBoard(testBoard);
  //assert
  expect(goBoard.board.length).toBe(19);
  expect(goBoard.board[18].length).toBe(19);
  expect(goBoard.board[18][18].strinColor).toBe(EMPTY_INTERSECTION);
  expect(goBoard.board[3][4].strinColor).toBe(BLACK_STONE);
  expect(goBoard.board[15][5].strinColor).toBe(WHITE_STONE);
  expect(goBoard.board[15][15].col).toBe(15);
  expect(goBoard.board[15][15].row).toBe(15);
  expect(countStringValueIn2DArray(goBoard, EMPTY_INTERSECTION)).toBe(359);
});

test('if two adjacent siblings, then group with two intersections', () => {
  //arange
  const testBoard = emptyBoard();

  testBoard[3][4] = BLACK_STONE;
  testBoard[3][5] = BLACK_STONE;

  const goBoard = new GoBoard(testBoard);
  //act
  goBoard.groupAnIntersection(goBoard.board[3][4], BLACK_STONE, null);

  //assert
  expect(goBoard.stoneGroups.length).toBe(1);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(2);
  expect(goBoard.stoneGroups[0].intersections[1].col).toBe(5);
  expect(goBoard.stoneGroups[0].liberties).toBe(6);
});

test('if black stones in u shape, then group with 7 intersections', () => {
  //arrange
  const testBoard = emptyBoard();
  testBoard[13][4] = BLACK_STONE;
  testBoard[14][4] = BLACK_STONE;
  testBoard[15][4] = BLACK_STONE;
  testBoard[15][5] = BLACK_STONE;
  testBoard[15][6] = BLACK_STONE;
  testBoard[14][6] = BLACK_STONE;
  testBoard[13][6] = BLACK_STONE;

  //act
  const goBoard = new GoBoard(testBoard);
  goBoard.groupAnIntersection(goBoard.board[13][4], BLACK_STONE, null);
  //assert
  expect(goBoard.stoneGroups.length).toBe(1);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(7);
  expect(goBoard.stoneGroups[0].liberties).toBe(16);
  expect(goBoard.stoneGroups[0].libertiesSet.size).toBe(13);
});

test('if black stones in u shape, then not fooled by corner stones and white stones', () => {
  //arrange
  const testBoard = emptyBoard();
  testBoard[13][4] = BLACK_STONE;
  testBoard[14][4] = BLACK_STONE;
  testBoard[15][4] = BLACK_STONE;
  testBoard[15][5] = BLACK_STONE;
  testBoard[15][6] = BLACK_STONE;
  testBoard[14][6] = BLACK_STONE;
  testBoard[13][6] = BLACK_STONE;
  testBoard[12][7] = BLACK_STONE;// corner stone -- attempt to fool
  testBoard[14][5] = WHITE_STONE;// adjacent white stone -- attempt to fool

  //act
  const goBoard = new GoBoard(testBoard);
  goBoard.groupAnIntersection(goBoard.board[13][4], BLACK_STONE, null);

  //assert
  expect(goBoard.stoneGroups.length).toBe(3);
  expect(goBoard.stoneGroups[1].intersections.length).toBe(7);
  expect(goBoard.stoneGroups[1].libertiesSet.size).toBe(12);
});

test('if black stones in o shape, then group with 8 intersections', () => {
  //arrange
  const testBoard = emptyBoard();
  testBoard[13][4] = BLACK_STONE;
  testBoard[14][4] = BLACK_STONE;
  testBoard[15][4] = BLACK_STONE;
  testBoard[15][5] = BLACK_STONE;
  testBoard[15][6] = BLACK_STONE;
  testBoard[14][6] = BLACK_STONE;
  testBoard[13][6] = BLACK_STONE;
  testBoard[13][5] = BLACK_STONE;
  //act
  const goBoard = new GoBoard(testBoard);
  goBoard.groupAnIntersection(goBoard.board[13][4], BLACK_STONE, null);
  //assert
  expect(goBoard.stoneGroups.length).toBe(1);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(8);
});

test('if white stones in test template board, then group with 2 intersections', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
  /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
  /* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //08
  /* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  goBoard.groupAnIntersection(goBoard.board[0][0], WHITE_STONE, null);
  //assert
  expect(goBoard.stoneGroups.length).toBe(1);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(2);
});

test('if white stones in spirole shapge board, then group with 45 intersections', () => {
  //arrange
  const boardString =
  //        1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
  /* 00  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w w w w w w w w w w _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ w w w w w _ _ w _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ _ w _ _ _ w _ _ w _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"_ _ w _ w _ w _ _ w _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"_ _ w _ w _ w _ _ w _ _ _ _ _ _ _ _ _," +  //06
  /* 07  */"_ _ w _ w w w _ _ w _ _ _ _ _ _ _ _ _," +  //07
  /* 08  */"_ _ w _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _," +  //08
  /* 09  */"_ _ w w w w w w w w _ _ _ _ _ _ _ _ _," +  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18
  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  goBoard.groupAnIntersection(goBoard.board[0][0], WHITE_STONE, null);
  //assert
  expect(goBoard.stoneGroups.length).toBe(1);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(44);
});

test('if two groups in spirole shapge board, then group with 45 intersections', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w w w w w w w w w w _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ w _ _ b b b b b b _," +  //02
  /* 03  */"_ _ w w w w w _ _ w _ _ b _ _ _ _ _ _," +  //03
  /* 04  */"_ _ w _ _ _ w _ _ w _ _ b _ _ _ _ _ _," +  //04
  /* 05  */"_ _ w _ w _ w _ _ w _ _ b _ _ _ _ _ _," +  //05
  /* 06  */"_ _ w _ w _ w _ _ w _ _ b _ _ _ _ _ _," +  //06
  /* 07  */"_ _ w _ w w w _ _ w _ _ b _ _ _ _ _ _," +  //07
  /* 08  */"_ _ w _ _ _ _ _ _ w _ _ b _ _ _ _ _ _," +  //08
  /* 09  */"_ _ w w w w w w w w _ _ b _ _ _ _ _ _," +  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ b _ _ _ _ _ _," +  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ b b b b _ _ _ _ _ _," +  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ b _ _ _ _ _ _ _ _ _," +  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ b _ _ b b b b _ _ _," +  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ b _ _ _ _ _ b _ _ _," +  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ b _ _ _ _ _ b _ _ _," +  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ b b b b b b b _ _ _," +  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18
  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  //assert
  expect(goBoard.stoneGroups.length).toBe(2);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(44);
  expect(goBoard.stoneGroups.length).toBe(2);
  expect(goBoard.stoneGroups[1].intersections.length).toBe(35);
});

test('if two groups with blobs and wholes board, then group with correct intersections', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ w w w w w _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ w w w w w _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ _ w w w w w _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"_ _ _ w w w w w _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
  /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
  /* 08  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //08
  /* 09  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //09
  /* 10  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //10
  /* 11  */"_ _ b _ b _ b _ _ _ _ _ _ _ _ _ _ _ _," +  //11
  /* 12  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //12
  /* 13  */"_ _ b b _ b b _ _ _ _ _ _ _ _ _ _ _ _," +  //13
  /* 14  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  //assert
  expect(goBoard.stoneGroups.length).toBe(2);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(20);

  //act  ************************************************************
  goBoard.groupAnIntersection(goBoard.board[14][6], BLACK_STONE, null);
  //assert
  expect(goBoard.stoneGroups[1].intersections.length).toBe(32);
});

test('if two groups with blobs and wholes board, then group with correct intersections', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ w w w w w _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ w w w w w _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ _ w w w w w _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"_ _ _ w w w w w _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
  /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
  /* 08  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //08
  /* 09  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //09
  /* 10  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //10
  /* 11  */"_ _ b _ b _ b _ _ _ _ _ _ _ _ _ _ _ _," +  //11
  /* 12  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //12
  /* 13  */"_ _ b b _ b b _ _ _ _ _ _ _ _ _ _ _ _," +  //13
  /* 14  */"_ _ b b b b b _ _ _ _ _ _ _ _ _ _ _ _," +  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  //assert
  expect(goBoard.stoneGroups.length).toBe(2);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(20);
  expect(goBoard.stoneGroups[0].stoneColor).toBe(WHITE_STONE);
  expect(goBoard.stoneGroups[1].intersections.length).toBe(32);
  expect(goBoard.stoneGroups[1].stoneColor).toBe(BLACK_STONE);
});

test('if many small groups, then group with correct intersections with liberties', () => {
  //arrange
  const boardString =
   //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"w _ w b w b w _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w w w _ _ w w _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ _ _ _ b _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ _ _ _ b b _ b _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"_ _ _ _ _ _ b _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
  /* 07  */"_ _ _ _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
  /* 08  */"_ _ _ b w b _ _ _ _ _ _ _ _ _ _ _ _ _," +  //08
  /* 09  */"_ _ _ _ b w _ _ _ _ _ _ _ _ _ _ _ _ _," +  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //10
  /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //11
  /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //12
  /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //13
  /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //14
  /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
  /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
  /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  //assert
  expect(goBoard.stoneGroups.length).toBe(15);

  //notes
  //evauate 1st group W
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"W _ W b w b w _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"W W W _ _ w w _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
    //assert
    expect(goBoard.stoneGroups[0].intersections.length).toBe(5);
  expect(goBoard.stoneGroups[0].stoneColor).toBe(WHITE_STONE);
  expect(goBoard.stoneGroups[0].libertiesSet.size).toBe(5);

  //evauate 2nd group b at 0,3
  expect(goBoard.stoneGroups[1].intersections.length).toBe(1);
  expect(goBoard.stoneGroups[1].stoneColor).toBe(BLACK_STONE);

  //evauate 3rd group - surounded b at 0,5
  expect(goBoard.stoneGroups[3].intersections.length).toBe(1);
  expect(goBoard.stoneGroups[3].stoneColor).toBe(BLACK_STONE);
  expect(goBoard.stoneGroups[3].libertiesSet.size).toBe(0);

   //NOTES: evauate 11th group - surounded w at 8,4
  /* 07  */"_ _ _ _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
  /* 08  */"_ _ _ b W b _ _ _ _ _ _ _ _ _ _ _ _ _," +  //08
  /* 09  */"_ _ _ _ b w _ _ _ _ _ _ _ _ _ _ _ _ _," +  //09
  /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //10
    expect(goBoard.stoneGroups[11].intersections.length).toBe(1);
  expect(goBoard.stoneGroups[11].stoneColor).toBe(WHITE_STONE);
  expect(goBoard.stoneGroups[11].libertiesSet.size).toBe(0);

  //evauate 13th group - surounded b at 9,4
  expect(goBoard.stoneGroups[13].intersections.length).toBe(1);
  expect(goBoard.stoneGroups[13].stoneColor).toBe(BLACK_STONE);
  expect(goBoard.stoneGroups[13].libertiesSet.size).toBe(2);
});

test('if two groups with blobs and wholes board, then group with correct intersections', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
/* 00  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
/* 01  */"w _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
/* 02  */"w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
/* 03  */"b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
/* 04  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
/* 05  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
/* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
/* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
/* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //08
/* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //09
/* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //10
/* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //11
/* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //12
/* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //13
/* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //14
/* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
/* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
/* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
/* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18
  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  //assert
  expect(goBoard.stoneGroups.length).toBe(5);
  expect(goBoard.stoneGroups[0].intersections.length).toBe(3);
  expect(goBoard.stoneGroups[0].stoneColor).toBe(WHITE_STONE);
  expect(goBoard.stoneGroups[0].libertiesSet.size).toBe(2);
  expect(goBoard.stoneGroups[2].intersections.length).toBe(3);
  expect(goBoard.stoneGroups[2].stoneColor).toBe(WHITE_STONE);
  expect(goBoard.stoneGroups[2].libertiesSet.size).toBe(2);
});

test('if two groups with blobs and wholes board, then group with correct intersections', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
/* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
/* 01  */"_ _ _ _ w w w _ _ _ _ _ _ _ _ _ _ _ _," +  //01
/* 02  */"_ _ _ w b b b w w w _ _ _ _ _ _ _ _ _," +  //02
/* 03  */"_ _ _ w b _ b b b b w _ _ _ _ _ _ _ _," +  //03
/* 04  */"_ _ _ w b b _ _ _ b w _ _ _ _ _ _ _ _," +  //04
/* 05  */"_ _ _ _ w w b b b b w _ _ _ _ _ _ _ _," +  //05
/* 06  */"_ _ _ _ _ _ w w w w _ _ _ _ _ _ _ _ _," +  //06
/* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //07
/* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //08
/* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //09
/* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //10
/* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //11
/* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //12
/* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //13
/* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //14
/* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //15
/* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //16
/* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //17
/* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18
  const templateBoard: string[][] = stringBoardToArray(boardString);
  //act
  const goBoard = new GoBoard(templateBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  //assert
  expect(goBoard.stoneGroups.length).toBe(7);
  expect(goBoard.stoneGroups[2].intersections.length).toBe(15);
  expect(goBoard.stoneGroups[2].stoneColor).toBe(BLACK_STONE);
  expect(goBoard.stoneGroups[2].libertiesSet.size).toBe(4);
});
