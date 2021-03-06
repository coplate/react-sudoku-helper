function Given(props){
    
    if( props.squareData.given ){
      // eslint-disable-next-line
      
      return (
        <div class={`given numeric cell-child`} >
          {props.squareData.given}
        </div>
    
      )
    
    }
    return null;
  }

  function Answer(props){
    
    if( props.answer ){
      return (
        <div class={`given numeric cell-child`} >
          {props.given}
        </div>
    
      )
    
    }
    return null;
  }

  function Notes(props){
    return (
      <div class="notes cell-child" >
        {
          [...Array(9).keys()].map( note => {
            return <div key={`note-${note}`} class={`note note-${note} numeric`} >{note+1}</div>
          })
        }
      </div>
  
    )  
    
  }
  
  function Snyder(props){
    return (
      <div class="snyder cell-child" >
        {
          props.squareData.candidates.map( (value, corner) => {
            return <div key={`corner-${corner}`} class={`corner corner-${corner} numeric`} onClick={props.snyderClickHandler(props, corner)}>{value}</div>
          })
        }
      </div>
  
    )  
    
  }
  function Candidates(props){
    return (
      <div class="candidates cell-child" onClick={props.onClick("Candidates")}>
        {
          
          [...Array(9).keys()].map( candidate => {
            return <div key={`candidate-${candidate}`} class={`candidate candidate-${candidate} numeric`}  >{candidate+1}</div>
          })
        }
      </div>
  
    )  
    
  }
  function Interactor(props){
    return null;
    
  }
  
  function Square(props){
    let selected=(props.squareData.selected)?"selected":"";
    return (
      <div id={`cell-${props.idx}`} class = {`cell cell-${props.idx} row-${props.row} column-${props.column} ${selected}`} onClick={props.onClick(props)} onMouseMove={props.squareDragHandler(props)}  onMouseDown={props.onMouseDown(props)}  >
        <Candidates {...props} />
        <Snyder {...props} />
        {
        //<Notes {...props} />
        }
        <Interactor {...props} />
        <Answer {...props} />
        <Given {...props} />
      </div>
    );
  
  }
  
  function Board(props){
    return (
      <div className="Board">
        {
          [...Array(9).keys()].map( row => {
            return [...Array(9).keys()].map( column => {
              let idx = column + (9* row);
              return <Square {...props} row = {row} column={column} idx={idx} squareData={props.boardData[idx]}/>
            })
          })
        }
      </div>
    );
  }

  export default Board;