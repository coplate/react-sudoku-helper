function Given(props){
    
    if( props.given ){
      let selected=(props.row == props.column)?"selected":"";
      return (
        <div class={`given numeric cell-child ${selected}`}>
          {props.given}
        </div>
    
      )
    
    }
    return null;
  }
  function Notes(props){
    return (
      <div class="notes cell-child">
        {
          [...Array(9).keys()].map( note => {
            return <div class={`notes notes-${note} numeric`} >{note+1}</div>
          })
        }
      </div>
  
    )  
    
  }
  function Candidates(props){
    return (
      <div class="candidates cell-child">
        {
          [...Array(9).keys()].map( candidate => {
            return <div class={`candidate candidate-${candidate} numeric`} >{candidate+1}</div>
          })
        }
      </div>
  
    )  
    
  }
  function Snyder(props){
    return (
      <div class="snyder cell-child">
        {
          [...Array(9).keys()].map( corner => {
            return <div class={`corner corner-${corner} numeric`} >{corner+1}</div>
          })
        }
      </div>
  
    )  
    
  }
  function Data(props){
    return <div class="data cell-child" >
      Data
    </div>
  }
  function Interactor(props){
    return null;
    
  }
  
  function Square(props){
    
    return (
      <div id={`cell-${props.idx}`} class = {`cell cell-${props.idx} row-${props.row} column-${props.column}`}>
        <Notes {...props} />
        <Candidates {...props} />
        <Snyder {...props} />
        <Data {...props} />
        <Interactor {...props} />
        <Given {...props} />
      </div>
    );
  
  }
  
  function Board(props){
      let current = props.givens;
    
    return (
      <div className="Board">
        {
          [...Array(9).keys()].map( row => {
            return [...Array(9).keys()].map( column => {
              let idx = column + (9* row);
              let given = current.givens[idx];
              return <Square row = {row} column={column} given={given} id={idx}/>
            })
          })
        }
      </div>
    );
  }

  export default Board;