// import subtract from "./subtract";

// test('subtract two numbers', () => {
//     expect(subtract(10,7)).toBe(3);
// });

// src/subtract.test.ts
import { test, expect } from 'vitest';
import {Intersection} from './intersection';
test('initialize intersection populates inner cell', () => {

  const intersection = new Intersection(2,2,'b' )

  expect(intersection.adjacentIntersections.length).toBe(4);
});

test('initialize intersection populates corner cell', () => {

  const intersection = new Intersection(0,0,'b' )

  expect(intersection.adjacentIntersections.length).toBe(2);
});

test('initialize intersection populates edge cell', () => {

  const intersection = new Intersection(0,5,'b' )

  expect(intersection.adjacentIntersections.length).toBe(3);
});