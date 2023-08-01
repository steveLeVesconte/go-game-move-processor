import { EMPTY_INTERSECTION } from "./constants";
import { Intersection } from "./intersection";
import { StoneGroup } from "./stoneGroup";

export class GoBoard {
  constructor(stringBoard: string[][]) {
    this.board = this.populateGoBoard(stringBoard);
    this.applyGroupAnIntersectionToBoard();
  }
  public board: Intersection[][];
  public stoneGroups: StoneGroup[] = [];

  populateGoBoard(stringBoard: string[][]): Intersection[][] {
    const result: Intersection[][] = [];
    for (let i = 0; i < 19; i++) {
      const goBoardRow: Intersection[] = [];
      for (let j = 0; j < 19; j++) {
        goBoardRow[j] = new Intersection(i, j, stringBoard[i][j])
      }
      result.push(goBoardRow);
    }
    return result;
  }

  groupAnIntersection(intersection: Intersection, stoneColor: string, stoneGroup: StoneGroup | null): void {
    let currentGroup: StoneGroup | null = null;
    if (intersection.group) return;
    if (intersection.strinColor !== stoneColor) return;
    if (stoneGroup) {
      currentGroup = stoneGroup;
      intersection.group = stoneGroup;
      currentGroup.intersections.push(intersection);
    } else {
      currentGroup = new StoneGroup(stoneColor);
      currentGroup.intersections.push(intersection);
      this.stoneGroups.push(currentGroup);
    }
    intersection.group = currentGroup;
    intersection.adjacentIntersections.forEach((i) => {

      const targetIntersection = this.board[i.row][i.col];
      if (targetIntersection.strinColor === EMPTY_INTERSECTION) {
        currentGroup!.liberties++;
        currentGroup?.libertiesSet.add(targetIntersection.row.toString().padStart(2, '0') + targetIntersection.col.toString().padStart(2, '0'));
      }
      this.groupAnIntersection(targetIntersection, stoneColor, currentGroup);
    })
  }

  applyGroupAnIntersectionToBoard(
  ): void {
    for (const row of this.board) {
      for (const intersection of row) {
        if ((intersection.strinColor !== EMPTY_INTERSECTION) && !intersection.group) {
          this.groupAnIntersection(intersection, intersection.strinColor, null);
        }
      }
    }
  }
}