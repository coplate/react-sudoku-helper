import Region from "./region";
import RenbanComponent from "../Renban";

class Renban extends Region{


    constructor(cells, exact=true, value=12) {
        super(cells);
        //console.log(this.cellIndexes);

        this.exact = exact;
        this.value = parseInt(value);
    }


    renbanValidates(mutableBoardData, digits, cellIndexes){

        if( digits.length === 0 ){
            return true;
        }

        let digit = digits[0];
        let otherDigits = digits.slice(1);

        //console.log("Checking for digits in cells", digits, cellIndexes);
        let startingCellIndexes = cellIndexes.filter( i => mutableBoardData[i].candidates.includes(digit));

        if( startingCellIndexes.length === 0){
            //console.log(`No cells fulfil the requirement that digit ${digit} exists`);
            return false;
        }

        return startingCellIndexes.some( (index) => this.renbanValidates(mutableBoardData, otherDigits, cellIndexes.filter( i => i!==index )) );;
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
                    
                    let allowed=false;
                    let renLength = this.cellIndexes.length;
                    for( var start = candidate; start > 0 && start > candidate-renLength; start-- ){
                        let digits=[];
                        for( var i = 0; i < renLength; i++){
                            digits.push(start+i);
                        }
                        //console.log("Checking: ", digits, this.cellIndexes);

                        allowed = this.renbanValidates(mutableBoardData, digits.filter( c => c!== candidate), this.cellIndexes.filter( i => i!== cellIdx))
                        if( allowed){ break;}
                    }

                   

                    if( !allowed ){
                        //console.log("Removing value from square", cIndex, cellIdx);
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