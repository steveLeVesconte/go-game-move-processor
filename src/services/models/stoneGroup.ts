import { Intersection } from "./intersection";

export class StoneGroup{
    constructor(groupNumber:number, stoneColor:string){
        this.groupNumber=groupNumber;
        this.stoneColor=stoneColor;
    }
    stoneColor;
    groupNumber: number;
    
    intersections: Intersection[]=[];
}