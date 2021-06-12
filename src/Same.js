function Same(props){
    const cells = props.cells;
    return <div className="same">
        {
            cells.map( cell => <div className={`same-cell ${gridClasses(cell)}`} /> )
        }
    </div>
    
}
function gridClasses(idx){
    let column = idx%9;
    let row = (idx-column)/9;
    return `row-${row} column-${column}`;
}

export default Same;
