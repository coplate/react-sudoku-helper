import React, { useState } from 'react';
import './App.css';
import Board from './Board'

function Controls(props) {
  return <div><button onClick={props.onUndoClick}>Undo</button><button onClick={props.onRedoClick}>Redo</button></div>
  
}

function App() {
  
  let candidates = [...Array(9*9).fill()];
  let squareData = {given: 0, candidates: [...Array(9).keys()].map(k=>k+1)};
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([  {"boardData": [...Array(9*9).fill({...squareData})] } ] );
  const current = history[count];
        
  const undoHandler = (e) =>{ if( count ){ setCount(count-1)}};
  const redoHandler = (e) =>{ if( count+1 < history.length ){ setCount(count+1)}};
  const candidateClickHandler = (props, candidate) => (event) => console.log(candidate, event, props);
  
  const updateHistory = (idx, newSquareData) => {

    let newBoardData = [...current.boardData];
    newBoardData[idx]=newSquareData;

    setHistory( [...history.slice(0,count+1), {"boardData":newBoardData}]);
    setCount(count + 1);
  }

  const snyderClickHandler = (props, candidate) => (event) => {
    let squareData = current.boardData[props.idx];

    let newSquareData = {
      given: squareData.given, 
      candidates: [...squareData.candidates]
    };
    
    
    newSquareData.candidates[candidate] = 0;

    
    updateHistory(props.idx, newSquareData);

  };
  
  const clickHandler = (name) => (e) => console.log(name, "clicked");

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        
        let squareData = current.boardData[count];

        let newSquareData = {
          given: squareData.given, 
          candidates: [...squareData.candidates]
        };
        newSquareData.given = count+1;
        updateHistory(count, newSquareData);

        }}>
        Click me
      </button>
      <Controls onUndoClick={undoHandler} onRedoClick={redoHandler}/>
      <Board boardData={current.boardData} onClick={clickHandler} snyderClickHandler={snyderClickHandler} />
      
    </div>
  
  );
}

export default App;
