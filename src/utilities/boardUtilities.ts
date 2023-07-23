export function emptyBoard():string[][]{
    const result = new Array(19).fill('_').map(()=>new Array(19).fill('_'));
    return result;
}