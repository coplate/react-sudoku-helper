import Region from "./region";
import ThemoComponent from "../Thermometer";

class Thermometer extends Region{


    constructor(cells, exact=true, value=12) {
        super(cells);
        console.log(this.cellIndexes);

        this.exact = exact;
        this.value = parseInt(value);
    }

    component(){
        return <ThemoComponent cells={[...this.cellIndexes]} />;
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
            
            let known = immutableSquare.given || immutableSquare.answer;
        
            
                        
            
            //if a candidate is too big, or too small to work, remove it
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                    // a thermometer, square N must be bigger than square n-1, and smaller than square N+1
                    let forbidden = false;
                    let minN = 0;
                    let maxN = 10;
                    if( index > 0 ){
                        minN = Math.min( ...mutableBoardData[array[index-1]].candidates.filter( n => n>0)) ;
                        // must be bigger than cellIdx-1
                    }
                    if( index < array.length-1 ){
                        maxN = Math.max( ...mutableBoardData[array[index+1]].candidates.filter( n => n>0));
                        // must be smaller than cellIdx+1
                    }
                    if( candidate >=maxN || candidate <= minN ){
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
export default Thermometer;