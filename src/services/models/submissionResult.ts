//import { s } from "vitest/dist/types-198fd1d9.js";
import { BLACK_STONE, WHITE_STONE } from "./constants";
import { StonePlay } from "./stonePlay";
import { Submission } from "./submission";

export class BaseSubmissionResult {

    constructor()
    {}
    public isValidSubmission: boolean= false;
        public isLegalPlay: boolean=false;
        public newBoard: string[][]=[];
        public newKoCompareBoard: string[][]=[];
        public capturedStones: number = 0;
        public isAtari: boolean = false;
        public isKo = false;
        public isSuicide = false;
        public isCollision = false;
        public isPass=false;
        public isExit=false;
        public reasonSubmissionInvalid = "";
        public stonePlay:StonePlay|null =null;
        public stoneColorOfNextTurn:string="";
}

export class SubmissionResultNotValid extends BaseSubmissionResult {

    constructor(
        newBoard: string[][],
        newKoCompareBoard: string[][],
        reasonSubmissionInvalid: string,
        submission: Submission
    ) {
        super()//false, false, newBoard, newKoCompareBoard, 0, false);
        this.isValidSubmission=false;
        this.isLegalPlay=false;
        this.newBoard=newBoard;
        this.newKoCompareBoard=newKoCompareBoard;
        this.capturedStones=0;
        this.isAtari=false;
        this.isKo = false;
        this.isSuicide = false;
        this.isCollision = false;
        this.isPass=false;
        this.isExit=false;
        this.stonePlay=submission.stonePlay;
        this.reasonSubmissionInvalid = reasonSubmissionInvalid;
        this.stoneColorOfNextTurn=submission.stoneColorOfThisTurn;
    }
}

export class SubmissionResultPass extends BaseSubmissionResult {
        constructor(
            newBoard: string[][],
            newKoCompareBoard: string[][],
            submission: Submission
        ) {
            super()//false, false, newBoard, newKoCompareBoard, 0, false);
            this.isValidSubmission=true;
            this.isLegalPlay=true;
            this.newBoard=newBoard;
            this.newKoCompareBoard=newKoCompareBoard;
            this.capturedStones=0;
            this.isAtari=false;
            this.isKo = false;
            this.isSuicide = false;
            this.isCollision = false;
            this.isPass=true;
            this.isExit=false;
            this.reasonSubmissionInvalid = "";
            this.stoneColorOfNextTurn=submission.stoneColorOfThisTurn==BLACK_STONE?WHITE_STONE:BLACK_STONE;
        }
    }

    export class SubmissionResultQuit extends BaseSubmissionResult {
        constructor(
        ) {
            super()//false, false, newBoard, newKoCompareBoard, 0, false);
            this.isExit=true;
        }
    }
    
export class SubmissionResultLegalStonePlay extends BaseSubmissionResult {

    constructor(
        newBoard: string[][],
        newKoCompareBoard: string[][],
        capturedStones:number,
        isAtari:boolean,
        submission:Submission
    ) {
        super()//false, false, newBoard, newKoCompareBoard, 0, false);
        this.isValidSubmission=true;
        this.isLegalPlay=true;
        this.newBoard=newBoard;
        this.newKoCompareBoard=newKoCompareBoard;
        this.capturedStones=capturedStones;
        this.isAtari=isAtari;
        this.isKo = false;
        this.isSuicide = false;
        this.isCollision = false;
        this.isPass=false;
        this.isExit=false;
        this.reasonSubmissionInvalid = "";
        this.stonePlay=submission.stonePlay;
        this.stoneColorOfNextTurn=submission.stoneColorOfThisTurn==BLACK_STONE?WHITE_STONE:BLACK_STONE;
    }
}

export class SubmissionResultKo extends BaseSubmissionResult {

    constructor(
        newBoard: string[][],
        newKoCompareBoard: string[][],
        submission:Submission   
    ) {
        super()//false, false, newBoard, newKoCompareBoard, 0, false);
        this.isValidSubmission=true;
        this.isLegalPlay=false;
        this.newBoard=newBoard;
        this.newKoCompareBoard=newKoCompareBoard;
        this.capturedStones=0;
        this.isAtari=false;
        this.isKo = true;
        this.isSuicide = false;
        this.isCollision = false;
        this.isPass=false;
        this.isExit=false;
        this.reasonSubmissionInvalid = "";
        this.stonePlay=submission.stonePlay;
        this.stoneColorOfNextTurn=  submission.stoneColorOfThisTurn;
    }
}

export class SubmissionResultSuiside extends BaseSubmissionResult {

    constructor(
        newBoard: string[][],
        newKoCompareBoard: string[][],
        submission:Submission
    ) {
        super()//false, false, newBoard, newKoCompareBoard, 0, false);
        this.isValidSubmission=true;
        this.isLegalPlay=false;
        this.newBoard=newBoard;
        this.newKoCompareBoard=newKoCompareBoard;
        this.capturedStones=0;
        this.isAtari=false;
        this.isKo = false;
        this.isSuicide = true;
        this.isCollision = false;
        this.isPass=false;
        this.isExit=false;
        this.reasonSubmissionInvalid = "";
        this.stonePlay=submission.stonePlay;
        this.stoneColorOfNextTurn=submission.stoneColorOfThisTurn;

    }
}

// export class SubmissionResultUnkown extends BaseSubmissionResult {

//     constructor(
//         newBoard: string[][],
//         newKoCompareBoard: string[][]
//     ) {
//         super(true, false, newBoard, newKoCompareBoard, 0, false);
//         this.isKo = false;
//         this.isSuicide = false;
//         this.isCollision = true;
//         this.reasonSubmissionInvalid = "";
//     }
// }

