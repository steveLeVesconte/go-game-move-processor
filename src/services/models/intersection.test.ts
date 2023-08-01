// import subtract from "./subtract";

// test('subtract two numbers', () => {
//     expect(subtract(10,7)).toBe(3);
// });

// src/subtract.test.ts
import { test, expect } from 'vitest';
import {Intersection} from './intersection';
import { BLACK_STONE } from './constants';
test('initialize intersection populates inner cell', () => {

  const intersection = new Intersection(2,2,BLACK_STONE )

  expect(intersection.adjacentIntersections.length).toBe(4);
});

test('initialize intersection populates corner cell', () => {

  const intersection = new Intersection(0,0,BLACK_STONE )

  expect(intersection.adjacentIntersections.length).toBe(2);
});

test('initialize intersection populates edge cell', () => {

  const intersection = new Intersection(0,5,BLACK_STONE )

  expect(intersection.adjacentIntersections.length).toBe(3);
});