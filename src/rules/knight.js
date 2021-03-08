class Knight {

    constructor(cellIndexes, matchDistance=0) {
        this.cellIndexes=[...cellIndexes];
        this.matchDistance = matchDistance;
    }

    apply(mutableBoardData, cloneSquare){

        //5..2...4....6.3....3...9..7..3..7.....7..8...6......2..8......3...4..6.....1..5..
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            
            let known = immutableSquare.given || immutableSquare.answer;
        
            
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                
                if( candidate > 0 ){

                    //knightIndexes.for
                    // filter for givens a knights move away
                    let y = Math.floor(cellIdx/9);
                    let x = cellIdx % 9;
                    let solvedIndex = this.cellIndexes.some( cIdx => {
                        let comparedKnown = mutableBoardData[cIdx].given || mutableBoardData[cIdx].answer;
                        if( comparedKnown !== 0){
                            if( Math.abs( comparedKnown - candidate) == this.matchDistance ){
                                let row = Math.floor(cIdx/9);
                                let col = cIdx % 9;

                                if( Math.abs(row-y) ==2 && Math.abs(col-x) == 1){
                                    return true;
                                }
                                if( Math.abs(row-y) ==1 && Math.abs(col-x) ==2 ){
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
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
export default Knight;