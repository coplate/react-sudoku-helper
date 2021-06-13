import Region from "./region";
import Line from "../Line";

class Palindrome extends Region{


    // constructor(cells) {
    //     super(cells);
    // }

    component(){
        return <Line cells={[...this.cellIndexes]} />;
    }
  
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){

        let mutations = 0;
         this.cellIndexes.forEach( (cellIdx, index, array) => {
             let immutableSquare = mutableBoardData[cellIdx];
             let replacementCandidates = [...immutableSquare.candidates];
             
//             let known = immutableSquare.given || immutableSquare.answer;
         
             let opposingIndex = array.length - (index +1)
             let opposingSquare = mutableBoardData[array[opposingIndex]];
             let opposingCandidates = opposingSquare.candidates;    
             
             //if a candidate is too big, or too small to work, remove it
             
             replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                 if( candidate > 0 ){
                     
                     let forbidden = true;

                     if( opposingCandidates.includes(candidate)){
                         forbidden=false;
                     }
                     if( forbidden ){
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
export default Palindrome;