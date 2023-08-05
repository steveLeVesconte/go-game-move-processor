
export class BaseSubmissionResult {

    constructor(public isValidSubmission: boolean,
        public isLegalPlay: boolean,
        public newBoard: string[][],
        public capturedStones: number = 0,
        public isAtari: boolean = false) {
        this.isKo = false;
        this.isSuicide = false;
        this.isCollision = false;
        this.reasonSubmissionInvalid = "";
    }
    public isKo: boolean;
    public isSuicide: boolean;
    public isCollision: boolean;
    public reasonSubmissionInvalid: string;
}
export class SubmissionResultNotValid extends BaseSubmissionResult {

    constructor(
        newBoard: string[][],
        reasonSubmissionInvalid: string
    ) {
        super(false, false, newBoard, 0, false);
        this.isKo = false;
        this.isSuicide = false;
        this.isCollision = false;
        this.reasonSubmissionInvalid = reasonSubmissionInvalid;
    }
}


export class SubmissionResultLegal extends BaseSubmissionResult {

    constructor(
        newBoard: string[][],
        capturedStones: number,
        isAtari: boolean
    ) {
        super(true, true, newBoard, capturedStones, isAtari);
        this.isKo = false;
        this.isSuicide = false;
        this.isCollision = false;
        this.reasonSubmissionInvalid = "";
    }
}

export class SubmissionResultKo extends BaseSubmissionResult {

    constructor(
        newBoard: string[][]
    ) {
        super(true, false, newBoard, 0, false);
        this.isKo = true;
        this.isSuicide = false;
        this.isCollision = false;
        this.reasonSubmissionInvalid = "";
    }
}
export class SubmissionResultSuiside extends BaseSubmissionResult {

    constructor(
        newBoard: string[][]
    ) {
        super(true, false, newBoard, 0, false);
        this.isKo = false;
        this.isSuicide = true;
        this.isCollision = false;
        this.reasonSubmissionInvalid = "";
    }
}

export class SubmissionResultUnkown extends BaseSubmissionResult {

    constructor(
        newBoard: string[][]
    ) {
        super(true, false, newBoard, 0, false);
        this.isKo = false;
        this.isSuicide = false;
        this.isCollision = true;
        this.reasonSubmissionInvalid = "";
    }
}

