import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board'

function Controls(props) {
  return <div><button onClick={props.onUndoClick}>Undo</button><button onClick={props.onRedoClick}>Redo</button></div>
  
}

function App() {
  let def = Array(9*9).fill(0);
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([{givens:  def}]);
  const current = history[count];
        
  const undoHandler = (e) =>{ if( count ){ setCount(count-1)}};
  const redoHandler = (e) =>{ if( count+1 < history.length ){ setCount(count+1)}};

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        
        let newGivens = current.givens.slice(0,current.givens.length+1);
        newGivens[count]=count+1;
        setHistory( [...history.slice(0,count+1), {...current, givens: newGivens}]);
        setCount(count + 1);
        }}>
        Click me
      </button>
      <Controls onUndoClick={undoHandler} onRedoClick={redoHandler}/>
      <Board givens={current}/>
      
    </div>
  
  );
}

export default App;
