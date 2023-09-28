
import { ACTION_EXIT, ACTION_PASS, BLACK_STONE, EMPTY_INTERSECTION, WHITE_STONE } from "./constants";
import { GoBoard } from "./goBoard";
import { StoneGroup } from "./stoneGroup";
import { StonePlay } from "./stonePlay";
import { Submission } from "./submission";
import { BaseSubmissionResult, SubmissionResultKo, SubmissionResultLegalStonePlay, SubmissionResultNotValid, SubmissionResultPass, SubmissionResultQuit, SubmissionResultSuiside } from "./submissionResult";
import SubmissionHandlerResult from "./submissionHandlerResult";

export function evaluateSubmission(submission: Submission): BaseSubmissionResult {

    // let handlerResult = handleMissingStonePlay(submission);
    // if (handlerResult.submissionHandled) return handlerResult.submissionResult;

    if(submission.actionType==ACTION_EXIT){
      return new SubmissionResultQuit();
    }

    
    if(submission.actionType==ACTION_PASS){
        return new SubmissionResultPass(submission.currentBoard,submission.currentBoard,submission);
      }

    let handlerResult = handleInvalidStonePlay(submission);
    if (handlerResult.submissionHandled) return handlerResult.submissionResult;

    handlerResult = handleMissingOrInvalidKoCompare(submission);
    if (handlerResult.submissionHandled) return handlerResult.submissionResult;

    handlerResult = handleMissingOrInvalidCurrentBoard(submission);
    if (handlerResult.submissionHandled) return handlerResult.submissionResult;

    return handleValidStonePlay(submission).submissionResult;
}

function handleValidStonePlay(submission: Submission): SubmissionHandlerResult {

    const workBoard = intializeWorkBoardWithStonePlay(submission);
    const goBoard = new GoBoard(workBoard);

    const defenderColor = submission.stoneColorOfThisTurn === WHITE_STONE ? BLACK_STONE : WHITE_STONE;
    const defenderGroups = getGroupsByStoneColor(goBoard.stoneGroups, defenderColor);
    const deadDefenderGroups = getDeadGroups(defenderGroups);

    if (checkIsSuisidePlay(deadDefenderGroups, goBoard, submission)) {
        return new SubmissionHandlerResult(true, new SubmissionResultSuiside(submission.currentBoard,submission.previousBoard,submission));
    }

    const deadDefenderStones = removeDeadStones(workBoard, deadDefenderGroups);//not a pure function - workboard is changed

    if (checkIsKo(workBoard, submission.previousBoard)) {
        return new SubmissionHandlerResult(true, new SubmissionResultKo(submission.currentBoard,submission.previousBoard,submission));
    }

    return new SubmissionHandlerResult(true, new SubmissionResultLegalStonePlay(workBoard,submission.currentBoard, deadDefenderStones, checkForAtri(defenderGroups),submission));
}

// function handleMissingStonePlay(submission: Submission): SubmissionHandlerResult {

//     if (submission.stonePlay == null) {
//         const result = new SubmissionResultNotValid(submission.currentBoard, "Missing StonePlay");
//         return new SubmissionHandlerResult(true, result);
//     }
//     return new SubmissionHandlerResult(false, new SubmissionResultNotValid(submission.currentBoard, "Sumission Not Yet Handled"));
// }

function handleInvalidStonePlay(submission: Submission): SubmissionHandlerResult {
    const stonePlay = submission.stonePlay;

    if (
        (stonePlay.col > 18) ||
        (stonePlay.col < 0)) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, `Invalid value in stonePlay col: ${stonePlay.col} `,submission);
        return new SubmissionHandlerResult(true, result);
    }

    if (
        (stonePlay.row > 18) ||
        (stonePlay.row < 0)) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, `Invalid value in stonePlay row: ${stonePlay.row} `,submission);
        return new SubmissionHandlerResult(true, result);
    }

    if (checkIsCollision(submission.currentBoard, submission.stonePlay)) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, `Invalid value in stone play - target intersection is occupied: ${stonePlay.row}, ${stonePlay.col}`,submission);
        result.isCollision=true;
        return new SubmissionHandlerResult(true, result);
    }

    return new SubmissionHandlerResult(false, new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Sumission Not Yet Handled",submission));
}

function handleMissingOrInvalidKoCompare(submission: Submission): SubmissionHandlerResult {

    const whiteOccupiedIntersectionsCurrent = countOccurrences(submission.currentBoard, 'w');

    if (whiteOccupiedIntersectionsCurrent < 3) {// ko compare not required on first 3 plays or so and not possible on first play
        return new SubmissionHandlerResult(false, new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Sumission Not Yet Handled",submission));
    }

    // const blackOccupiedIntersectionsPrevious = countOccurrences(submission.previousBoard, 'b');
    // const whiteOccupiedIntersectionsPrevious = countOccurrences(submission.previousBoard, 'w');

    // if (whiteOccupiedIntersectionsPrevious + blackOccupiedIntersectionsPrevious < 5) {
    //     const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Previous Board has too few stones",submission);
    //     return new SubmissionHandlerResult(true, result);
    // }

    if (submission.previousBoard == null) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Missing Previous Board for Ko Compare",submission);
        return new SubmissionHandlerResult(true, result);
    }

    const boardDimensionsAreValid = areDimensionsValid(submission.previousBoard);

    if (!boardDimensionsAreValid) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Previous Board dimensions are not valid",submission);
        return new SubmissionHandlerResult(true, result);
    }

    if (countInvalidStrings(submission.previousBoard)) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Previous Board contains invalid entries",submission);
        return new SubmissionHandlerResult(true, result);
    }

    return new SubmissionHandlerResult(false, new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Sumission Not Yet Handled",submission));
}

function handleMissingOrInvalidCurrentBoard(submission: Submission): SubmissionHandlerResult {

    if (submission.currentBoard == null) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Missing Current Board in submision",submission);
        return new SubmissionHandlerResult(true, result);
    }

    const boardDimensionsAreValid = areDimensionsValid(submission.currentBoard);

    if (!boardDimensionsAreValid) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Missing Current Board dimensions are not valid",submission);
        return new SubmissionHandlerResult(true, result);
    }

    if (countInvalidStrings(submission.currentBoard)) {
        const result = new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Current Board contains invalid entries",submission);
        return new SubmissionHandlerResult(true, result);
    }
    return new SubmissionHandlerResult(false, new SubmissionResultNotValid(submission.currentBoard,submission.previousBoard, "Sumission Not Yet Handled",submission));
}

function areDimensionsValid(arr: string[][]): boolean {// crafted by chatGPT
    const expectedRows = 19;
    const expectedCols = 19;

    for (const row of arr) {
        if (row.length !== expectedCols) {
            return false;
        }
    }
    return arr.length === expectedRows;
}

function countInvalidStrings(arr: string[][]): number {// crafted by chatGPT
    return arr.reduce((count, row) => {
        return count + row.reduce((rowCount, item) => {
            return rowCount + ([WHITE_STONE, BLACK_STONE, EMPTY_INTERSECTION].includes(item) ? 0 : 1);
        }, 0);
    }, 0);
}

function countOccurrences(arr: string[][], searchValue: string): number {// crafted by chatGPT
    return arr.reduce((count, row) => {
        return count + row.reduce((rowCount, item) => {
            return rowCount + (item === searchValue ? 1 : 0);
        }, 0);
    }, 0);
}

function checkForAtri(defenderGroups: StoneGroup[]): boolean {
    const liveDefenderGroups = getLiveGroups(defenderGroups);
    const atriGroups = getGroupsWithOneLiberty(liveDefenderGroups);
    return atriGroups.length > 0;
}

function checkIsSuisidePlay(deadDefenderGroups: StoneGroup[], goBoard: GoBoard, submission: Submission): boolean {
    if (deadDefenderGroups.length < 1) {// check for suiside
        const playerGroups = getGroupsByStoneColor(goBoard.stoneGroups, submission.stoneColorOfThisTurn);
        const deadPlayerGroups = getDeadGroups(playerGroups);
        if (deadPlayerGroups.length > 0) {
            return true;
        }
    }
    return false;
}

function intializeWorkBoardWithStonePlay(submission: Submission): string[][] {
    const result = cloneBoard(submission.currentBoard);
    result[submission.stonePlay.row][submission.stonePlay.col] = submission.stoneColorOfThisTurn;
    return result;
}

export function cloneBoard(boardIn: string[][]): string[][] {
    return JSON.parse(JSON.stringify(boardIn));
}

export function applySubmittedPlayToWorkBoard(submission: Submission, stringBoard: string[][]): void {
    stringBoard[submission.stonePlay.row][submission.stonePlay.col] = submission.stoneColorOfThisTurn;
}

export function getGroupsByStoneColor(groups: StoneGroup[], stoneColor: string): StoneGroup[] {
    return groups.filter(group => group.stoneColor === stoneColor)
}

export function getDeadGroups(groups: StoneGroup[]): StoneGroup[] {
    return groups.filter(group => group.libertiesSet.size < 1);
}

export function getLiveGroups(groups: StoneGroup[]): StoneGroup[] {
    return groups.filter(group => group.libertiesSet.size > 0);
}

export function getGroupsWithOneLiberty(groups: StoneGroup[]): StoneGroup[] {
    return groups.filter(group => group.liberties === 1);
}

export function removeDeadStones(stringBoard: string[][], deadGroups: StoneGroup[]): number {
    let deadStoneCount = 0;
    for (const group of deadGroups) {
        for (const intersection of group.intersections) {
            stringBoard[intersection.row][intersection.col] = EMPTY_INTERSECTION;
            deadStoneCount++;
        }
    }
    return deadStoneCount;
}

export function checkIsKo(newBoard: string[][], koCompareBoard: string[][]): boolean {
    return (JSON.stringify(newBoard) === JSON.stringify(koCompareBoard));
}

export function checkIsCollision(currentBoard: string[][], stonePlay: StonePlay): boolean {
    return (currentBoard[stonePlay.row][stonePlay.col] !== EMPTY_INTERSECTION);
}