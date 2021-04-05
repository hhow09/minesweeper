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
  showLog,
  endGameCallback,
  disabled = false,
  showAll = false,
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
    else bombCount.current--; //remove bomb (only called by handleFirstBomb)

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
    //purpose: when user clicking on the bomb on first step, modify it to normal cell.
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

  const findAdjacentSafeCells = (row, col, visited) => {
    // purpose: Clicking a square with no adjacent mine clears that square and clicks all adjacent squares.
    if (
      row < 0 ||
      col < 0 ||
      row > height - 1 ||
      col > width - 1 ||
      boardState[row][col].opened === true ||
      visited[row][col] ||
      boardState[row][col].isBomb === true
    )
      //stop condition
      return;
    else if (boardState[row][col].adjBombNum > 0) {
      visited[row][col] = true;
      return;
    }
    visited[row][col] = true;
    findAdjacentSafeCells(row - 1, col, visited); // top
    findAdjacentSafeCells(row - 1, col - 1, visited); // left-top
    findAdjacentSafeCells(row - 1, col + 1, visited); // right-top
    findAdjacentSafeCells(row + 1, col, visited); // bottom
    findAdjacentSafeCells(row + 1, col + 1, visited); //right-bottom
    findAdjacentSafeCells(row + 1, col - 1, visited); //left-bottom
    findAdjacentSafeCells(row, col + 1, visited); // right
    findAdjacentSafeCells(row, col - 1, visited); // left
  };

  const handleClickCell = (row, col, e) => {
    //TODO rise flag on right click
    //TODO performance: long time click handler
    if (boardState[row][col].opened || boardState[row][col].flagged) return;
    if (boardState[row][col].isBomb) {
      if (openedCount.current === 0) {
        handleFirstBomb(row, col);
      } else {
        setBoardState((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));

          showLog && console.log(`Oops! Clicked a Bomb on [${row},${col}]`);
          newState[row][col] = { ...newState[row][col], opened: true, backgroundColor: "red" };
          return newState;
        });
        endGameCallback(false);
      }
    } else if (boardState[row][col].adjBombNum === 0) {
      let visited = new Array(height).fill(1).map(() => new Array(width).fill(false));

      findAdjacentSafeCells(row, col, visited);
      const adjacentSafeCells = visited.reduce(
        (result, row, rowIdx) => [
          ...result,
          ...row.reduce((result, cellVisited, colIdx) => {
            if (cellVisited === true) return [...result, { row: rowIdx, col: colIdx }];
            else return [...result];
          }, []),
        ],
        []
      );
      setBoardState((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));

        showLog && console.log("Found adjacentSafeCells", adjacentSafeCells);
        adjacentSafeCells.forEach((cell) => {
          newState[cell.row][cell.col].opened = true;
        });
        return newState;
      });

      openedCount.current += adjacentSafeCells.length;
    } else {
      setBoardState((prevState) => {
        let newRow = prevState[row];
        newRow[col].opened = true;
        showLog && console.log(`Open a Cell at [${row},${col}]`);

        return [...prevState.slice(0, row), newRow, ...prevState.slice(row + 1)];
      });
      openedCount.current++;
    }
  };

  useEffect(() => {
    const isAllOpened = width * height - bombCount.current === openedCount.current;
    if (isAllOpened) endGameCallback(true);
  }, [openedCount.current]);

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
              opened={cell.opened || showAll}
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
  showAll: PropTypes.bool, // show all cells
};

export default Board;
