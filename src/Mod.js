function Mod(props){
    const cells = props.cells;
   
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
