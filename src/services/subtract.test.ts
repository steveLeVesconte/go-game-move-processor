// import subtract from "./subtract";

// test('subtract two numbers', () => {
//     expect(subtract(10,7)).toBe(3);
// });

// src/subtract.test.ts
import { test, expect } from 'vitest';
import subtract from './subtract';
test('subtracts two numbers', () => {
  expect(subtract(10, 7)).toBe(3);
});