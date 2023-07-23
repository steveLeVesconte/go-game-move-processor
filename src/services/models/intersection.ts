import { AdjacentIntersection } from "./adjacentIntersection";
import { StoneGroup } from "./stoneGroup";

export class Intersection{
    constructor(row:number,col:number, stoneColor:string){
        this.row=row;
        this.col=col;
        this.strinColor=stoneColor;
        this.intialize();
    }
    strinColor;
    readonly row:number;
    readonly col:number;
    //group: number|null=null;
    group:StoneGroup|null=null;
    liberties: number|null=null;
    //type cell=[number, number];
    adjacentIntersections:AdjacentIntersection[]=[];



    westIntersection(){
        if(this.col>=0) return null;
        


    }
    intialize(){
        if(this.row>0){ 
           this.adjacentIntersections.push({row:this.row-1,col:this.col});
           
        }
        if(this.row<18){ 

            this.adjacentIntersections.push({row:this.row+1,col:this.col});
         }
         if(this.col>0){ 
            this.adjacentIntersections.push({row:this.row,col:this.col-1});
         }
         if(this.col<18){ 
             this.adjacentIntersections.push({row:this.row,col:this.col+1});
          }
    }

}