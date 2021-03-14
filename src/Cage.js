function Cage(props){
    const cells = props.cells;
    const bulb = cells[0];
    let border = [];
    cells.forEach((cell, i, a) => {
        

        let column = cell%9;
        let row = (cell-column)/9;

        let types=[];
        if(! cells.includes(9*(row)+(column+1)) ){
                types.push("cage-right");
        }
        if(! cells.includes(9*(row+1)+(column)) ){
                types.push("cage-down");
        }
        if(! cells.includes(9*(row)+(column-1)) ){
                types.push("cage-left");
        }
        if(! cells.includes(9*(row-1)+(column)) ){
                types.push("cage-up");
        }
       
        if( types ){
            border.push({"idx":cell, type:types.join(" "), x:row, y:column });
        }
        //0,45,90,135,180, 225, 270, 315, 360
        
    });
    return <div className="cage">
        {
        border.map( p => <div key={p.idx} className={`cage-cell ${p.type} ${gridClasses(p.idx)}`}  > 
      </div> 
        )}
    </div>
    
}
function gridClasses(idx){
    let column = idx%9;
    let row = (idx-column)/9;
    return `row-${row} column-${column}`;
}

export default Cage;
