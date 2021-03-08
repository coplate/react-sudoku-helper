
import Region from './region';

class Standard extends Region  {
    static inRectangle(y,x,height,width, cellData){
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
    
    static fromRectangle(y,x,height,width, boardData){
        
        let cells = boardData.filter( cellData =>{  
            
            return Standard.inRectangle(y,x,height,width, cellData);
        });
        return new Standard(cells);
    }
    
    constructor(cells) {
        super(cells);
        //this.cellIndexes=cells.map(c => c.idx);
    }

    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        // a Standard Region is Column, Row, Box or others where "Normal Sudoku Rules Apply"
        // Additionally, any other 9 cell region can be called standard if they
        // can and Must contain 1 and only 1 of each number 1-9
        
        // Or, should the "Standard" region contain all cells, and validate based on row, column and box in one function
        // I will try that, calling it "Normal"

        // this function will remove impossible candidates and return the new list
    

        let removeOther = (replacementCandidates, known) => {
            let otherMutations = 0;
            replacementCandidates.forEach( (c,i,a) =>{
                if( c > 0 && c !== known ){
                    a[i]=0;
                    otherMutations = otherMutations+1;
                }
            });
            return otherMutations;
        }

        //5..2...4....6.3....3...9..7..3..7.....7..8...6......2..8......3...4..6.....1..5..
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            let known = immutableSquare.given || immutableSquare.answer;
        
            // clear all other values if we know the answer
            if(  known ){
                mutations += removeOther(replacementCandidates, known);
                // remove all candidate except given
            }
            

            // if the region contains only 1 of a given candidate, remove all other candidates form that cell
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                    let regionSquares = this.cellIndexes.map( i=> mutableBoardData[i]);
                    let regionCandidates = regionSquares.map( s => s.candidates );
                    let matchingCandidateValues = regionCandidates.map( c => c[cIndex]).filter( c => c != 0);

                    if( matchingCandidateValues.length == 1 ){
                        mutations += removeOther(cArray, candidate);
                    }
                }

            });
            // if the region has a known candidate in another cell, remove that from this cell
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {

                if( candidate > 0 ){

                    if(this.solved(mutableBoardData, candidate, cellIdx)){
                        replacementCandidates[cIndex] = 0;
                        mutations = mutations+1;
                    }

                
                }

            });
            // if the region has a candidate that exists in the intersection of two regions, 
            // and the candidate only exists in that intersection on the Other rule, 
            //then this candidate must also exist within said intersection on this rule!
            if( mutations>0 ){
                let newSquareData = cloneSquare(immutableSquare);
                newSquareData.candidates = replacementCandidates;
                
                mutableBoardData[cellIdx]=newSquareData;
            }

            
            

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
            return false;
        });
        
        // if candidate is listed as Given or Answer for anything ELSE in the region, remove the candidate
    }
    

}
export default Standard;