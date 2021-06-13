import Region from "./region";
import Line from "../Line";

class Whisper extends Region{


    constructor(cells, difference=5) {
        super(cells);
        console.log(this.cellIndexes);

        this.difference = difference;
    }

    component(){
        return <Line type="line" cells={[...this.cellIndexes]} />;
    }
  
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){

        let mutations = 0;
         this.cellIndexes.forEach( (cellIdx, index, array) => {
             let immutableSquare = mutableBoardData[cellIdx];
             let replacementCandidates = [...immutableSquare.candidates];
             
//             let known = immutableSquare.given || immutableSquare.answer;
         
             
                         
             
             //if a candidate is too big, or too small to work, remove it
             
             replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                 if( candidate > 0 ){
                     // in a whisper candidate must be N greater or smaller than adjacent cell
                     let forbidden = false;

                     
                     if( index > 0 ){
                         let filteredPrev = new Set( [...mutableBoardData[array[index-1]].candidates.filter( n => n>0).filter( n => Math.abs(n - candidate) >= this.difference) ] );
                         if( filteredPrev.size === 0){
                             forbidden = true;
                         }
                         // must be bigger than cellIdx-1
                     }
                     if( index < array.length-1 ){
                         
                         let filteredNext = new Set([...mutableBoardData[array[index+1]].candidates.filter( n => n>0).filter( n => Math.abs(n - candidate) >= this.difference) ]);
                         if( filteredNext.size === 0){
                             forbidden = true;
                         }
                         // must be smaller than cellIdx+1
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
export default Whisper;