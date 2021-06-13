import Region from "./region";
import Line from "../Line";

class Arrow extends Region{


    constructor(cells, unique=false) {
        super(cells);
        this.unique=unique;
        console.log(this.cellIndexes);
        

    }
    arrowValidates(mutableBoardData, bulbCandidates, sum, remainingCells, digits){
        let maxN = Math.max( bulbCandidates.filter( n => n>0));
        let minN = Math.min( bulbCandidates.filter( n => n>0));
    
        if( remainingCells.length === 0){
            return bulbCandidates.includes(sum); 
        }

        /* shortcut but not needed with other logic */
        if( sum > (maxN - remainingCells.length)){
            return false;
        }
        let nextCell = mutableBoardData[remainingCells[0]];
        let otherCellIndexes = remainingCells.slice(1);
        let candidates = nextCell.candidates.filter( c => (c>0) );
        
        return candidates.some( candidate => {
            if( this.unique){
                if( digits.includes(candidate)){
                    return false;
                }
            }
            
            if( this.arrowValidates(mutableBoardData, bulbCandidates, sum+candidate, otherCellIndexes, [...digits, candidate]) ){
                return true;
            }
            return false;
        })
        
    }

    component(){
        return <Line type="line" circle={this.cellIndexes[0]} cells={[...this.cellIndexes]} />;
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
        
            
        
            let arrowCells = this.cellIndexes.length -1; // if we do arrows with 2 digits, this can change.
            // base off the arrow sum.
            let circleCandidates = mutableBoardData[array[0]].candidates.filter( n => n>0);
            let otherCellIndexes = this.cellIndexes.filter( (i,o)=> ( o !==0 && i!== cellIdx));
            //if a candidate is too big, or too small to work, remove it
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {

                if( candidate > 0 ){

                    if( index === 0){
                        let min = {"val":otherCellIndexes.reduce( (a,i) => a + Math.min(...mutableBoardData[i].candidates.filter(c => c>0)), 0  ) };
                        if( this.unique){
                            min = otherCellIndexes.reduce( (a,i) => {
                                let minC = Math.min(...mutableBoardData[i].candidates.filter(c => (c>0 && !a.digits.includes(c))))
                                return {"val":a.val+minC, "digits":[...a.digits, minC]}
                            }, {"val":0, "digits":[]}  );
                            console.log(min);
                        }
                        if( candidate < min.val ){
                            console.log("Removing value from square", cIndex, cellIdx);
                            replacementCandidates[cIndex] = 0;
                            mutations = mutations+1;
                        }
                    }else{
                        if( !this.arrowValidates(mutableBoardData, circleCandidates, candidate, otherCellIndexes, [candidate]) ){
                            console.log("Removing value from square", cIndex, cellIdx);
                            replacementCandidates[cIndex] = 0;
                            mutations = mutations+1;
                        }
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
export default Arrow;