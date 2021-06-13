import Region from "./region";
import Line from "../Line";

class LittleKiller extends Region{

    constructor(cells, exact=true, value) {
        super(cells);
        console.log("new little")

        this.exact = exact;
        this.value = parseInt(value);
    }

    cageValidates(mutableBoardData, sum, cellIndexes){

        if( cellIndexes.length === 0 && sum === 0 ){
            return true;
        }
        if( sum < 1){
            return false;
        }
        if( cellIndexes.length === 1 ){
            
            return mutableBoardData[cellIndexes[0]].candidates.includes(sum);
        }

        return cellIndexes.some( index => {
            let otherCellIndexes = cellIndexes.filter( i=> i!== index);
            let candidates = mutableBoardData[index].candidates.filter( c => (c>0 && c < sum ) );
            
            return candidates.some( candidate => {
                if( this.cageValidates(mutableBoardData, sum-candidate, otherCellIndexes) ){
                    return true;
                }
                return false;
            })

        });
        
    }

    // probably change to line
    component(){
        return <Line cells={[...this.cellIndexes]} val={this.value}/>;
    }


    setFlags(newBoardData){
        if( this.exact ){
            this.cellIndexes.forEach( cellIdx => {
                let newSquareData = newBoardData[cellIdx].cloneSquare();
                newSquareData.cageValue=this.value;
                newBoardData[cellIdx]=newSquareData;
            });
            return 1;
        }

        return 0;
    }
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        //5..2...4....6.3....3...9..7..3..7.....7..8...6......2..8......3...4..6.....1..5..
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            
        
            // unlike cage, littleKiller can have repeats in other boxes.

            
            let otherCellIndexes = this.cellIndexes.filter( i=> i!== cellIdx);
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                    if( ! this.cageValidates(mutableBoardData, this.value-candidate, otherCellIndexes)){
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
export default LittleKiller;