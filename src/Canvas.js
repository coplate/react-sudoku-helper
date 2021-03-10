  // probably make this part of board, since they scale to 0 if I dont populate them
  function Canvas(props){
    return (
      <div className="canvas-holder">
          {
            [...Array(1).fill(0)].map( cell => <div className="abc" style={{"grid-row": "1/1", "gridColumn": `1/1`}}>{cell}</div>)
          }{
            [...Array(9).fill(0).keys()].map( cell => <div className="abc"  style={{"grid-row": `1/1`, "gridColumn": `${cell+2}/${cell+2}`}} >{cell}</div> )
          }{
            [...Array(9).fill(0).keys()].map( cell => <div className="abc"  style={{"grid-row": `${cell+2}/${cell+2}`, "gridColumn": `1/1`}} >{cell}</div>)
          }
        {props.children}
      </div>
    );
  }

  export default Canvas;