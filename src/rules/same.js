import Region from "./region";
import SameComponent from "../Same";

class Same extends Region{

    constructor(cells, exact=true, value) {
        super(cells);
    }

    same(mutableBoardData, candidate, cellIndexes){
        
        return cellIndexes.every( index => {
            let candidates = mutableBoardData[index].candidates;
            return candidates.includes( candidate );

        });
        
    }

    component(){
        return <SameComponent cells={[...this.cellIndexes]} />;
    }

   
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        // in a classic cage, everythign is unique, and there is a sum;
        



        //5..2...4....6.3....3...9..7..3..7.....7..8...6......2..8......3...4..6.....1..5..
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            
            let otherCellIndexes = this.cellIndexes.filter( i=> i!== cellIdx);
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                //console.log(`Processing same for candidate ${candidate} in cell ${cellIdx}`)
                if( candidate > 0 ){
                    if( ! this.same(mutableBoardData, candidate, otherCellIndexes)){
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
export default Same;