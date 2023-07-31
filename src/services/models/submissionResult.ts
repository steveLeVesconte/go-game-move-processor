//import { B } from "vitest/dist/types-198fd1d9.js";

export class SubmissionResult{
    isLegalPlay:boolean=true;
    isValidSumission:boolean=true;
    isKo: boolean=false;
    isSuicide: boolean=false;
    isCollision: boolean=false;
    isAtari:boolean=false;
    newBoard: string[][]=[];
    capturedStones:number=0;
    reasonInvalid:string="";
}