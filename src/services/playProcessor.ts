//import { StonePlay } from "./models/stonePlay";
import { Submission } from "./models/submission";
import { SubmissionResult } from "./models/submissionResult";

export const evaluatePlay=(submission:Submission):SubmissionResult =>{
    const result:SubmissionResult=new SubmissionResult();
    
    checkForErrors(submission);

    if(checkIsCollision(submission)){
        result.isCollision=true;
        return result;
    }
    result.newBoard=placeStone(submission);
    return result;
}

function placeStone(submission:Submission): string [][] {
    const resultBoard = submission.currentBoard;
    resultBoard[submission.stonePlay.row][submission.stonePlay.col]=submission.stonePlay.stoneColor;
    return resultBoard;

}


//function checkIsCollision( currentBoard:string[][], stonePlay:StonePlay){
function checkIsCollision( submission:Submission){
        if(submission.currentBoard[submission.stonePlay.row][submission.stonePlay.col]!=='_'){
        return true;
    }
    return false;
}


function checkForErrors(submission:Submission):void {
    if(!submission.stonePlay.stoneColor) {
        throw new Error('Invalid sumission - no stoneColor')
    } 
}



// function arrayEquals(a, b) {
//     return Array.isArray(a) &&
//         Array.isArray(b) &&
//         a.length === b.length &&
//         a.every((val, index) => val === b[index]);
// }