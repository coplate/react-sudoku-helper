
import Region from './region';

class Normal extends Region  {
    
    constructor(cells) {
        super(cells);
        //this.cellIndexes=cells.map(c => c.idx);
    }

    apply(mutableBoardData, cloneSquare){
        // a Standard Region is the whole Sudoku( Column, Row, Box ) where "Normal Sudoku Rules Apply"
    
        
        return 0;
        
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
            return false;
        });
        
        // if candidate is listed as Given or Answer for anything ELSE in the region, remove the candidate
    }
    

}
export default Normal;