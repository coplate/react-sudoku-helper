function Given(props){
    
    if( props.squareData.given ){
      // eslint-disable-next-line
      
      return (
        <div className={`given numeric cell-child`} >
          {props.squareData.given}
        </div>
    
      )
    
    }
    return null;
  }

  function Answer(props){
    
    if( props.squareData.answer ){
      return (
        <div className={`answer numeric cell-child`} >
          {props.squareData.answer}
        </div>
    
      )
    
    }
    return null;
  }

  function Notes(props){
    return (
      <div className="notes cell-child" >
        {
          [...Array(9).keys()].map( note => {
            return <div key={`note-${note}`} className={`note note-${note} numeric`} >{note+1}</div>
          })
        }
      </div>
  
    )  
    
  }
  
  function Snyder(props){
    let candidates = props.squareData.candidates;
    let remaining_candidates = candidates.filter( (c) => c>0 );
    let candidate_count = remaining_candidates.length; // used to tell if this is the last candidate in a region
    // something else tells us if this is the only one of it's kind in a regions.
    // or should the rule, when detecting 1, remove the others?
    


    return (
      <div className="snyder cell-child" >
        {
          props.squareData.candidates.map( (value, corner) => {
            let style = 'hide';
            if(value>0){
                style = 'show'
                if( candidate_count === 1 ){
                    style='highlight'
                }
            }
            

            return <div key={`corner-${corner}`} className={`corner corner-${corner} corner-style-${style} numeric`} onClick={props.snyderClickHandler(props, corner)}>{value}</div>
          })
        }
      </div>
  
    )  
    
  }
  function Candidates(props){
    return (
      <div className="candidates cell-child" onClick={props.onClick("Candidates")}>
        {
          
          props.squareData.candidates.map( (candidate, index) => {
            
            if( candidate === 0){
                return <div key={`candidate-${index}`} className={`candidate candidate-${index} numeric`}  ></div>;
            }else{
                return <div key={`candidate-${index}`} className={`candidate candidate-${index} numeric`}  ></div>;
            }
            return <div key={`candidate-${index}`} className={`candidate candidate-${index} numeric`}  >{candidate}</div>
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
      <div id={`cell-${props.idx}`} className = {`cell cell-${props.idx} row-${props.row} column-${props.column} ${selected}`} onClick={props.onClick(props)} onMouseMove={props.squareDragHandler(props)}  onMouseDown={props.onMouseDown(props)}  >
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
              return <Square key={idx} {...props} row = {row} column={column} idx={idx} squareData={props.boardData[idx]}/>
            })
          })
        }
      </div>
    );
  }

  export default Board;