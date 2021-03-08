class Cage {

    constructor(cellIndexes) {
        this.cellIndexes=[...cellIndexes];
    }

    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        // in a classic cage, everythign is unique, and there is a sum;
        

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
            

            // if the region contains only 1 of a given candidate, remove all other candidates form that cell -- only for 9 square unique Regions - not cages per se

            // if the region has a known candidate in another cell, remove that from this cell - only for unique Regions

            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                
                if( candidate > 0 ){
                    let solvedIndex = this.cellIndexes.some( cIdx => (mutableBoardData[cIdx].given||mutableBoardData[cIdx].answer) === candidate  );
                    if( solvedIndex){
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
        
    }
     


}
export default Cage;