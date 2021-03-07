import React, { useState, useEffect } from 'react';
import Region from "./rules/region";
import './App.css';
import Board from './Board'

function Controls(props) {
  return <div><button onClick={props.onUndoClick}>Undo</button><button onClick={props.onRedoClick}>Redo</button></div>
  
}
// I am having troubles with nested items failing to be replaced
// so I lifted up all the nested parts of the squareData, and now the state will have seperate values for 
function startingState(){
  
  let boardData = [...Array(9*9).fill(null)];
  
  [...Array(9*9).fill(null)].forEach( (value, index, array) => {
    let candidates = [...Array(9).keys()].map(k=>k+1);
    boardData[index] = {
      given: 0, 
      answer: 0, 
      candidates: candidates, 
      selected: false, 
      idx: index
    };
  } );
  let columnRules = Array(9).fill(0).map( (a,y) => Region.fromRectangle(y,0,1,9, boardData) ) ;
  let rowRules = Array(9).fill(0).map( (a,x) => Region.fromRectangle(0,x,9,1, boardData) ) ;
  

  let rules = [...columnRules, ...rowRules];
  return {
    "boardData": boardData,
    "rules": rules,
    "index": 0,
    "lastAction": ""
  };
}
function App() {
  
  
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState( () => [  startingState() ] );
  const current = history[count];

  
  //TODO: gracefully handle selections between actions - reqind or fastforward through them as appropriate - or run a clearselection on them
  const undoHandler = (e) =>{ if( count ){ setCount(count-1)}};
  const redoHandler = (e) =>{ if( count+1 < history.length ){ setCount(count+1)}};

  
  const applyRules = (newBoardData, selectedCellIndexes=[]) => {
    console.log("Count or History has changed after render of "+current.lastAction);
    if( ! newBoardData ){
      newBoardData=[...current.boardData];
    }
    if( current.lastAction.startsWith("select")){
      return;
    }
    let mutations = 0;
    let mutation_count = 0;
     /* this is th eonly function that needs to do calculations curently, all other functions only manage selection highlighting */
     current.rules.forEach( (rule, index, array ) => {
      // returns [.. {idx, candidates} ..]
      let rule_mutations = rule.apply(newBoardData, cloneSquare);
      if(  rule_mutations ){
        //mutated = true;
        mutations = mutations+1;
        mutation_count = mutation_count+rule_mutations;
      }
      
    });
    console.log(` ${mutations} Rules have mutated ${mutation_count} squares in applyRules`);
    if( mutations ){
      updateBoardHistory(newBoardData, count, `rules-${count}`);
    }
     //remove impossible candidates
    //identify Solved cells
  }
  const keyPressHandler = (event) =>{
    let number = parseInt(event.key);
    if( !isNaN(number) ){
      event.preventDefault();
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
  useEffect( () => {
    
    applyRules(0, []);
    
    // apply
    // is it possible to apply rules without saving them to the state.

  });
        
  const snyderClickHandler = (props, candidate) => (event) => {
    // let newSquareData = extractClonedSquare(props.idx, "");

    // newSquareData.candidates[candidate] = 0;

    // updateHistory(props.idx, newSquareData,"");

  };
  const select = (props, selectionType, clearFlag) => {
    /* Clear all selections and set current square to selected */

    let action = `selection-${selectionType}-idx-${props.idx}`;

    // eslint-disable-next-line 
    if( current.lastAction.eq == action){
      return;
    }


    updateSelectionHistory(props.idx, action, clearFlag);// Do something so that we update the current record, instead of pushing

  }
  const squareMouseDownHandler  = (props) => (event) => {
    /* Clear all selections and set current square to selected */

    event.preventDefault();
    select(props, "squareMouseDownHandler", true);
    

  };
  const squareClickHandler = (props) => (event) => {

  };
  const squareDragHandler = (props) => (event) => {
    /* Update existing state  from mouseDown and add new square selected */
    event.preventDefault();
    
    if(! event.buttons ){
      return;
    }
    if( current.boardData[props.idx].selected){
      return;
    }
    
    select(props, "squareDragHandler", false);
    
  
  }
  const cloneSquare = (squareData) => {
    let newSquareData = {
      ...squareData,
      candidates: [...squareData.candidates],
    };
    return newSquareData;
  }
  const extractClonedSquare = (idx) => {
    let squareData = current.boardData[idx];
    return cloneSquare(squareData);
  
  }
  const updateBoardHistory = (newBoardData, spot, action, newRules=null)=>{
    setHistory( [...history.slice(0,spot), {
      "boardData":newBoardData, 
      "rules": newRules || current.rules,
      "index": newBoardData.index,
      lastAction: action
    }]);
    setCount(spot);
    
  }
  const updateSelections = (number,selections=null) => {

    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
      let spot = count+1;
      let newBoardData = [...current.boardData]; 
      console.log("log "+newBoardData);
      let selectedCellIndexes = [];
      if( selections ){
        selectedCellIndexes = selections;
      }else{
        selectedCellIndexes = newBoardData.filter( (cell) => cell.selected).map( (cell) => cell.idx);
      }

      // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
      selectedCellIndexes.forEach( (cellIndex, index, array) => {
        let squareData = newBoardData[cellIndex];
        let newSquareData = extractClonedSquare(cellIndex );
        newSquareData.answer=number;
        //newSquareData.candidates[number-1] = 0;
        
        newBoardData[cellIndex] = newSquareData;
        
      });
      

     //applyRules(newBoardData, selectedCellIndexes);
     
      console.log("issueing updateBoardHistory", `set-value-${number}`);
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
            let newSquareData = extractClonedSquare(index, );
            newSquareData.selected = false;
            array[index] = newSquareData;
          }
        });
      }
      
      // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
      let newSquareData = extractClonedSquare(idx) ;
      newSquareData.selected = true;
      newBoardData[idx]=newSquareData;
      updateBoardHistory(newBoardData, spot, action);

  }
  // todo - fix possible values after an 'Answer' changes
  const updateHistory = (idx, newSquareData, action, newRules=null) => {

    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
      let newBoardData = [...current.boardData]; // equal to current unless we change spot from  count+1 to count;
      
      // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
      newBoardData[idx]=newSquareData;
      
      updateBoardHistory(newBoardData, count+1, action, newRules);

  }

  return (
    <div onKeyDown={keyPressHandler}>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        let boxRules = Array(9).fill(0).map( (a,b) => {
          let y = 3 * Math.floor(b/3);
          let x = 3 * (b % 3 );
         let r = Region.fromRectangle(y,x,3,3, current.boardData);
          return r;
        });

        updateBoardHistory(current.boardData, count+1, "action", [...current.rules, ...boxRules]);
        
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
