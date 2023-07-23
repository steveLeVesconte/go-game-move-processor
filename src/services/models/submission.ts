import { StonePlay } from "./stonePlay";

export class Submission{
    constructor(stonePlay:StonePlay, previousBoard:string [][],currentBoard:string[][]){
        this.stonePlay=stonePlay;
        this.currentBoard=currentBoard;
        this.previousBoard=previousBoard;
    }
    readonly previousBoard: string[][];
    readonly currentBoard: string[][];
    readonly stonePlay: StonePlay;
}