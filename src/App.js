import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      {
        [...Array(9).keys()].map( row => {
          return [...Array(9).keys()].map( column => {
            let selected=(row == column)?"selected":"";
            return <div class = {`cell row-${row} column-${column}`}>
              
              <div class={`given numeric cell-child ${selected}`}>
                {row} {column} 
              </div>
              <div class="corner cell-child">
                {
                  [...Array(9).keys()].map( corner => {
                    return <div class={`corner-${corner} numeric`} >{corner+1}</div>
                  })
                }
              </div>
              <div class="interactor  cell-child" />
            </div>
          })
        })
      }
    </div>
  );
}

export default App;
