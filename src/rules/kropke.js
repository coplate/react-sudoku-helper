import Region from "./region";
import KropkeComponent from "../Kropke";

class Kropke extends Region{

    constructor(cells, value) {
        super(cells);

        this.value = parseInt(value);
    }

    kropkeValidates(mutableBoardData, cellIndexes, candidateArrayIndex, candidate){

        if( cellIndexes.length === 0){
            return true;
        }
        console.log(`Checking if Candidate ${candidate} is valid in square ${candidateArrayIndex}`);
        let validCandidates = [];
        if( this.value === 1 ){
            validCandidates.push(candidate+1);
            validCandidates.push(candidate-1);
        }else{
            validCandidates.push(candidate*2);
            validCandidates.push(candidate/2);

        }
        console.log(`Valid Candidates are ${validCandidates} and cellIndexes.length is ${cellIndexes.length}`);
    
        // if( cellIndexes.length === 1 ){
        //         let valid =  mutableBoardData[cellIndexes[0]].candidates.filter( c => (c!==0 && validCandidates.includes(c))).length > 0;
        //         console.log(valid);
        //         return valid;
        // }
        
        let adjacentArrayIndexes = this.cellIndexes
                                        .map( (ci, i ) => i)
                                        .filter( i=> (i === candidateArrayIndex-1 || i === candidateArrayIndex+1))
                                        .filter( i=> ( cellIndexes.includes(this.cellIndexes[i]) ));
        
        console.log(`Checking if Candidate ${candidate} is valid in square ${candidateArrayIndex}[${this.cellIndexes[candidateArrayIndex]}] - now checking Adjacent cells ${adjacentArrayIndexes}`);
        
        let valid = adjacentArrayIndexes.every( adjacentArrayIndex => {
            console.log("Checking adjacentArrayIndex:", adjacentArrayIndex);
            console.log("Checking this.cellIndexes:", this.cellIndexes);
            let index = this.cellIndexes[adjacentArrayIndex];
            console.log("Checking index:", index);
            let otherCellIndexes = cellIndexes.filter( i=> i!== index);
            console.log("Checking otherCellIndexes:", otherCellIndexes);
            let candidates = mutableBoardData[index].candidates.filter( c => validCandidates.includes(c) );
            return candidates.some( c => {
                if( this.kropkeValidates(mutableBoardData, otherCellIndexes, adjacentArrayIndex, c) ){
                    return true;
                }
                return false;
            })
            // validates
        });
        console.log(valid);
        return valid;
        
    }

    component(){
        return <KropkeComponent cells={[...this.cellIndexes]} valueType={this.value} />;
    }

    setFlags(newBoardData){
        // black/white
        return 0;
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
            
           // kropke - adjacent cell must be either +-1 (white), or */2(black)
           // Not just adjacent though, adjecent and seperated by kropke
           // kropke set can be created as a string of pairs, to mark the connections, but for now assume single file.


            let otherCellIndexes = this.cellIndexes.filter( i=> i!== cellIdx);
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){

                    if( ! this.kropkeValidates(mutableBoardData, otherCellIndexes, index, candidate) ){
                        
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
export default Kropke;