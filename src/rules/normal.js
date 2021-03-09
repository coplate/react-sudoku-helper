
import Region from './region';

class Normal extends Region  {
    sameBox(a,b){
        return (Math.floor((a%9)/3) + 10*Math.floor(a/27)) ===(Math.floor((b%9)/3) + 10*Math.floor(b/27));
    }
    sameRow(a,b){
        return Math.floor(a/9) === Math.floor(b/9);
    }
    sameColumn(a,b){
        return (a%9) ===(b%9);
    }
    constructor(cells) {
        super(cells);
        //this.cellIndexes=cells.map(c => c.idx);
    }
    removeOther (replacementCandidates, known)  {
        let otherMutations = 0;
        replacementCandidates.forEach( (c,i,a) =>{
            if( c > 0 && c !== known ){
                a[i]=0;
                otherMutations = otherMutations+1;
            }
        });
        return otherMutations;
    }  
    apply(mutableBoardData, cloneSquare){
            // a Standard Region is the whole Sudoku( Column, Row, Box ) where "Normal Sudoku Rules Apply"
        
      

        let mutations = 0;
        this.cellIndexes.forEach( (cellIdx, index, array) => {
  
            let immutableSquare = mutableBoardData[cellIdx];
            let replacementCandidates = [...immutableSquare.candidates];
            let known = immutableSquare.given || immutableSquare.answer;
            let x = cellIdx % 9;
            let y = Math.floor(cellIdx/9);
            let b = Math.floor(x/3) + 10*Math.floor(y/3) ;// 00,01,02; 10,11,10, 20,21,22
            
            // if this cell is solved, remove all other candidates
            if( known){
                if( replacementCandidates.filter(c => c>0 ).length >1){
                    replacementCandidates = replacementCandidates.map((c,i,a) =>  c===known?c:0 );
                    mutations = mutations+1;
                }
            }
            // if the region has a known candidate in another cell, remove that from this cell
            replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                if( candidate > 0 ){
                    let solvedIndexes = this.cellIndexes.filter( cIdx => (mutableBoardData[cIdx].given||mutableBoardData[cIdx].answer) === candidate  );
                    solvedIndexes.forEach( (solvedIndex) => {
                        if( this.sameBox(cellIdx,solvedIndex) || this.sameRow(cellIdx,solvedIndex) || this.sameColumn(cellIdx,solvedIndex)){
                            console.log("Removing value from square", cIndex, cellIdx);
                            replacementCandidates[cIndex] = 0;
                            mutations = mutations+1;
                        }
                    });
                    

                    
                }

            });


             // if the region contains only 1 of a given candidate, remove all other candidates form that cell
             replacementCandidates.forEach( (candidate, cIndex, cArray) => {
                
                if( candidate > 0 ){

                    let columnIndexes = this.cellIndexes.filter( cIdx => this.sameColumn(cellIdx, cIdx) );
                    let rowIndexes = this.cellIndexes.filter( cIdx => this.sameRow(cellIdx, cIdx) );
                    let boxIndexes = this.cellIndexes.filter( cIdx => this.sameBox(cellIdx, cIdx) );
                    
                    if( columnIndexes.filter(cIdx => (mutableBoardData[cIdx].candidates.includes(candidate)) ).length == 1 ){
                        mutations = mutations + this.removeOther(cArray, candidate );
                        
                    }
                    if( rowIndexes.filter(cIdx => (mutableBoardData[cIdx].candidates.includes(candidate)) ).length == 1){
                        mutations = mutations + this.removeOther(cArray, candidate);
                        
                    }
                    if( boxIndexes.filter(boxIndex => (mutableBoardData[boxIndex].candidates.includes(candidate)) ).length == 1){
                        mutations = mutations + this.removeOther(cArray, candidate);
                        
                    }
                   
                    
                }

            });
            
            if( mutations>0 ){
                let newSquareData = cloneSquare(immutableSquare);
                console.log("Removing value from square");
                newSquareData.candidates = replacementCandidates;
                
                mutableBoardData[cellIdx]=newSquareData;
            }
    
            // if there is a solved record in my column, remove me
        // if there is a solved record in my row, remove me
        // if there is a solved record in my box, remove me
        });
      
        return mutations;
        
    }
    // This will return error flags for each cell/index that has a conflict
    validate(boardData){

    }
    
    

}
export default Normal;