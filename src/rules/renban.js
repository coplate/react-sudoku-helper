import Region from "./region";
import RenbanComponent from "../Renban";

class Renban extends Region{


    constructor(cells, exact=true, value=12) {
        super(cells);
        console.log(this.cellIndexes);

        this.exact = exact;
        this.value = parseInt(value);
    }

    component(){
        return <RenbanComponent cells={[...this.cellIndexes]} />;
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
            
//            let known = immutableSquare.given || immutableSquare.answer;
        
            
                        
            
            //if a candidate is too big, or too small to work, remove it
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                     // a renban line is "consecutive non-repeating digits, in any order".
                    // so, 1,2,3,4,5 could be 1,4,5,2,3, etc.

                    // Two examples:
                    // in a 3 digit renban, when none of the digits can be 2 or 7.
                    // Can I be a 1, no, can I be an 8 or 9, no.
                    // in a 
                    
                    //
                    /*np
                        if N > i
                        For a 1 to work, you must be able to do 1,2..N from the avaiable squares
                        For a 2 to work, you nust me able to do 2..N-1 from the available squares
                        if i > N
                        For a 8 to work, you must be able to do (9-N)..8 from the available squares
                        For a 9 to work, you must be able to do (10-N)..9 from the available squares
                    */

                  
                    
                    // for 8 to be valid, on a 3 digit renban, I must be able to make:
                    // 6,7,8 - 7,8,9 - or 8,9,10
                    // 8,9,10 is nto valid for obvious reasons.
                    // And the 6 and 7 must be from differnt squares.


                    if( false ){
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
export default Renban;