// import sum from "./sum";

// test('sum two numbers', () => {
//     expect(sum(4,7)).toBe(11);
// });

// src/sum.test.ts
import { test, expect } from 'vitest';
import {evaluatePlay} from './playProcessor';
import { Submission } from './models/submission';
import { StonePlay } from './models/stonePlay';
import { emptyBoard } from '../utilities/boardUtilities';
test('new stone placed on board in result', () => {
  const stonePlay = new StonePlay(3,4,'b');
  const sumission=new Submission(stonePlay, emptyBoard(), emptyBoard());
  const result=evaluatePlay(sumission);
  expect(result.newBoard[3][4]).toBe('b');
});