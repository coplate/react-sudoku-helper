import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './Board'

function Controls(props) {
  return <div><button onClick={props.onUndoClick}>Undo</button><button onClick={props.onRedoClick}>Redo</button></div>
  
}
function startingBoardData(){
  
  let boardData = [...Array(9*9).fill(null)];
  [...Array(9*9).fill(null)].forEach( (value, index, array) => {
    let candidates = [...Array(9).keys()].map(k=>k+1);
    boardData[index] = {given: 0, candidates: candidates, selected: false};
  } );
  return boardData;
}
function App() {
  
  let startingState = {
    "boardData": startingBoardData(),
    lastAction: ""
  };
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([  startingState ] );
  const current = history[count];

  const setValue = () => {

  }
 
  const undoHandler = (e) =>{ if( count ){ setCount(count-1)}};
  const redoHandler = (e) =>{ if( count+1 < history.length ){ setCount(count+1)}};
  
  const keyPressHandler = (event) =>{
    let number = parseInt(event.key);
    if( !isNaN(number) ){
      event.preventDefault();
      console.log(event);
      updateSelections(number);
      // type into highlighted squares
    }

  }
  let captureKeys = () => {
    document.addEventListener("keydown", keyPressHandler);
    return () => {
      document.removeEventListener("keydown", keyPressHandler);

    }
  }

  useEffect(captureKeys);
        
  const snyderClickHandler = (props, candidate) => (event) => {
    // let newSquareData = cloneSquareData(props.idx, "");

    // newSquareData.candidates[candidate] = 0;

    // updateHistory(props.idx, newSquareData,"");

  };
  const select = (props, selectionType, clearFlag) => {
    /* Clear all selections and set current square to selected */
    console.log("select");

    let action = `selection-${selectionType}-idx-${props.idx}`;
    if( current.lastAction == action){
      return;
    }


    updateSelectionHistory(props.idx, action, clearFlag);// Do something so that we update the current record, instead of pushing

  }
  const squareMouseDownHandler  = (props) => (event) => {
    /* Clear all selections and set current square to selected */
    console.log("squareMouseDownHandler");

    event.preventDefault();
    select(props, "squareMouseDownHandler", true);
    

  };
  const squareClickHandler = (props) => (event) => {
    // console.log("squareClickHandler");

  };
  const squareDragHandler = (props) => (event) => {
    /* Update existing state  from mouseDown and add new square selected */
    event.preventDefault();
    
    if(! event.buttons ){
      return;
    }
    console.log("squareDragHandler");
    if( current.boardData[props.idx].selected){
      return;
    }
    
    select(props, "squareDragHandler", false);
    
  
    //console.log(event);
  }
  const cloneSquareData = (idx) => {
    let squareData = current.boardData[idx];
    let newSquareData = {
      given: squareData.given, 
      candidates: [...squareData.candidates],
      selected: squareData.selected
    };
    return newSquareData;
  
  }
  const updateBoardHistory = (newBoardData, spot, action)=>{
    setHistory( [...history.slice(0,spot), {"boardData":newBoardData, lastAction: action}]);
    setCount(spot);
    
  }
  const updateSelections = (number) => {

    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
      let spot = count+1;
      let newBoardData = [...current.boardData]; 
      
      
      // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
      newBoardData.forEach( (squareData, index, array) => {
        if( squareData.selected ){
          let newSquareData = cloneSquareData(index, );
          newSquareData.given=number;
          array[index] = newSquareData;
        }
      });

      
      
      updateBoardHistory(newBoardData, spot, `set-value-${number}`);

  }
  const updateSelectionHistory = (idx, action, clearFlag) => {

    
    // on click, take current board, clear all selections, and add my own selection, replace current board ( or add to current board if last action was not select)
    // on drag, take current board,                           add my own selection, replace current board( or add to current board if last action was not select)
    
    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
      let spot = count+1;
      if( current.lastAction.startsWith("selection-")){
        spot = count;
      }
      let newBoardData = [...current.boardData]; // equal to current unless we change spot from  count+1 to count;
      // if click - clear all the selections

      if( clearFlag ) {
        newBoardData.forEach( (squareData, index, array) => {
          if( squareData.selected ){
            let newSquareData = cloneSquareData(index, );
            newSquareData.selected = false;
            array[index] = newSquareData;
          }
        });
      }
      
      //remove impossible candidates
      //identify Solved cells
      // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
      let newSquareData = cloneSquareData(idx) ;
      newSquareData.selected = true;
      newBoardData[idx]=newSquareData;
      
      updateBoardHistory(newBoardData, spot, action);

  }
  const updateHistory = (idx, newSquareData, action) => {

    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
      let newBoardData = [...current.boardData]; // equal to current unless we change spot from  count+1 to count;
      
      //remove impossible candidates
      //identify Solved cells
      // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
      newBoardData[idx]=newSquareData;
      
      updateBoardHistory(newBoardData, count+1, action);

  }

  return (
    <div onKeyDown={keyPressHandler}>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        let newSquareData = cloneSquareData( count);
        newSquareData.given = count+1;
        updateHistory(count, newSquareData, "");
        }}>
        Click me
      </button>
      <button onClick={() => {
        setCount(0);
        }}>
        Reset
      </button>
      
      <Controls onUndoClick={undoHandler} onRedoClick={redoHandler}/>
      <Board boardData={current.boardData} onMouseDown={squareMouseDownHandler} onClick={squareClickHandler} snyderClickHandler={snyderClickHandler} squareDragHandler={squareDragHandler} />
      
    </div>
  
  );
}

export default App;
