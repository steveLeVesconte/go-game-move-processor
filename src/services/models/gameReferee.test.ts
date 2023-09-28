import { test, expect } from 'vitest';
import { emptyBoard } from '../../utilities/boardUtilities';
import { GoBoard } from './goBoard';
import { Submission } from './submission';
import { StonePlay } from './stonePlay';
import { stringBoardToArray } from '../../utilities/boardUtilities';
import { applySubmittedPlayToWorkBoard, cloneBoard, evaluateSubmission, getDeadGroups, getGroupsByStoneColor, getGroupsWithOneLiberty, removeDeadStones } from './gameReferee';
import {  ACTION_EXIT, ACTION_PASS, ACTION_STONE_PLAY, BLACK_STONE, EMPTY_INTERSECTION, WHITE_STONE } from './constants';

test('evaluateSubmission - when play is applied, board changes', () => {
  //arrange
  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(boardString);

  const koCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const koCompareBoard: string[][] = stringBoardToArray(koCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,BLACK_STONE);

  //Act
  const submissionResult = evaluateSubmission(submission);

  //assert
  const areSame = (JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));
  expect(areSame).toBeFalsy();
  expect(submissionResult.newBoard[2][0]).toBe(BLACK_STONE);
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(false);
});

test('evaluateSubmission - when killing play is applied, defender group loses stones', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w b _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const KoeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w b _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(KoeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard,ACTION_STONE_PLAY,BLACK_STONE);
  //Act
  const submissionResult = evaluateSubmission(submission);
  //assert
  const areSame = (JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));
  expect(areSame).toBe(false);
  expect(submissionResult.capturedStones).toBe(1);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(false);
  expect(submissionResult.isCollision).toBe(false);
  expect(submissionResult.isKo).toBe(false);
  expect(submissionResult.isSuicide).toBe(false);
});

test('evaluateSubmission  - when play reduces defender group liberties to 1, atari is true', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w _ b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w _ b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(3, 1);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,BLACK_STONE);
  //Act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(true);
});

test('evaluateSubmission  - when new single liberty group exists after capture, atari is true', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ w _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,BLACK_STONE);

  //Act
  const submissionResult = evaluateSubmission(submission);

  //assert
  expect(submissionResult.capturedStones).toBe(3);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(true);
});



test('evaluateSubmission  - when new single liberty group exists for attacker atari is not true', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ w w _ _ _ _ w _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ w w _ _ _ _ w _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,WHITE_STONE);

  //Act
  const submissionResult = evaluateSubmission(submission);

  //assert
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(false);
});

test('evaluateSubmission  - when new single liberty group exists for defender atari is  true', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ w w _ _ _ _ w w _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"_ w w _ _ _ _ w _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,BLACK_STONE);

  //Act
  const submissionResult = evaluateSubmission(submission);

  //assert
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isAtari).toBe(true);
});



test('removeDeadStones - when killing play is applied, defender groups loses liberties and stones are removed', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ w _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,BLACK_STONE);

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
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ b _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koeCompareBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareBoard: string[][] = stringBoardToArray(koeCompareBoardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, koCompareBoard, startingBoard, ACTION_STONE_PLAY,WHITE_STONE);
  //Act
  const submissionResult = evaluateSubmission(submission);
  //assert
  const areSame = (JSON.stringify(startingBoard) === JSON.stringify(submissionResult.newBoard));
 expect(areSame).toBe(true);
   expect(submissionResult.capturedStones).toBe(0);
   expect(submissionResult.isLegalPlay).toBe(false);
   expect(submissionResult.isAtari).toBe(false);
   expect(submissionResult.isCollision).toBe(false);
   expect(submissionResult.isKo).toBe(false);
   expect(submissionResult.isSuicide).toBe(true);
});

test('ko - when play violates ko rule, isLegalPlay is set to false', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
  const stonePlay: StonePlay = new StonePlay(0, 3);
  const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard, ACTION_STONE_PLAY,WHITE_STONE);
  //act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.isKo).toBeTruthy();
  expect(submissionResult.isAtari).toBe(false);
  expect(submissionResult.isLegalPlay).toBeFalsy();
  const areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeTruthy();
  expect(submissionResult.capturedStones).toBe(0)
});

test('ko - not false positive for ko rule', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
  const stonePlay: StonePlay = new StonePlay(0, 3);
  const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard, ACTION_STONE_PLAY,WHITE_STONE);
  //act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.isKo).toBeFalsy();
  expect(submissionResult.isLegalPlay).toBeTruthy();
  const areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeFalsy();
  expect(submissionResult.capturedStones).toBe(1);
  expect(submissionResult.isAtari).toBe(false);
});

test('when invalid row in play is in Submission invalid result returned', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
  const stonePlay: StonePlay = new StonePlay(-1, 1);
  const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard,ACTION_STONE_PLAY,WHITE_STONE);
  //act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.isValidSubmission).toBeFalsy();
  expect(submissionResult.reasonSubmissionInvalid).toBe("Invalid value in stonePlay row: -1 ");
  expect(submissionResult.isLegalPlay).toBeFalsy();
  expect(submissionResult.isKo).toBeFalsy();
  const areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeTruthy();
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isAtari).toBe(false);
});

test('when invalid column in play is in Submission invalid result returned', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
  const stonePlay: StonePlay = new StonePlay(11, 20);
  const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard, ACTION_STONE_PLAY,WHITE_STONE);
  //act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.isValidSubmission).toBeFalsy();
  expect(submissionResult.reasonSubmissionInvalid).toBe("Invalid value in stonePlay col: 20 ");
  expect(submissionResult.isLegalPlay).toBeFalsy();
  expect(submissionResult.isKo).toBeFalsy();
  const areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeTruthy();
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isAtari).toBe(false);
});


test('when invalid play is colission in Submission invalid result returned', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);

  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
  const stonePlay: StonePlay = new StonePlay(1, 2);
  const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard, ACTION_STONE_PLAY,WHITE_STONE);
  //act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.isCollision).toBeTruthy();
  expect(submissionResult.isValidSubmission).toBeFalsy();
  expect(submissionResult.reasonSubmissionInvalid).toBe("Invalid value in stone play - intersection is occupied: 1, 2");
  expect(submissionResult.isLegalPlay).toBeFalsy();
  expect(submissionResult.isKo).toBeFalsy();
  const areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeTruthy();
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isAtari).toBe(false);
});








test('when PASS is Submission result is correct', () => {
 //arrange
 const startingBoardString =
 //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
 /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
 /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
 /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
 /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
 /* 04  */"b w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
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
 /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
 const startingBoard: string[][] = stringBoardToArray(startingBoardString);

 const koCompareStringBoardString =
 //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
 /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
 /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
 /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
 /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
 /* 04  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
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
 /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
  const stonePlay: StonePlay = new StonePlay(1, 2);
  const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard, ACTION_PASS,WHITE_STONE);
  //act
  const submissionResult = evaluateSubmission(submission);
  //assert
  expect(submissionResult.isPass).toBe(true);
   expect(submissionResult.isValidSubmission).toBe(true);
   expect(submissionResult.reasonSubmissionInvalid).toBe("");
   expect(submissionResult.isLegalPlay).toBe(true);
  expect(submissionResult.isKo).toBe(false);
  let areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeTruthy();
  areSame = (JSON.stringify(submissionResult.newKoCompareBoard) === JSON.stringify(submission.currentBoard));
  expect(areSame).toBeTruthy();
  expect(submissionResult.capturedStones).toBe(0);
  expect(submissionResult.isAtari).toBe(false);
});




test('when EXIT is Submission result is correct', () => {
  //arrange
  const startingBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"b w w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const startingBoard: string[][] = stringBoardToArray(startingBoardString);
 
  const koCompareStringBoardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ w b _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ _ w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"b w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
 
   const koCompareStringBoard: string[][] = stringBoardToArray(koCompareStringBoardString);
   const stonePlay: StonePlay = new StonePlay(1, 2);
   const submission: Submission = new Submission(stonePlay, koCompareStringBoard, startingBoard,ACTION_EXIT,WHITE_STONE);
   //act
   const submissionResult = evaluateSubmission(submission);
   //assert
   expect(submissionResult.isPass).toBe(false);
    expect(submissionResult.isExit).toBe(true);

   //expect(submissionResult.isValidSubmission).toBe(true);
    expect(submissionResult.reasonSubmissionInvalid).toBe("");
    expect(submissionResult.isLegalPlay).toBe(false);
   expect(submissionResult.isKo).toBe(false);
  //  let areSame = (JSON.stringify(submissionResult.newBoard) === JSON.stringify(submission.currentBoard));
  //  expect(areSame).toBeTruthy();
  //  areSame = (JSON.stringify(submissionResult.newKoCompareBoard) === JSON.stringify(submission.previousBoard));
  //  expect(areSame).toBeTruthy();
    expect(submissionResult.capturedStones).toBe(0);
    expect(submissionResult.isAtari).toBe(false);
 });
 
 



















/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//internal tests
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

test('internal - if cloneBoard used, boards are identical', () => {
  //arrange
  const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
    /* 01  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
    /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const templateBoard: string[][] = stringBoardToArray(boardString);

  const stonePlay: StonePlay = new StonePlay(2, 0);

  const submission: Submission = new Submission(stonePlay, templateBoard, templateBoard,ACTION_EXIT,BLACK_STONE);
  //act
  const workBoard = cloneBoard(submission.currentBoard);
  //assert
  const areSame = (JSON.stringify(templateBoard) === JSON.stringify(workBoard));
  expect(areSame).toBeTruthy();
});

test('internal - applySubmittedPlayToWorkBoard - when play is applied, board changes', () => {
  //arrange 
  const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
    /* 01  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
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
    /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, templateBoard, templateBoard,ACTION_EXIT,BLACK_STONE);
  const workBoard = cloneBoard(submission.currentBoard);

  //act
  applySubmittedPlayToWorkBoard(submission, workBoard);
  //assurt
  const areSame = (JSON.stringify(templateBoard) === JSON.stringify(workBoard));
  expect(areSame).toBeFalsy();
  expect(workBoard[2][0]).toBe(BLACK_STONE);
});

test('internal - findDeadDefenderGroups - when killing play is applied, defender group loses liberties', () => {
  //arrange
  const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
    /* 01  */"w b _ w _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
    /* 02  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
    /* 03  */"_ _ _ w w _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
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
    /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, templateBoard, templateBoard,ACTION_EXIT,BLACK_STONE);
  const workBoard = cloneBoard(submission.currentBoard);
  applySubmittedPlayToWorkBoard(submission, workBoard);
  const areSame = (JSON.stringify(templateBoard) === JSON.stringify(workBoard));

  expect(areSame).toBe(false);

  const goBoard = new GoBoard(workBoard);

  goBoard.applyGroupAnIntersectionToBoard();
  const defenderColor = submission.stoneColorOfThisTurn === WHITE_STONE ? BLACK_STONE : WHITE_STONE;
  const defenderGroups = getGroupsByStoneColor(goBoard.stoneGroups, defenderColor);
  const deadDefenderGroups = getDeadGroups(defenderGroups);

  expect(deadDefenderGroups.length).toBe(1);
});

test('internal - findDeadDefenderGroups - when killing play is applied, defender groups loses liberties', () => {

  const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
    /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
    /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
    /* 03  */"w b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
    /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
    /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
    /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
    /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, templateBoard, templateBoard,ACTION_EXIT,BLACK_STONE);
  const workBoard = cloneBoard(submission.currentBoard);
  applySubmittedPlayToWorkBoard(submission, workBoard);
  const areSame = (JSON.stringify(templateBoard) === JSON.stringify(workBoard));

  expect(areSame).toBe(false);

  const goBoard = new GoBoard(workBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  const defenderColor = submission.stoneColorOfThisTurn === WHITE_STONE ? BLACK_STONE : WHITE_STONE;
  const defenderGroups = getGroupsByStoneColor(goBoard.stoneGroups, defenderColor);
  const deadDefenderGroups = getDeadGroups(defenderGroups);
  expect(deadDefenderGroups.length).toBe(3);

});

test('internal - removeDeadStones - when killing play is applied, defender groups loses liberties and stones are removed', () => {

  const boardString =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
    /* 01  */"w b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
    /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
    /* 03  */"w b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
    /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
    /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
    /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
    /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const templateBoard: string[][] = stringBoardToArray(boardString);

  const boardStringPredicted =
    //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
    /* 00  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
    /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
    /* 02  */"b _ _ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
    /* 03  */"_ b b b w _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
    /* 04  */"_ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
    /* 05  */"_ b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
    /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
    /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18

  const templateBoardPredicted: string[][] = stringBoardToArray(boardStringPredicted);
  const stonePlay: StonePlay = new StonePlay(2, 0);
  const submission: Submission = new Submission(stonePlay, templateBoard, templateBoard,ACTION_EXIT,BLACK_STONE);
  const workBoard = cloneBoard(submission.currentBoard);
  applySubmittedPlayToWorkBoard(submission, workBoard);
  const areSame = (JSON.stringify(templateBoard) === JSON.stringify(workBoard));

  expect(areSame).toBe(false);

  const goBoard = new GoBoard(workBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  const defenderColor = submission.stoneColorOfThisTurn === WHITE_STONE ? BLACK_STONE : WHITE_STONE;
  const defenderGroups = getGroupsByStoneColor(goBoard.stoneGroups, defenderColor);
  const deadDefenderGroups = getDeadGroups(defenderGroups);
  const deadStones = removeDeadStones(workBoard, deadDefenderGroups);

  expect(deadDefenderGroups.length).toBe(3);
  expect(deadStones).toBe(6);

  const aspredicted = (JSON.stringify(templateBoardPredicted) === JSON.stringify(workBoard));
  expect(aspredicted).toBe(true);
});

test('internal - new goBoard to be constructed correctly', () => {
  const testBoard = emptyBoard();
  const goBoard = new GoBoard(testBoard);
  expect(goBoard.board.length).toBe(19);
  expect(goBoard.board[18].length).toBe(19);
  expect(goBoard.board[18][18].strinColor).toBe(EMPTY_INTERSECTION);
  expect(goBoard.board[15][15].col).toBe(15);
  expect(goBoard.board[15][15].row).toBe(15);
});

test('internal - removeDeadStones - when play reduces defener group liberties to 1, atari is true', () => {

  const boardString =
  //        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 
  /* 00  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //00
  /* 01  */"_ b b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //01
  /* 02  */"_ w w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //02
  /* 03  */"w _ b b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //03
  /* 04  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //04
  /* 05  */"w b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //05
  /* 06  */"b _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _," +  //06
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
  /* 18  */"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";  //18
  const templateBoard: string[][] = stringBoardToArray(boardString);
  const stonePlay: StonePlay = new StonePlay(3, 1);
  const submission: Submission = new Submission(stonePlay, templateBoard, templateBoard,ACTION_EXIT,BLACK_STONE);
  const workBoard = cloneBoard(submission.currentBoard);
  applySubmittedPlayToWorkBoard(submission, workBoard);
  const areSame = (JSON.stringify(templateBoard) === JSON.stringify(workBoard));

  expect(areSame).toBe(false);

  const goBoard = new GoBoard(workBoard);
  goBoard.applyGroupAnIntersectionToBoard();
  const defenderColor = submission.stoneColorOfThisTurn === WHITE_STONE ? BLACK_STONE : WHITE_STONE;
  const defenderGroups = getGroupsByStoneColor(goBoard.stoneGroups, defenderColor);
  const deadDefenderGroups = getDeadGroups(defenderGroups);
  const deadStones = removeDeadStones(workBoard, deadDefenderGroups);
  const atriGroups = getGroupsWithOneLiberty(defenderGroups);

  expect(deadDefenderGroups.length).toBe(0);
  expect(deadStones).toBe(0);
  expect(atriGroups.length).toBe(2);
});


