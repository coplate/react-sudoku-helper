

class Region {
    
    constructor(cells) {
        this.cellIndexes=cells.map(c => c.idx);
    }

    supportsIntersectionSource(){
        return false;
    }
    applyIntersection(ruleB,newBoardData, cloneSquare){
        return 0;
    }
    // cloneSquare function allows us to create new square object to prevent mutating the old version
    // pass a mutate function istead that will coder the clone and board updatge in the parent?
    apply(mutableBoardData, cloneSquare){
        

      return 0;
        
    }
    

}
export default Region;