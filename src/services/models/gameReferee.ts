import { GoBoard } from "./goBoard";
import { StoneGroup } from "./stoneGroup";
import { StonePlay } from "./stonePlay";
import { Submission } from "./submission";
import { SubmissionResult } from "./submissionResult";

/* export class GameReferee{
    constructor(){
    } */

    export function evaluateSubmission(submission:Submission):SubmissionResult{
        //tbd check for non-confirming submission -> log error -> throw error
        // no new stone
        // missing ko compare
        // missing current board
        // stone out of range
        // board size invalid either
        // invalide characters in board either
         
        const result=new SubmissionResult();
        const defenderColor=submission.stonePlay.stoneColor==='w'?'b':'w';

        const isCollision = checkIsCollision(submission.currentBoard,submission.stonePlay);
        if(isCollision){
                result.isCollision=true;
                result.isSuicide=false;
                result.isLegalPlay=false;
                result.capturedStones=0;
                result.newBoard=cloneBoard(submission.currentBoard);
                return result;
        }

        const workBoard=cloneBoard(submission.currentBoard);
        applySubmittedPlayToWorkBoard(submission,workBoard);
        const goBoard = new GoBoard( workBoard);
        goBoard.applyGroupAnIntersectionToBoard();
        const defenderGroups=getGroupsByStoneColor(goBoard.stoneGroups,defenderColor);

        const deadDefenderGroups=getDeadGroups(defenderGroups);
        if(deadDefenderGroups.length<1){// check for suiside
            const playerGroups=getGroupsByStoneColor(goBoard.stoneGroups,submission.stonePlay.stoneColor);
            const deadPlayerGroups=getDeadGroups(playerGroups);
            if(deadPlayerGroups.length>0){
                result.isSuicide=true;
                result.isLegalPlay=false;
                result.capturedStones=0;
                result.newBoard=cloneBoard(submission.currentBoard);
                return result;
                // set result to starting board;
            }
        }

        const deadDefenderStones =removeDeadStones(workBoard, deadDefenderGroups);
        if(!submission.isFirstPlay){
        const isKo=checkIsKo(workBoard,submission.previousBoard);

        if(isKo){
            result.isKo=true;
            result.isLegalPlay=false;
            result.capturedStones=0;
            result.newBoard=cloneBoard(submission.currentBoard);
            return result;
        }
    }

        const liveDefenderGroups=getLiveGroups(defenderGroups);
        const atriGroups= getGroupsWithOneLiberty(liveDefenderGroups);

       result.isAtari=atriGroups.length>0;
       result.capturedStones=deadDefenderStones;
       result.newBoard=cloneBoard(workBoard);
       result.isLegalPlay;
       return result;
        }




















        // export function  groupOfIntersectionHasLiberty(board:GoBoard,row:number,col:number):boolean{
        //     //tbd check for group null;  Throw error?
        //     return board.board[row][col].group!.libertiesSet.size>1;
        // }

        export function  cloneBoard(boardIn: string[][] ):string[][]{
            return   JSON.parse(JSON.stringify(boardIn));// [...submission.currentBoard];
        }

        export function  applySubmittedPlayToWorkBoard(submission:Submission,  stringBoard:string[][]):void{
            stringBoard[submission.stonePlay.row][submission.stonePlay.col]=submission.stonePlay.stoneColor;
        }


        export function  getGroupsByStoneColor(groups:StoneGroup[],stoneColor:string):StoneGroup[]{
            return  groups.filter(group => group.stoneColor===stoneColor)
        }


        // export function  getPlayerGroups(groups:StoneGroup[],defenderColor:string):StoneGroup[]{
        //     return defenderGroup = groups.filter(group => group.stoneColor!==defenderColor)
        // }


        export function  getDeadGroups(groups:StoneGroup[]):StoneGroup[]{
            return groups.filter(group => group.libertiesSet.size<1);
        }

        export function  getLiveGroups(groups:StoneGroup[]):StoneGroup[]{
            return groups.filter(group => group.libertiesSet.size>0);
        }

        export function  getGroupsWithOneLiberty(groups:StoneGroup[]):StoneGroup[]{
            return groups.filter(group => group.liberties===1);
        }

        export function removeDeadStones(stringBoard:string[][],deadGroups:StoneGroup[]):number
        {
            let deadStoneCount=0;
            for(const group of deadGroups){
                for(const intersection of group.intersections){
                    stringBoard[intersection.row][intersection.col]='_';
                    deadStoneCount++;
                    
                }
            }
            return deadStoneCount;
        }



        // export function removeDeadGroups(stringBoard:string[][],deadGroups:StoneGroup[]):number
        // {
        //     let deadStoneCount=0;
        //     for(const group of deadGroups){
        //         for(const intersection of group.intersections){
        //             stringBoard[intersection.row][intersection.col]='_';
        //             deadStoneCount++;
                    
        //         }
        //     }
        //     return deadStoneCount;
        // }

        export function checkIsKo(newBoard:string[][],koCompareBoard: string[][]):boolean{
         return (JSON.stringify(newBoard) === JSON.stringify(koCompareBoard));
        }
        export function checkIsCollision(currentBoard:string[][],stonePlay:StonePlay):boolean{
          return (currentBoard[stonePlay.row][stonePlay.col]!=="_");
        }

  //  }