import { test, expect } from 'vitest';
import { Intersection } from './intersection';
import { BLACK_STONE } from './constants';

test('initialize intersection populates inner cell', () => {
  //arrange  and act
  const intersection = new Intersection(2, 2, BLACK_STONE)
  //assert
  expect(intersection.adjacentIntersections.length).toBe(4);
});

test('initialize intersection populates corner cell', () => {
  //arrange and act
  const intersection = new Intersection(0, 0, BLACK_STONE)
  //assert
  expect(intersection.adjacentIntersections.length).toBe(2);
});

test('initialize intersection populates edge cell', () => {
  //arrange and act
  const intersection = new Intersection(0, 5, BLACK_STONE)
  //assert
  expect(intersection.adjacentIntersections.length).toBe(3);
});