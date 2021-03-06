import Region from './region';

//This is an example of a region that does not support intersection, because this is the whole thing
// it cannot act as ruleB, but it can act as ruleA.
// 
class Pawn extends Region{

    constructor(cells, matchDistance=0) {
        super(cells);
        this.matchDistance = parseInt(matchDistance);
    }

    apply(mutableBoardData, cloneSquare){

        //5..2...4....6.3....3...9..7..3..7.....7..8...6......2..8......3...4..6.....1..5..
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            
            if( immutableSquare.given || immutableSquare.answer ){
                return;  
            };
            
        
            let y = Math.floor(cellIdx/9);
            let x = cellIdx % 9;
    
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                
                if( candidate > 0 ){
                    let solvedIndex = this.cellIndexes.some( cIdx => {
                        let comparedKnown = mutableBoardData[cIdx].given || mutableBoardData[cIdx].answer;
                        if( comparedKnown !== 0){
                            if( Math.abs( comparedKnown - candidate) === this.matchDistance ){
                                // 0 up, 1 over, or 1 up, zero over, nope, thats the pan restriction
                                if(  Math.abs( Math.floor(cIdx/9)-y) + Math.abs((cIdx % 9)-x) === 1){
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                    if( solvedIndex){
                        console.log("Removing value from square", cIndex, cellIdx);
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
                console.log("Removing value from square");
                newSquareData.candidates = replacementCandidates;
                
                mutableBoardData[cellIdx]=newSquareData;
            }

            
            

        });
        return mutations;
        
    }
     


}
export default Pawn;