import { Intersection } from "./intersection";

export class StoneGroup{
    constructor(stoneColor:string){
        //this.groupNumber=groupNumber;
        this.stoneColor=stoneColor;
    }
    stoneColor:string;
    liberties:number =0;
    libertiesSet=new Set();
    //groupNumber: number;
    
    intersections: Intersection[]=[];
}