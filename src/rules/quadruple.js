import Region from "./region";

class Quadruple extends Region{


    constructor(cells, values=[]) {
        super(cells);
        console.log(this.cellIndexes);

        this.values = [...values.split('')].map(a => parseInt(a));
        console.log(this.values);

    }

    component(){
        return <div className="quad">
            <div className={"quadcell "+gridClasses(Math.min( ...this.cellIndexes ))} >
                {this.values.join("")}
            </div>
        </div>
    }
    removeOther (replacementCandidates, allowed)  {
        let otherMutations = 0;
        replacementCandidates.forEach( (c,i,a) =>{
            if( ! allowed.includes(c) ){
                if( a[i] !== 0){
                    a[i]=0;
                    otherMutations = otherMutations+1;
                }
            }
        });
        return otherMutations;
    }  
  
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        // every entry in the valus must be in one of the cells, any order

        // so for a given candidate, if setting this candidate would make the rule impossible, then we must disable it

        // there can be 1,2,3,4 elements

        

        
       let unknownCandidates = new Set( [...this.values] );
       let unsolvedCells = new Set( [ ...this.cellIndexes]);
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let immutableSquare = mutableBoardData[cellIdx];
            
            let known = immutableSquare.given || immutableSquare.answer;
            unknownCandidates.delete(known);
            if( known ){
                unsolvedCells.delete(cellIdx);
            }
        });


        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
            let localMutations=0;
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            
            let known = immutableSquare.given || immutableSquare.answer;
            


             // if the region contains only 1 of a given candidate, remove all other candidates form that cell
             replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                    if( this.values.includes(candidate) ){
                        let regionSquares = this.cellIndexes.map( i=> mutableBoardData[i]);
                        let regionCandidates = regionSquares.map( s => s.candidates );
                        let matchingCandidateValues = regionCandidates.map( c => c[cIndex]).filter( c => c !== 0);

                        if( matchingCandidateValues.length === 1 ){
                            localMutations += this.removeOther(replacementCandidates, [candidate]);
                            console.log(localMutations);
                        }
                    }
                }

            });
                
            if( !known ){
                // If there are N options, and N squares, remove all other options
                replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                    if( candidate > 0 ){
                        // lets say I have 4 squares, and values 1,2,3,4
                        if( ! this.values.includes(candidate) ){
                            
                            if(  unsolvedCells.size === unknownCandidates.size ){
                                replacementCandidates[cIndex] = 0;
                                localMutations +=1;
                                console.log("Removing value from square");
                                console.log("Because", candidate, unsolvedCells, unknownCandidates);
                                

                            }
                        }
                    }
                });
                
         }

            // if the region has a candidate that exists in the intersection of two regions, 
            // and the candidate only exists in that intersection on the Other rule, 
            //then this candidate must also exist within said intersection on this rule!


            if( localMutations>0 ){
                let newSquareData = cloneSquare(immutableSquare);
                newSquareData.candidates = replacementCandidates;
                
                mutableBoardData[cellIdx]=newSquareData;
                mutations += localMutations;
            }

            
        });
         return mutations;
        
    }
     


}
function gridClasses(idx){
    let column = idx%9;
    let row = (idx-column)/9;
    return `row-${row} column-${column}`;
}
export default Quadruple;