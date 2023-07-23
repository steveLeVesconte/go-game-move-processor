export class Intersection{
    constructor(row:number,col:number, stoneColor:string){
        this.row=row;
        this.col=col;
        this.strinColor=stoneColor;
    }
    strinColor;
    readonly row:number;
    readonly col:number;
    group: number|null=null;
    liberties: number|null=null;

    westIntersection(){
        if(this.col>=0) return null;
        


    }
}