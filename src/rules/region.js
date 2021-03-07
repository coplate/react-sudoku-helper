
function inRectangle(y,x,height,width, cellData){
    let index = cellData.idx;
    let row = Math.floor( index / 9);
    let column = index % 9;
    if( row >= y && row < y+height ){
        if( column >= x && column < x+width ){
            return true;
        }
    }
    
    return false;
    
}

class Region {
    static fromRectangle(y,x,height,width, boardData){
        
        let cells = boardData.filter( cellData =>{  
            
            return inRectangle(y,x,height,width, cellData);
        });
        return new Region(cells);
    }
    
    constructor(cells) {
        this.cellIndexes=cells.map(c => c.idx);
    }

    /* this function must not  mutate boardData, instead return the cell that needs to be changed */
    // returns [.. {idx, candidates} ..]
    correctCandidates(boardData){
        // this function will remove impossible candidates and return the new list

        let resultList = this.cellIndexes.map(i => ({
            "idx":i,
            "candidates":[...boardData[i].candidates]
        }) );

        this.cellIndexes.forEach( (cellIdx, index, array) => {
            resultList[index].candidates = resultList[index].candidates.map( c => (
                this.solved(boardData, c, cellIdx))?0:c 
            );

        });

        return resultList;
        // somethign else runs after this, and puts error CSS on each thing

    }
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        // this function will remove impossible candidates and return the new list
    
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            

            immutableSquare.candidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                    if(this.solved(mutableBoardData, candidate, cellIdx)){
                        let newSquareData = cloneSquare(immutableSquare);
                        newSquareData.candidates[cIndex]=0;
                        mutations = mutations+1;
                        mutableBoardData[cellIdx]=newSquareData;
                    }
                }
            });

        });
        return mutations;
        
        // somethign else runs after this, and puts error CSS on each thing




        /*
        validatedResults.forEach((result, resultIndex, resultArray) => {

        let newSquareData = newBoardData[result.idx];
        if(! selectedCellIndexes.includes(result.idx)){
          // Not Already cloned from the value update
          newSquareData = cloneSquareData(result.idx, );
        }
        newSquareData.candidates = [...result.candidates];
        newBoardData[result.idx] = newSquareData;
      });
      */
    }
    // This will return error flags for each cell/index that has a conflict
    validate(boardData){

    }
    solved( boardData, candidate, cellIdx ){
        return this.cellIndexes.some( (cellIndex, index, array) => {
            if( cellIdx !== cellIndex){
                if( boardData[cellIndex].given === candidate){
                    return true;
                }
                if( boardData[cellIndex].answer === candidate){
                    return true;
                }
            }
        });
        
        // if candidate is listed as Given or Answer for anything ELSE in the region, remove the candidate
    }
    

}
export default Region;