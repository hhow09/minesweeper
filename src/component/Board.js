import { useState, useEffect, useRef, useReducer, useCallback } from "react";

import PropTypes from "prop-types";
import Cell from "component/Cell";
import {
  getAdjacentCells,
  handleFirstBomb,
  openAdjacentSafeCells,
  openCell,
  openBomb,
  flagCell,
  unFlagCell,
  getState,
  doSideEffect,
  pipe,
} from "helper";

const ACTIONS = {
  PLACE_BOMB: "PLACE_BOMB",
  TOGGLE_FLAG_CELL: "TOGGLE_FLAG_CELL",
};

const DEFAULT_CELL_STATE = {
  opened: false,
  isBomb: false,
  adjBombNum: 0,
  flagged: false,
};

const boardReducer = (prevState, action) => {
  const { row, col, width, height, bombProbability, showLog } = action;
  const { boardState, openedCount } = prevState;
  switch (action.type) {
    case ACTIONS.PLACE_BOMB:
      let bombCount = 0;
      let newState = JSON.parse(JSON.stringify(boardState));
      let sideEffects = []; //index of cell that should adjBombNum ++ at next step
      for (let rowIdx = 0; rowIdx < height; rowIdx++) {
        for (let colIdx = 0; colIdx < width; colIdx++) {
          if (Math.random() < bombProbability) {
            newState[rowIdx][colIdx].isBomb = true;
            bombCount++;
            sideEffects = [...sideEffects, ...getAdjacentCells(rowIdx, colIdx, width, height)];
          }
        }
      }
      for (let cell of sideEffects) {
        newState[cell.row][cell.col].adjBombNum++;
      }
      showLog && console.log(`placeBomb finished, ${bombCount} bombs are placed`);
      return { ...prevState, boardState: newState, bombCount };
    case ACTIONS.TOGGLE_FLAG_CELL:
      if (boardState[row][col].flagged)
        return {
          ...prevState,
          boardState: pipe(unFlagCell, getState)({ row, col, boardState, showLog }),
        };
      else
        return {
          ...prevState,
          boardState: pipe(flagCell, getState)({ row, col, boardState, showLog }),
        };
    default:
      return prevState;
  }
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
  // const bombCount = useRef(0);
  // const openedCount = useRef(0);
  const [state, dispatch] = useReducer(boardReducer, {
    boardState: new Array(height).fill(null).map(() => new Array(width).fill(DEFAULT_CELL_STATE)),
    bombCount: 0,
    openedCount: 0,
  });
  // const [countToAdd, setCountToAdd] = useState(0);

  useEffect(() => {
    const placeBomb = () => {
      showLog && console.log("placeBomb start");
      dispatch({ type: ACTIONS.PLACE_BOMB, width, height, bombProbability, showLog });
    };
    placeBomb();
  }, []);

  const handleRightClick = useCallback(
    (row, col, e) => {
      e.preventDefault();
      //purpose: rise flag for certain cell
      dispatch({ type: ACTIONS.TOGGLE_FLAG_CELL, row, col, showLog });
    },
    [dispatch, showLog]
  );

  // const handleClickCell = (row, col) => {
  //   //TODO performance: long time click handler
  //   if (boardState[row][col].opened || boardState[row][col].flagged) return;
  //   if (boardState[row][col].isBomb) {
  //     if (openedCount.current === 0) {
  //       // condition: first step, open a bomb
  //       bombCount.current--;
  //       if (boardState[row][col].adjBombNum === 0) {
  //         // action: open adjacent cells
  //         setBoardState((boardState) =>
  //           pipe(
  //             handleFirstBomb,
  //             openAdjacentSafeCells,
  //             doSideEffect((args) => {
  //               // should not add
  //               setCountToAdd(args.count);
  //             }),
  //             getState
  //           )({ row, col, boardState, showLog })
  //         );
  //       } else {
  //         // open cell
  //         setBoardState((boardState) =>
  //           pipe(handleFirstBomb, openCell, getState)({ row, col, boardState, showLog })
  //         );
  //         openedCount.current += 1;
  //       }
  //     } else {
  //       //condition: not first step, open a bomb
  //       setBoardState((boardState) => pipe(openBomb, getState)({ row, col, boardState, showLog }));
  //       endGameCallback(false);
  //     }
  //   } else if (boardState[row][col].adjBombNum === 0) {
  //     setBoardState((boardState) =>
  //       pipe(
  //         openAdjacentSafeCells,
  //         doSideEffect((args) => {
  //           setCountToAdd(args.count);
  //         }),
  //         getState
  //       )({ row, col, boardState, showLog })
  //     );
  //   } else {
  //     setBoardState((boardState) => pipe(openCell, getState)({ row, col, boardState, showLog }));
  //     openedCount.current += 1;
  //   }
  // };

  // useEffect(() => {
  //   if (countToAdd > 0) {
  //     openedCount.current += countToAdd;
  //     setCountToAdd(0);
  //   }
  // }, [countToAdd]);

  useEffect(() => {
    const isAllOpened = width * height - state.bombCount === state.openedCount;
    if (isAllOpened) endGameCallback(true);
  }, [state.openedCount]);

  console.log("render");
  return (
    <>
      {state.boardState.map((row, idxRow) => (
        <div style={{ display: "flex" }} key={`row_${idxRow}`}>
          {row.map((cell, idxCell) => (
            <Cell
              {...cell}
              key={`cell_${idxCell}`}
              // onClick={() => {
              //   handleClickCell(idxRow, idxCell);
              // }}
              row={idxRow}
              col={idxCell}
              handleRightClick={handleRightClick}
              disabled={disabled}
              opened={cell.opened || showAll}
            />
          ))}
        </div>
      ))}
    </>
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
