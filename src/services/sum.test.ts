// import sum from "./sum";

// test('sum two numbers', () => {
//     expect(sum(4,7)).toBe(11);
// });

// src/sum.test.ts
import { test, expect } from 'vitest';
import sum from './sum';
test('sums two numbers', () => {
  expect(sum(4, 7)).toBe(11);
});