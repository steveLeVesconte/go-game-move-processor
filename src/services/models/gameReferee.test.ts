import { test, expect } from 'vitest';
import { emptyBoard } from '../../utilities/boardUtilities';
import { GoBoard } from './goBoard';
import { Submission } from './submission';
import { StonePlay } from './stonePlay';
import { stringBoardToArray } from '../../utilities/boardUtilities';
import { applySubmittedPlayToWorkBoard, cloneBoard, evaluateSubmission, getDeadGroups, getGroupsByStoneColor, getGroupsWithOneLiberty, removeDeadStones } from './gameReferee';

test('evaluateSubmission - when play is applied, board changes', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
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
  const startingBoard:string[][]=stringBoardToArray(boardString);

  const koCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
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

  const koCompareBoard:string[][]=stringBoardToArray(koCompareBoardString);
  const stonePlay: StonePlay=new StonePlay(2,0,'b');
  const submission: Submission= new Submission(stonePlay,koCompareBoard,startingBoard);

//Act
  const submissionResult = evaluateSubmission(submission);

//assert
  const areSame=(JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));
  expect(areSame).toBeFalsy();
  expect(submissionResult.newBoard[2][0]).toBe('b');
  expect(submissionResult.capturedStones).toBe(0);
   expect(submissionResult.isLegalPlay).toBe(true);
   expect(submissionResult.isAtari).toBe(false);
   expect(submissionResult.isCollision).toBe(false);
   expect(submissionResult.isKo).toBe(false);
   expect(submissionResult.isSuicide).toBe(false);
});


test('evaluateSubmission - when killing play is applied, defender group loses stones', () => {

  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ _ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
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
  const startingBoard:string[][]=stringBoardToArray( startingBoardString);

  const KoeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
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
  const koCompareBoard:string[][]=stringBoardToArray( KoeCompareBoardString);
  const stonePlay: StonePlay=new StonePlay(2,0,'b');
  const submission: Submission= new Submission(stonePlay,koCompareBoard,startingBoard);

//Act
const submissionResult = evaluateSubmission(submission);

//assert
 const areSame=(JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));

  expect(areSame).toBe(false);
  expect(submissionResult.capturedStones).toBe(1);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(false);
  expect(submissionResult.isCollision).toBe(false);
  expect(submissionResult.isKo).toBe(false);
  expect(submissionResult.isSuicide).toBe(false);
});


test('evaluateSubmission  - when play reduces defender group liberties to 1, atari is true', () => {
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w _ b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
   const startingBoard:string[][]=stringBoardToArray(startingBoardString);

   const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w _ b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  const koCompareBoard:string[][]=stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay=new StonePlay(3,1,'b');
  const submission: Submission= new Submission(stonePlay,koCompareBoard,startingBoard);

//Act
const submissionResult = evaluateSubmission(submission);

//assert
 expect(submissionResult.capturedStones).toBe(0);
 expect(submissionResult.isLegalPlay).toBe(true);
 expect(submissionResult.isAtari).toBe(true);
 expect(submissionResult.isCollision).toBe(false);
 expect(submissionResult.isKo).toBe(false);
 expect(submissionResult.isSuicide).toBe(false);
});


test('removeDeadStones - when killing play is applied, defender groups loses liberties and stones are removed', () => {

  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ w _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
const startingBoard:string[][]=stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  const koCompareBoard:string[][]=stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay=new StonePlay(2,0,'b');
  const submission: Submission= new Submission(stonePlay,koCompareBoard,startingBoard);

//Act
const submissionResult = evaluateSubmission(submission);

//assert
 expect(submissionResult.capturedStones).toBe(6);
 expect(submissionResult.isLegalPlay).toBe(true);
 expect(submissionResult.isAtari).toBe(false);
 expect(submissionResult.isCollision).toBe(false);
 expect(submissionResult.isKo).toBe(false);
 expect(submissionResult.isSuicide).toBe(false);
});



test('detect suiside - when suiside play is applied, defender groups loses liberties and stones are not removed', () => {

  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ b _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
const startingBoard:string[][]=stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  const koCompareBoard:string[][]=stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay=new StonePlay(2,0,'w');
  const submission: Submission= new Submission(stonePlay,koCompareBoard,startingBoard);

//Act
const submissionResult = evaluateSubmission(submission);

//assert
const areSame=(JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));

 expect(areSame).toBe(true);
 expect(submissionResult.capturedStones).toBe(0);
 expect(submissionResult.isLegalPlay).toBe(false);
 expect(submissionResult.isAtari).toBe(false);
 expect(submissionResult.isCollision).toBe(false);
 expect(submissionResult.isKo).toBe(false);
 expect(submissionResult.isSuicide).toBe(true);
});


test('detect collision - when play is applied to occupied intersection, collision is returned', () => {

  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ b _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
const startingBoard:string[][]=stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  const koCompareBoard:string[][]=stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay=new StonePlay(3,3,'w');
  const submission: Submission= new Submission(stonePlay,koCompareBoard,startingBoard);

//Act
const submissionResult = evaluateSubmission(submission);

//assert
const areSame=(JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));

 expect(areSame).toBe(true);
 expect(submissionResult.capturedStones).toBe(0);
 expect(submissionResult.isLegalPlay).toBe(false);
 expect(submissionResult.isAtari).toBe(false);
 expect(submissionResult.isCollision).toBe(true);
 expect(submissionResult.isKo).toBe(false);
 expect(submissionResult.isSuicide).toBe(false);
});























//internal tests
test('internal - if cloneBoard used, boards are identical', () => {
//arrange
    const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
    /* 01  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
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
  
    const stonePlay: StonePlay=new StonePlay(2,0,'b');

    const submission: Submission= new Submission(stonePlay,templateBoard,templateBoard);
    //act
    const workBoard =cloneBoard(submission.currentBoard);
    //assert
    const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));
    expect(areSame).toBeTruthy();

  });

  

  test('internal -- applySubmittedPlayToWorkBoard - when play is applied, board changes', () => {
  //arrange 
    const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
    /* 01  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
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
  

    const stonePlay: StonePlay=new StonePlay(2,0,'b');

    const submission: Submission= new Submission(stonePlay,templateBoard,templateBoard);

    const workBoard =cloneBoard(submission.currentBoard);

 //act
    applySubmittedPlayToWorkBoard(submission ,workBoard);
//assurt
    const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));
    expect(areSame).toBeFalsy();
    expect(workBoard[2][0]).toBe('b');

  });



  test('findDeadDefenderGroups - when killing play is applied, defender group loses liberties', () => {

    const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
    /* 01  */"w b _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
    /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
    /* 03  */"_ _ _ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
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
  

    const stonePlay: StonePlay=new StonePlay(2,0,'b');

    const submission: Submission= new Submission(stonePlay,templateBoard,templateBoard);

    const workBoard =cloneBoard(submission.currentBoard);

 
    applySubmittedPlayToWorkBoard(submission ,workBoard);

    const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));


    expect(areSame).toBe(false);
 

    const goBoard = new GoBoard(workBoard);

    goBoard.applyGroupAnIntersectionToBoard();
    const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';
    const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);
    const deadDefenderGroups=getDeadGroups(defenderGroups);
    //removeDeadStones(workBoard,deadDefenderGroups);

    expect(deadDefenderGroups.length).toBe(1);
  });



  test('findDeadDefenderGroups - when killing play is applied, defender groups loses liberties', () => {

    const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
    /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
    /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
    /* 03  */"w b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
    /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
    /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
    /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  

    const stonePlay: StonePlay=new StonePlay(2,0,'b');

    const submission: Submission= new Submission(stonePlay,templateBoard,templateBoard);

    const workBoard =cloneBoard(submission.currentBoard);

 
    applySubmittedPlayToWorkBoard(submission ,workBoard);

    const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));


    expect(areSame).toBe(false);
 

    const goBoard = new GoBoard(workBoard);

    goBoard.applyGroupAnIntersectionToBoard();
    const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';
    const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);
    const deadDefenderGroups=getDeadGroups(defenderGroups);
    //const deadDefenderGroups=findDeadDefenderGroups(goBoard.stoneGroups,defenderColor);

    expect(deadDefenderGroups.length).toBe(3);

  });




  test('removeDeadStones - when killing play is applied, defender groups loses liberties and stones are removed', () => {

    const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
    /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
    /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
    /* 03  */"w b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
    /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
    /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
    /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  


    const boardStringPredicted =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
    /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
    /* 02  */"b _ _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
    /* 03  */"_ b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
    /* 04  */"_ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
    /* 05  */"_ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
    /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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
  
    const templateBoardPredicted:string[][]=stringBoardToArray(boardStringPredicted);




    const stonePlay: StonePlay=new StonePlay(2,0,'b');

    const submission: Submission= new Submission(stonePlay,templateBoard,templateBoard);

    const workBoard =cloneBoard(submission.currentBoard);

 
    applySubmittedPlayToWorkBoard(submission ,workBoard);

    const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));


    expect(areSame).toBe(false);
 

    const goBoard = new GoBoard(workBoard);

    goBoard.applyGroupAnIntersectionToBoard();
    const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';
    const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);
    const deadDefenderGroups=getDeadGroups(defenderGroups);

    //const deadDefenderGroups=findDeadDefenderGroups(goBoard.stoneGroups,defenderColor);

    const deadStones =removeDeadStones( workBoard,deadDefenderGroups);

    //expect(1).toBe(1);
     expect(deadDefenderGroups.length).toBe(3);

     expect(deadStones).toBe(6);

     const aspredicted=(JSON.stringify(templateBoardPredicted) === JSON.stringify(workBoard));


     expect(aspredicted).toBe(true);
 
 
  });








test('new goBoard to be constructed correctly', () => {
  const testBoard = emptyBoard();
  const goBoard = new GoBoard( testBoard);
  expect(goBoard.board.length).toBe(19);
  expect(goBoard.board[18].length).toBe(19);
  expect(goBoard.board[18][18].strinColor).toBe('_');
  expect(goBoard.board[15][15].col).toBe(15);
  expect(goBoard.board[15][15].row).toBe(15);
});







test('removeDeadStones - when play reduces defener group liberties to 1, atari is true', () => {

  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"w _ b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
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



  // const boardStringPredicted =
  // //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  // /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  // /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  // /* 02  */"b _ _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  // /* 03  */"_ b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  // /* 04  */"_ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  // /* 05  */"_ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  // /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
  // /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //07
  // /* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //08
  // /* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //09
  // /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
  // /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
  // /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
  // /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
  // /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
  // /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
  // /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
  // /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  // /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18

  //const templateBoardPredicted:string[][]=stringBoardToArray(boardStringPredicted);




  const stonePlay: StonePlay=new StonePlay(3,1,'b');

  const submission: Submission= new Submission(stonePlay,templateBoard,templateBoard);

  const workBoard =cloneBoard(submission.currentBoard);


  applySubmittedPlayToWorkBoard(submission ,workBoard);

  const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));


  expect(areSame).toBe(false);


  const goBoard = new GoBoard(workBoard);

  goBoard.applyGroupAnIntersectionToBoard();
  const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';
  const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);
  const deadDefenderGroups=getDeadGroups(defenderGroups);
  // const deadDefenderGroups=findDeadDefenderGroups(goBoard.stoneGroups,defenderColor);

  const deadStones =removeDeadStones( workBoard,deadDefenderGroups);

  const atriGroups= getGroupsWithOneLiberty(defenderGroups);


  //expect(1).toBe(1);
   expect(deadDefenderGroups.length).toBe(0);

   expect(deadStones).toBe(0);
   expect(atriGroups.length).toBe(2);




  //  const aspredicted=(JSON.stringify(templateBoardPredicted) === JSON.stringify(workBoard));


  //  expect(aspredicted).toBe(true);


});


test('ko - when play violates ko rule, isLegalPlay is set to false', () => {

  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
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


   const startingBoard:string[][]=stringBoardToArray(startingBoardString);



  //  const boardStringPredicted =
  // //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  // /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  // /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  // /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  // /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  // /* 04  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  // /* 05  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  // /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
  // /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //07
  // /* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //08
  // /* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //09
  // /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
  // /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
  // /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
  // /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
  // /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
  // /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
  // /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
  // /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  // /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18




  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
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
  const koCompareStringBoard:string[][]=stringBoardToArray(koCompareStringBoardString);




  const stonePlay: StonePlay=new StonePlay(0,3,'w');

  const submission: Submission= new Submission(stonePlay,koCompareStringBoard,startingBoard);

  const submissionResult=evaluateSubmission(submission);

  expect(submissionResult.isKo).toBeTruthy();
  //expect(submissionResult.isLegalPlay).toBeFalsy();
  //const areSame=(JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));


  //expect(areSame).toBeTruthy();

  //expect(submissionResult.capturedStones).toBe(0);

  // expect(deadStones).toBe(0);
  // expect(atriGroups.length).toBe(2);




  // const goBoard = new GoBoard(workBoard);


  // const workBoard =cloneBoard(submission.currentBoard);


  // applySubmittedPlayToWorkBoard(submission ,workBoard);

  // //const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));


  // expect(areSame).toBe(false);


  // //const goBoard = new GoBoard(workBoard);

  // goBoard.applyGroupAnIntersectionToBoard();
  // const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';
  // const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);
  // const deadDefenderGroups=getDeadGroups(defenderGroups);
  // // const deadDefenderGroups=findDeadDefenderGroups(goBoard.stoneGroups,defenderColor);

  // const deadStones =removeDeadStones( workBoard,deadDefenderGroups);

  // const atriGroups= getGroupsWithOneLiberty(defenderGroups);


  // //expect(1).toBe(1);
  //  expect(deadDefenderGroups.length).toBe(0);

  //  expect(deadStones).toBe(0);
  //  expect(atriGroups.length).toBe(2);




  //  const aspredicted=(JSON.stringify(templateBoardPredicted) === JSON.stringify(workBoard));


  //  expect(aspredicted).toBe(true);


});




test('ko - not false positive for ko rule', () => {

  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
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


   const startingBoard:string[][]=stringBoardToArray(startingBoardString);



  //  const boardStringPredicted =
  // //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  // /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  // /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  // /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  // /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  // /* 04  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
  // /* 05  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
  // /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
  // /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //07
  // /* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //08
  // /* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //09
  // /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
  // /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
  // /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
  // /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
  // /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
  // /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
  // /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
  // /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
  // /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18




  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
  /* 04  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
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
  const koCompareStringBoard:string[][]=stringBoardToArray(koCompareStringBoardString);




  const stonePlay: StonePlay=new StonePlay(0,3,'w');

  const submission: Submission= new Submission(stonePlay,koCompareStringBoard,startingBoard);

  const submissionResult=evaluateSubmission(submission);

  expect(submissionResult.isKo).toBeFalsy();
  expect(submissionResult.isLegalPlay).toBeTruthy();
  const areSame=(JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));


  expect(areSame).toBeFalsy();

  expect(submissionResult.capturedStones).toBe(1);

  // expect(deadStones).toBe(0);
  // expect(atriGroups.length).toBe(2);




  // const goBoard = new GoBoard(workBoard);


  // const workBoard =cloneBoard(submission.currentBoard);


  // applySubmittedPlayToWorkBoard(submission ,workBoard);

  // //const areSame=(JSON.stringify(templateBoard) === JSON.stringify(workBoard));


  // expect(areSame).toBe(false);


  // //const goBoard = new GoBoard(workBoard);

  // goBoard.applyGroupAnIntersectionToBoard();
  // const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';
  // const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);
  // const deadDefenderGroups=getDeadGroups(defenderGroups);
  // // const deadDefenderGroups=findDeadDefenderGroups(goBoard.stoneGroups,defenderColor);

  // const deadStones =removeDeadStones( workBoard,deadDefenderGroups);

  // const atriGroups= getGroupsWithOneLiberty(defenderGroups);


  // //expect(1).toBe(1);
  //  expect(deadDefenderGroups.length).toBe(0);

  //  expect(deadStones).toBe(0);
  //  expect(atriGroups.length).toBe(2);




  //  const aspredicted=(JSON.stringify(templateBoardPredicted) === JSON.stringify(workBoard));


  //  expect(aspredicted).toBe(true);


});






// test('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxif white stones in test template board, then group with 2 intersections', () => {

//   const boardString =
//   //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
//   /* 00  */"_ b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //00
//   /* 01  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //01
//   /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //02
//   /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //03
//   /* 04  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //04
//   /* 05  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //05
//   /* 06  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //06
//   /* 07  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //07
//   /* 08  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //08
//   /* 09  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //09
//   /* 10  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //10
//   /* 11  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //11
//   /* 12  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //12
//   /* 13  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //13
//   /* 14  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //14
//   /* 15  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //15
//   /* 16  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //16
//   /* 17  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,"+  //17
//   /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _,";  //18


//   const templateBoard:string[][]=stringBoardToArray(boardString);

//   const goBoard = new GoBoard( templateBoard);
//   goBoard.groupAnIntersection(goBoard.board[0][0],'w',null);

//   expect(goBoard.stoneGroups.length).toBe(1);
  
//   expect(goBoard.stoneGroups[0].intersections.length).toBe(2);
  
// });

