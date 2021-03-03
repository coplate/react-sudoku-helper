import logo from './logo.svg';
import './App.css';

function Given(props){
  if( props.column == 4){
    let selected=(props.row == props.column)?"selected":"";
    return (
      <div class={`given numeric cell-child ${selected}`}>
        Given
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
    <div class = {`cell row-${props.row} column-${props.column}`}>
      <Notes {...props} />
      <Candidates {...props} />
      <Snyder {...props} />
      <Data {...props} />
      <Interactor {...props} />
      <Given {...props} />
    </div>
  );

}
function App() {
  return (
    <div className="App">
      {
        [...Array(9).keys()].map( row => {
          return [...Array(9).keys()].map( column => {
            return <Square row = {row} column={column} />
          })
        })
      }
    </div>
  );
}

export default App;
