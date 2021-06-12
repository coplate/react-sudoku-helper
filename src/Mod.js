function Mod(props){
    const cells = props.cells;
    let path = [];
    cells.forEach((cell, i, a) => {
    
    
        let startColumn = a[i-1]%9;
        let startRow = (a[i-1]-startColumn)/9;
        let endColumn = a[i]%9;
        let endRow = (a[i]-endColumn)/9;

        let dx = (startColumn-endColumn);
        let dy = (startRow-endRow);
        let x = Math.min(startColumn,endColumn);
        let y = Math.min(startRow,endRow);
        let type="tube";
        if( dx === 1 ){
            type=type+" tube-right";
            
        }
        if( dy ===1 ){
            type=type+" tube-down";
        }
        if( dx === -1 ){
            type=type+" tube-left";
            
        }
        if( dy === -1 ){
            type=type+" tube-up";
        }
        //0,45,90,135,180, 225, 270, 315, 360
        path.push({"idx":cell, startColumn:x, startRow:y, dx:Math.abs(dx), dy:Math.abs(dy), type:type });
    
    });
    return <div className="mod">
        {
            cells.map( cell => <div className={`mod-${props.modVal}-${props.modResult} ${gridClasses(cell)}`} /> )
        }
    </div>
    
}
function gridClasses(idx){
    let column = idx%9;
    let row = (idx-column)/9;
    return `row-${row} column-${column}`;
}

export default Mod;
