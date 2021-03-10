import Region from "./region";

class Cage extends Region{

    constructor(cells, exact=true, value) {
        super(cells);

        this.exact = exact;
        this.value = parseInt(value);
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
        // in a classic cage, everythign is unique, and there is a sum;
        



        //5..2...4....6.3....3...9..7..3..7.....7..8...6......2..8......3...4..6.....1..5..
        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            
            let known = immutableSquare.given || immutableSquare.answer;
        
            // clear all other values if we know the answer
            if(  known ){
                //mutations += removeOther(replacementCandidates, known);
                // handled by Normal
                // remove all candidate except given
            }
            

            // if the region contains only 1 of a given candidate, remove all other candidates form that cell -- only for 9 square unique Regions - not cages per se

            // if the region has a known candidate in another cell, remove that from this cell - only for unique Regions
            if( this.exact ){
                replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                    
                    if( candidate > 0 ){
                        let solvedIndex = this.cellIndexes.filter( (i) => i!==cellIdx).some( cIdx => (mutableBoardData[cIdx].given||mutableBoardData[cIdx].answer) === candidate  );
                        if( solvedIndex){
                            console.log("Removing value from square", cIndex, cellIdx);
                            replacementCandidates[cIndex] = 0;
                            mutations = mutations+1;
                        }
                    }
                });

                
            }     

                        
                        
              //also for exeact matches is: if a candidate is too big, or too small to work, remove it
              if( this.exact ){
                replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                    if( candidate > 0 ){
                        
                        // if the cage is [  1,5 ; 1,2 ; 1,9; 1/6 ] we need to maksu sure that the 2nd value is considered
                        // alternatively, join all candidates
                        
                        
                        let allCandidates = this.cellIndexes.reduce( (a,i) =>{ 
                            if( cellIdx === i){
                                return [...a];
                            }
                            if( mutableBoardData[i].given||mutableBoardData[i].answer){
                                return [...a];
                            }
                            return [...a, ...mutableBoardData[i].candidates];
                        }, [] );
                        let knownCandidates = this.cellIndexes.reduce( (a,i) =>{ 
                            let k =  mutableBoardData[i].given||mutableBoardData[i].answer;
                            
                            if( k ){
                                return [...a,k];
                            }
                            return a;
                        }, [candidate] ); // treat candidate as known for this reduce, so I dont need another if( i==cellIdx)
                        let knownSum = knownCandidates.reduce((a, b) => a + b, 0);


                        allCandidates = new Set( allCandidates );
                        allCandidates.delete(0);
                        allCandidates.delete(candidate);
                        allCandidates = Array.from(allCandidates).sort();

                        let n = this.cellIndexes.length-knownCandidates.length;
                        let minN = allCandidates.slice(0,n);
                        let maxN = allCandidates.slice(allCandidates.length-n);
                        let minSum =  knownSum + minN.reduce((a, b) => a + b, 0);
                        let maxSum =  knownSum + maxN.reduce((a, b) => a + b, 0)

                        if( minSum > this.value || this.value > maxSum ){
                            console.log("Removing value from square", cIndex, cellIdx);
                            replacementCandidates[cIndex] = 0;
                            mutations = mutations+1;
                        }
                        

                    }
                });

                
                
            }

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
export default Cage;