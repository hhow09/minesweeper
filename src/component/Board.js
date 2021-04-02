import { useState, useEffect, useRef } from "react";
import Cell from "component/Cell";
const DEFAULT_CELL_STATE = {
  opened: false,
  isBomb: false,
  adjBombNum: 0,
};

const Board = ({ width, height, bombProbability = 0.2, tutorial = false, endGameCallback }) => {
  const bombCount = useRef(0);
  const openedCount = useRef(0);
  const [boardState, setBoardState] = useState(
    new Array(height).fill(new Array(width).fill(DEFAULT_CELL_STATE))
  );

  const placeBomb = () => {
    tutorial && console.log("placeBomb start");
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
    tutorial && console.log(`placeBomb finished, ${bombCount.current} bombs are placed`);
  };
  const modifyBombSideEffect = (row, col, add = true) => {
    // record the adjacent cells and do adjBombNum++ later
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

  const handleClickCell = (row, col) => {
    if (boardState[row][col].isBomb) {
      if (openedCount.current === 0) {
        handleFirstBomb(row, col);
      } else {
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
              onClick={() => {
                handleClickCell(idxRow, idxCell);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
