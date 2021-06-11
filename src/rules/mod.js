import Region from "./region";
import ModComponent from "../Mod";

class Mod extends Region{

    constructor(cells, modVal, result) {
        super(cells);

        this.value = parseInt(modVal);
        this.result = parseInt(result);
    }

    
    component(){
        return <ModComponent cells={[...this.cellIndexes]} modVal={this.value} modResult={this.result}/>;
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
                if( candidate > 0 ){
                    if( candidate%this.value !== this.result ){
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
export default Mod;