import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Cell from "component/Cell";
const DEFAULT_CELL_STATE = {
  opened: false,
  isBomb: false,
  adjBombNum: 0,
  flagged: false,
};

const Board = ({
  width,
  height,
  bombProbability = 0.2,
  showLog = false,
  endGameCallback,
  disabled = false,
}) => {
  const bombCount = useRef(0);
  const openedCount = useRef(0);
  const [boardState, setBoardState] = useState(
    new Array(height).fill(new Array(width).fill(DEFAULT_CELL_STATE))
  );

  const placeBomb = () => {
    showLog && console.log("placeBomb start");
    setBoardState((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      let sideEffects = []; //index of cell that should adjBombNum ++ at next step
      for (let rowIdx = 0; rowIdx < height; rowIdx++) {
        for (let colIdx = 0; colIdx < width; colIdx++) {
          if (Math.random() < bombProbability) {
            newState[rowIdx][colIdx].isBomb = true;
            sideEffects = [...sideEffects, ...modifyBombSideEffect(rowIdx, colIdx)];
          }
        }
      }
      for (let cell of sideEffects) {
        newState[cell.row][cell.col].adjBombNum++;
      }
      return newState;
    });
    showLog && console.log(`placeBomb finished, ${bombCount.current} bombs are placed`);
  };
  const modifyBombSideEffect = (row, col, add = true) => {
    // purpose: record the adjacent cells and do adjBombNum++ later
    if (add) bombCount.current++;
    //place bomb
    else bombCount.current--; //remove bomb (called only by handleFirstBomb)

    let sideEffects = [];
    if (row - 1 >= 0) {
      sideEffects.push({ row: row - 1, col }); //top
      if (col - 1 >= 0) sideEffects.push({ row: row - 1, col: col - 1 }); //left-top
      if (col + 1 < width) sideEffects.push({ row: row - 1, col: col + 1 }); //right-Top
    }
    if (row + 1 < height) {
      sideEffects.push({ row: row + 1, col }); //bottom
      if (col - 1 >= 0) sideEffects.push({ row: row + 1, col: col - 1 }); //left-Bottom
      if (col + 1 < width) sideEffects.push({ row: row + 1, col: col + 1 }); //right-Bottom
    }
    if (col - 1 >= 0) sideEffects.push({ row, col: col - 1 }); //left
    if (col + 1 < width) sideEffects.push({ row, col: col + 1 }); //right
    return sideEffects;
  };

  useEffect(() => {
    placeBomb();
  }, []);

  const handleFirstBomb = (row, col) => {
    const sideEffects = modifyBombSideEffect(row, col, false);
    setBoardState((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState[row][col].isBomb = false;

      for (let cell of sideEffects) {
        newState[cell.row][cell.col].adjBombNum--;
      }
      return newState;
    });
  };

  const handleClickCell = (row, col, e) => {
    //TODO rise flag on right click
    //TODO performance: long time click handler
    if (boardState[row][col].isBomb) {
      if (openedCount.current === 0) {
        handleFirstBomb(row, col);
      } else {
        //TODO open red bomb
        endGameCallback(false);
        //TODO open all
      }
    }
    //TODO deal with Clicking a square with no adjacent mine clears that square and clicks all adjacent squares.
    openedCount.current++;
    const allOpened = width * height - bombCount.current === openedCount.current;
    if (allOpened) endGameCallback(true); //TODO open all

    setBoardState((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState[row][col].opened = true;
      return newState;
    });
  };

  return (
    <div>
      {boardState.map((row, idxRow) => (
        <div style={{ display: "flex" }} key={`row_${idxRow}`}>
          {row.map((cell, idxCell) => (
            <Cell
              {...cell}
              key={`cell_${idxCell}`}
              onClick={(e) => {
                handleClickCell(idxRow, idxCell, e);
              }}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  bombProbability: PropTypes.number,
  showLog: PropTypes.bool,
  endGameCallback: PropTypes.func,
  disabled: PropTypes.bool, // all cell unclickable
};

export default Board;
