import { Intersection } from "./intersection";

export class StoneGroup {
    constructor(stoneColor: string) {
        this.stoneColor = stoneColor;
    }
    stoneColor: string;
    liberties: number = 0;
    libertiesSet = new Set();
    intersections: Intersection[] = [];
}