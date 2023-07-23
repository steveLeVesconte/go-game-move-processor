export class SubmissionResult{
    isValid:boolean=false;
    isKo: boolean=false;
    isSuicide: boolean=false;
    isCollision: boolean=false;
    isAtari:boolean=false;
    newBoard: string[][]=[];
    capturedStones:number=0;
}