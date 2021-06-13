import React, { useState, useEffect } from 'react';
import './App.scss';
import Board from './Board'
import Standard from "./rules/standard";

import Cage from './rules/cage';
import Arrow from './rules/arrow';
import Same from './rules/same';
import Kropke from './rules/kropke';
import Knight from './rules/knight';
import King from './rules/king';
import Pawn from './rules/pawn';
import Thermometer from './rules/thermometer';
import Renban from './rules/renban';
import Mod from './rules/mod';

import LittleKiller from './rules/littleKiller';
import Canvas from './Canvas';
import Whisper from './rules/whisper';
import Palindrome from './rules/palindrome';
import Quadruple from './rules/quadruple'
// snyder notation - puts a mark on the cell if the candidate can ONLY go in 2 cells
// if we get 2 snyder marks ( i.e 7,9 on 2 squares, those must be eliminated form other cells)
// Center marks are the only candidates that are possible in a ceell, as opposed to the only cells that are possible for a candidate

function Controls(props) {



  return <div>
    <button onClick={(e) => props.clickDispatcher(e, 'mode')}> Toggle mode ( {props.mode ? "Cell" : "Candidate"}) </button>
    <button onClick={(e) => props.clickDispatcher(e, 'undo')}>Undo</button>
    <button onClick={(e) => props.clickDispatcher(e, 'redo')}>Redo</button>
    <button onClick={(e) => props.clickDispatcher(e, 'accept')}>Accept</button>
    
    <button onClick={(e) => props.clickDispatcher(e, 'cage', prompt("Value", "9"))}>Create Cage</button>
    <button onClick={(e) => props.clickDispatcher(e, 'thermometer')}>Thermometer</button>
    <button onClick={(e) => props.clickDispatcher(e, 'renban')}>Renban</button>
    <button onClick={(e) => props.clickDispatcher(e, 'kropke', prompt("Type", "1"))}>Kropke</button>
    <br ></br>
    <button onClick={(e) => props.clickDispatcher(e, 'whisper')}>Whisper</button>
    <button onClick={(e) => props.clickDispatcher(e, 'palindrome')}>Palindrome</button>
    <button onClick={(e) => props.clickDispatcher(e, 'quadruple', prompt("Enter Values", ""))}>Quadruple</button>
    <button onClick={(e) => props.clickDispatcher(e, 'mod', 2, 1)}>Odd</button>
    <button onClick={(e) => props.clickDispatcher(e, 'mod', 2, 0)}>Even</button>
    <button onClick={(e) => props.clickDispatcher(e, 'mod', prompt("ModVal", "3"), prompt("ModResult", "0"))}>Mod</button>
    <br />
    <button onClick={(e) => props.clickDispatcher(e, 'chess', 'knight', prompt("Match Distance", "0"))}>Apply Knights Move</button>
    <button onClick={(e) => props.clickDispatcher(e, 'chess', 'pawn', prompt("Match Distance", "0"))}>Apply pawn Move</button>
    <button onClick={(e) => props.clickDispatcher(e, 'chess', 'king', prompt("Match Distance", "0"))}>Apply king Move</button>
    <button onClick={(e) => props.clickDispatcher(e, 'littleKiller', prompt("Value", "45"))}>Create Little Killer Cage</button>
    <button onClick={(e) => props.clickDispatcher(e, 'color', prompt("Value", "1"))}>Color digit</button>
    <br />
    <button onClick={(e) => props.clickDispatcher(e, 'same')}>Same</button>
    <button onClick={(e) => props.clickDispatcher(e, 'arrow', false)}>Arrow</button>
    <button onClick={(e) => props.clickDispatcher(e, 'arrow', true)}>Unique Arrow</button>
  </div>

}

function cloneSquare(squareData) {
  let newSquareData = {
    ...squareData,
    candidates: [...squareData.candidates],
  };
  newSquareData.cloneSquare = () => cloneSquare(newSquareData);
  return newSquareData;

}
// I am having troubles with nested items failing to be replaced
// so I lifted up all the nested parts of the squareData, and now the state will have seperate values for 
function startingState() {

  let boardData = [...Array(9 * 9).fill(null)];

  [...Array(9 * 9).fill(null)].forEach((value, index, array) => {
    let candidates = [...Array(9).keys()].map(k => k + 1);
    boardData[index] = {
      cloneSquare: null,
      given: 0,
      answer: 0,
      candidates: candidates,
      selected: false,
      color: 0,
      idx: index,
      cageValue: null,
      cageFlags: 0
    };
    boardData.cloneSquare = () => { };
  });
  let columnRules = Array(9).fill(0).map((a, y) => Standard.fromRectangle(y, 0, 1, 9, boardData));
  let rowRules = Array(9).fill(0).map((a, x) => Standard.fromRectangle(0, x, 9, 1, boardData));
  let boxRules = Array(9).fill(0).map((a, b) => {
    let y = 3 * Math.floor(b / 3);
    let x = 3 * (b % 3);
    let r = Standard.fromRectangle(y, x, 3, 3, boardData);
    return r;
  });

  let rules = [...columnRules, ...rowRules, ...boxRules];
  //  let rules = [new Normal(boardData)];
  return {
    "boardData": boardData,
    "rules": rules,
    "index": 0,
    "selection": [],
    "lastAction": ""
  };
}



function App() {

  const [mode, setMode] = useState(1);
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState(() => [startingState()]);
  const current = history[count];

  const applyNewRule = (newBoardData, newRule) => {
    updateBoardHistory(newBoardData, count + 1, `create new`, newRule);
  }
  //TODO: gracefully handle selections between actions - reqind or fastforward through them as appropriate - or run a clearselection on them
  const clickDispatcher = (e, command, ...props) => {
    let newRule = null;
    let newBoardData = [...current.boardData];
    let selectedCells = current.selection.map(i => newBoardData[i]);
    switch (command) {

      case "undo":
        if (count) { setCount(count - 1); }
        break;
      case "redo":
        if (count + 1 < history.length) { setCount(count + 1); }
        break;
      case "accept":
        accept();
        break;
      case "mode":
        setMode(1 - mode);
        break;
      case "thermometer":
        newRule = new Thermometer(selectedCells);
        break;
      case "renban":
        newRule = new Renban(selectedCells);
      break;
      case "kropke":
        let [type/*, ...p*/] = [...props];
        newRule = new Kropke(selectedCells, type);
      break;
      case "arrow":
        let [unique/*, ...p*/] = [...props];
        newRule = new Arrow(selectedCells, unique);
        break;
      case "same":
        newRule = new Same(selectedCells);
        break;
      case "mod":
        let [modVal, modResult/*, ...p*/] = [...props];
        newRule = new Mod(selectedCells, modVal, modResult);
      break;
      case "whisper":
        newRule = new Whisper(selectedCells);
        break;
      case "quadruple":
        {
          let [value/*, ...p*/] = [...props];
          newRule = new Quadruple(selectedCells, value);
        }
        break;

      case "palindrome":
        newRule = new Palindrome(selectedCells);
        break;
      case "cage":
      case "littleKiller":
        {
          let [value/*, ...p*/] = [...props];
          //let exact = window.confirm("exact?");

          if (command === "cage") {
            newRule = new Cage(selectedCells, true, value);
          }
          if (command === "littleKiller") {
            newRule = new LittleKiller(selectedCells, true, value);
          }
        }
        break;
      case "chess":
        {
          let [chessPiece, parameter/*, ...p*/] = [...props];
          switch (chessPiece) {
            case "knight":
              newRule = new Knight(newBoardData, parameter);
              break;
            case "king":
              newRule = new King(newBoardData, parameter);
              break;
            case "pawn":
              newRule = new Pawn(newBoardData, parameter);
              break;
            default: break;
          }

        }

        break;
      case "color":
        console.log("coloring cells");
        let [value/*, ...p*/] = [...props];

        newBoardData.forEach((c, i, a) => {
          let n = cloneSquare(c);
          let v = parseInt(value);
          let q = n.candidates.includes(v);
          console.log(n, v, q)

          n.color = q ? "blue" : "none";
          a[i] = n;
          console.log("Change selected", i, a[i].selected)
        });
        updateBoardHistory(newBoardData, count + 1, `highlight`);
        break;

      default: break;

    }
    if (newRule) {
      applyNewRule(newBoardData, newRule);
    }
  }




  // change this to accept a response from the apply function, I don't like having apply mutate the board directly
  const applyRules = (newBoardData, selectedCellIndexes = []) => {

    if (!newBoardData) {
      newBoardData = [...current.boardData];
    }

    if (current.lastAction.startsWith("select")) {
      return;
    }
    let mutations = 0;
    let mutation_count = 0;
    /* this is th eonly function that needs to do calculations curently, all other functions only manage selection highlighting */
    // there is a technique we can apply if all instanced of a candidate apply withing a collision of two regions, they cannot be outside of it
    current.rules.forEach((rule, index, array) => {
      // returns [.. {idx, candidates} ..]
      let rule_mutations = rule.apply(newBoardData, cloneSquare);

      if (rule_mutations) {
        //mutated = true;
        mutations = mutations + 1;
        mutation_count = mutation_count + rule_mutations;
      }

    });

    // When it comes to auto-removing values, I also need to consider just marking them as
    if (mutations === 0) {


      current.rules.forEach((ruleA, indexA, arrayA) => {
        current.rules.forEach((ruleB, indexB, arrayB) => {
          if (ruleA === ruleB) {
            return;
          }
          return;

          // {
          //   if (!(ruleA.supportsIntersectionSource() && ruleB.supportsIntersectionSource())) {
          //     return;
          //     // any candidate that only exists in a region, and the places it exists overlap with another region, it must be withing the intersection
          //   }


          //   // I can build a rule inside knight etc, that can conclude - if a candidate being true, makes another region impossible, then it cannot be true - this is a reversal of the way we phrase about an intersction
          //   // becasue if the candidate is in RuleB, in a location that is not in the intersection, then ruleA becomes impossible.

          //   [...Array(9).fill(0).keys()].forEach((cm, index, arr) => {
          //     // if all of the values of candidate are in (A int B), remove candidate from all other cells in B;
          //     let candidate = index + 1;

          //     /*
          //     if( candidate => ruleB.impossible)


          //     */

          //     let locationA = ruleA.cellIndexes.filter((i) => newBoardData[i].candidates.includes(candidate));
          //     let locationB = ruleB.cellIndexes.filter((i) => newBoardData[i].candidates.includes(candidate));




          //     let intersection = locationA.filter((i) => locationB.includes(i));
          //     if (intersection.length === 0) {
          //       return;
          //     }

          //     //something like knights move does not have a standard intersection, however intersections in the other rule are based on the current candidate square

          //     // Cages for example,  work ruleA-->B in the context -- If a candidate in the Cage would make the other rule impossible, the candidate must be removed
          //     //      Alternatively, ruleB->A -- If all candidates in ruleB intersect with the cage, then the candidate in ruleB must be valid, and in ruleA are forbidden ( same result )
          //     // If all candidates in a Normal Rule A exist within the intersection of another Unique Rule B, then all other locations in B must be forbidden
          //     // If a particular candidate in Unique Rule A exists outside of the intersection with Standard Rule B, and that candidate only exist withing the intersection in rule B, then this candidate must be removed

          //     // For knights moves
          //     // if a particular candidate in knighs Rule A exists outside the of the intersection with Standard RUle B, and that candidate only exist withing the intersection in rule B, then this candidate must be removed
          //     // AKA - if a particular cnadidate "Sees", all candidates in Standard Rule B, then it mus tbe forbidden.
          //     // for knights though, this must work a little differnt - it has to look at the knights move, and the x/y intersections



          //     // so for candidate N in in a square Y of any number of rules; if N "intersect" with all instances of N in Rule Z, then candidate N must be removed from square Y

          //     // 
          //     /* 
          //     for ruleZ in rules:
          //       for squareY in ruleZ:
          //         for candidateN in square:
          //           generate intersection of all rules(Square Y / Candidate N)
          //           if all N in ruleZ are within intersection - N must be removed from  from Y

          //     */


          //     if (locationA.every((i) => intersection.includes(i))) {
          //       // every value of candidate from ruleA is within the intersection.  for normal rules this means that the value must be removed form 
          //       // all cells in ruleB, if B is a 'unique' rule;
          //       // but not all 
          //       if (locationB.length > intersection.length) {
          //         //removing it
          //         ruleB.cellIndexes.forEach((c) => {
          //           if (!intersection.includes(c)) {
          //             //mutations = mutations+1;

          //             let newSquareData = cloneSquare(newBoardData[c]);
          //             console.log("Removing value from square becasue of intersection logic", indexA, indexB, locationA, locationB, intersection);
          //             newSquareData.candidates = newSquareData.candidates.map((i) => i === candidate ? 0 : i);
          //             mutations = mutations + 1;
          //             newBoardData[c] = newSquareData;

          //           }
          //         });
          //       }
          //     }

          //   });
          // }
          //applyIntersection(ruleA, ruleB);

          // If a candidate being true, make a region impossible, then the candidate must be forbidden
        })
      });

    }

    // todo: rule intersection ( if a candidate only exists in teh colliosion of one rule and another, then it must be within that collision in the other one as well)

    if (mutations) {
      updateBoardHistory(newBoardData, count, `rules-${count}`);
    }
    
    //remove impossible candidates
    //identify Solved cells
  }
  const keyPressHandler = (event) => {

    //mode = 
    if (false !== event.target.readOnly) {
      event.preventDefault();
      let number = parseInt(event.key);
      if (!isNaN(number)) {
        updateSelections(number);
        // type into highlighted squares
      }else{
        if( event.key === 's'){
          clickDispatcher(event, 'same');
        }
        if( event.key === 'c'){
          console.log(event);
          clickDispatcher(event, 'cage', prompt("Value", "9"));
        }
      }
    }



  }
  let captureKeys = () => {
    document.addEventListener("keydown", keyPressHandler);
    return () => {
      document.removeEventListener("keydown", keyPressHandler);

    }
  }

  useEffect(captureKeys);
  useEffect(() => {

    applyRules(0, []);

    // apply
    // is it possible to apply rules without saving them to the state.

  });

  const snyderClickHandler = (props, candidate) => (event) => {

  };
  const select = (props, selectionType, clearFlag) => {
    /* Clear all selections and set current square to selected */

    let action = `selection-${selectionType}-idx-${props.idx}`;

    // eslint-disable-next-line 
    if (current.lastAction.eq == action) {
      return;
    }


    updateSelectionHistory(props.idx, action, clearFlag);// Do something so that we update the current record, instead of pushing

  }
  const squareMouseDownHandler = (props) => (event) => {
    /* Clear all selections and set current square to selected */
    let clear = true;
    event.preventDefault();
    if (event.ctrlKey) {
      if (current.boardData[props.idx].selected) {
        return;
      }
      clear = false;
    }
    select(props, "squareMouseDownHandler", clear);


  };
  const squareClickHandler = (props) => (event) => {

  };
  const squareDragHandler = (props) => (event) => {
    /* Update existing state  from mouseDown and add new square selected */
    event.preventDefault();

    if (!event.buttons) {
      return;
    }
    if (current.boardData[props.idx].selected) {
      return;
    }

    select(props, "squareDragHandler", false);


  }

  const extractClonedSquare = (idx) => {
    let squareData = current.boardData[idx];
    return cloneSquare(squareData);

  }
  const updateBoardHistory = (newBoardData, spot, action, newRule = null, newSelections) => {
    // If the new Rules have modified newBoardData in thier constructor, this will catch it.

    let selections = [...current.selection];
    if (newSelections) {
      selections = newSelections;
    }
    let rules = [...current.rules];
    if (newRule) {
      rules.push(newRule);
      newRule.setFlags(newBoardData);
    }

    setHistory([...history.slice(0, spot), {
      "boardData": newBoardData,
      "rules": rules,
      "index": newBoardData.index,
      lastAction: action,
      "selection": selections
    }]);
    setCount(spot);

  }
  const updateSelections = (number, selections = null) => {

    // mode = 0: update Candidates
    // mode = 0; update Answers
    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
    let spot = count + 1;
    let newBoardData = [...current.boardData];
    let selectedCellIndexes = [];
    if (selections) {
      selectedCellIndexes = selections;
    } else {
      selectedCellIndexes = newBoardData.filter((cell) => cell.selected).map((cell) => cell.idx);
    }

    let mutations = 0;
    // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
    selectedCellIndexes.forEach((cellIndex, index, array) => {

      let squareData = newBoardData[cellIndex];
      let newSquareData = cloneSquare(squareData);
      let mutated = false;
      if (!newSquareData.given) {
        if (mode === 0) {
          if (newSquareData.candidates[number - 1] === number) {
            mutated = true;
            newSquareData.candidates[number - 1] = 0;
          }
        } else {
          if (newSquareData.answer !== number) {
            mutated = true;
            newSquareData.answer = number;
          }
        }

        if (mutated) {
          mutations = mutations + 1;
          newBoardData[cellIndex] = newSquareData;
        }
      }

    });

    if (mutations > 0) {

      //applyRules(newBoardData, selectedCellIndexes);
      updateBoardHistory(newBoardData, spot, `set-value-${number}`);
    }
  }
  const accept = () => {
    // set answers to thier only accepted values


    // mode = 0: update Candidates
    // mode = 0; update Answers
    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
    let spot = count + 1;
    let newBoardData = [...current.boardData];


    let acceptedCells = newBoardData.filter((cell) => cell.candidates.filter(c => c !== 0).length === 1);

    let mutations = 0;
    // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
    acceptedCells.forEach((cell, index, array) => {
      if (cell.given || cell.answer) {
        return;
      }
      let newSquareData = cloneSquare(cell);
      //let mutated = false;
      let answer = cell.candidates.find((c) => c !== 0);
      newSquareData.answer = answer;
      newBoardData[cell.idx] = newSquareData;
      mutations = mutations + 1;

    });

    if (mutations > 0) {
      updateBoardHistory(newBoardData, spot, `accept`);
    }
  }
  const updateSelectionHistory = (idx, action, clearFlag) => {


    // on click, take current board, clear all selections, and add my own selection, replace current board ( or add to current board if last action was not select)
    // on drag, take current board,                           add my own selection, replace current board( or add to current board if last action was not select)

    /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
    let spot = count + 1;
    if (current.lastAction.startsWith("selection-")) {
      spot = count;
    }
    let newBoardData = [...current.boardData]; // equal to current unless we change spot from  count+1 to count;
    // if click - clear all the selections

    let selections = [...current.selection];
    if (clearFlag) {
      newBoardData.forEach((squareData, index, array) => {
        if (squareData.selected) {
          let newSquareData = extractClonedSquare(index,);
          newSquareData.selected = false;
          array[index] = newSquareData;
        }
      });
      selections = [];
    }

    // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
    let newSquareData = extractClonedSquare(idx);
    newSquareData.selected = true;
    newBoardData[idx] = newSquareData;
    updateBoardHistory(newBoardData, spot, action, null, [...selections, idx]);

  }
  return (
    <div onKeyDown={keyPressHandler}>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        setCount(0);
      }}>
        Reset
      </button>
      <br />
      <input type="text" name="importString" id="inputString" />
      <button onClick={() => {
        /* On some updates ( selection reset update ), we want to undo to the previous record, and append a new record based on the current selection */
        let newBoardData = [...current.boardData];
        let [givens, answers] = document.getElementById("inputString").value.split('/');
        let givenValues = givens.split('');
        let answerValues = (answers || "").split('');
        // leave old square data references pointing to existing square data from previous record.  be carefule when updating the "current record" to alwatys create a new squaredata value;
        givenValues.forEach((value, index, array) => {
          if (index < 9 * 9) {
            let number = parseInt(value);
            if (!isNaN(number) && number > 0) {
              let newSquareData = extractClonedSquare(index);
              newSquareData.given = number;
              newBoardData[index] = newSquareData;
            }
          }
        });
        answerValues.forEach((value, index, array) => {
          if (index < 9 * 9) {
            let number = parseInt(value);
            if (!isNaN(number) && number > 0) {
              let newSquareData = extractClonedSquare(index);
              newSquareData.answer = number;
              newBoardData[index] = newSquareData;
            }
          }
        });


        //applyRules(newBoardData, selectedCellIndexes);
        if (givenValues.length + answerValues.length > 0) {
          updateBoardHistory(newBoardData, count + 1, `set-value-input`);
        }

      }}>
        Import
      </button>
      <button onClick={() => {
        let givenValues = current.boardData.map((cellData) => cellData.given);
        let answerValues = current.boardData.map((cellData) => cellData.answer);
        let exportString = givenValues.join('') + '/' + answerValues.join('');
        document.getElementById("exportString").value = exportString;
      }} >Export</button>

      <br />
      <input type="text" name="exportString" id="exportString" />
      <br />

      <Controls clickDispatcher={clickDispatcher.bind(this)} mode={mode} />
      <Canvas>
        <Board boardData={current.boardData} rules={current.rules} onMouseDown={squareMouseDownHandler} onClick={squareClickHandler} snyderClickHandler={snyderClickHandler} squareDragHandler={squareDragHandler} />
      </Canvas>
    </div>

  );
}

export default App;
