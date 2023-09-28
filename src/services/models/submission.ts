//import { ACTION_TYPE } from "./constants";
import { StonePlay } from "./stonePlay";

export class Submission {
    constructor(stonePlay: StonePlay, previousBoard: string[][], currentBoard: string[][], actionType: string, stoneColorOfThisTurn:string) {
        this.stonePlay = stonePlay;
        this.currentBoard = currentBoard;
        this.previousBoard = previousBoard;
        this.actionType=actionType,
        this.stoneColorOfThisTurn=stoneColorOfThisTurn
    }
    readonly previousBoard: string[][];
    readonly currentBoard: string[][];
    readonly stonePlay: StonePlay;
    readonly actionType: string;
    readonly stoneColorOfThisTurn:string;
}