import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Cell from "component/Cell";
import {
  getAdjacentCells,
  handleFirstBomb,
  openAdjacentSafeCells,
  openCell,
  openBomb,
  getState,
  doSideEffect,
  pipe,
} from "helper";

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
  const [countToAdd, setCountToAdd] = useState(0);

  useEffect(() => {
    const placeBomb = () => {
      showLog && console.log("placeBomb start");
      setBoardState((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        let sideEffects = []; //index of cell that should adjBombNum ++ at next step
        for (let rowIdx = 0; rowIdx < height; rowIdx++) {
          for (let colIdx = 0; colIdx < width; colIdx++) {
            if (Math.random() < bombProbability) {
              newState[rowIdx][colIdx].isBomb = true;
              bombCount.current++;
              sideEffects = [...sideEffects, ...getAdjacentCells(rowIdx, colIdx, width, height)];
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
    placeBomb();
  }, []);

  const handleClickCell = (row, col, e) => {
    //TODO rise flag on right click
    //TODO performance: long time click handler
    if (boardState[row][col].opened || boardState[row][col].flagged) return;
    if (boardState[row][col].isBomb) {
      if (openedCount.current === 0) {
        // condition: first step, open a bomb
        bombCount.current--;
        if (boardState[row][col].adjBombNum === 0) {
          // action: open adjacent cells
          setBoardState((boardState) =>
            pipe(
              handleFirstBomb,
              openAdjacentSafeCells,
              doSideEffect((args) => {
                // should not add
                setCountToAdd(args.count);
              }),
              getState
            )({ row, col, boardState, showLog })
          );
        } else {
          // open cell
          setBoardState((boardState) =>
            pipe(handleFirstBomb, openCell, getState)({ row, col, boardState, showLog })
          );
          openedCount.current += 1;
        }
      } else {
        //condition: not first step, open a bomb
        setBoardState((boardState) => pipe(openBomb, getState)({ row, col, boardState, showLog }));
        endGameCallback(false);
      }
    } else if (boardState[row][col].adjBombNum === 0) {
      setBoardState((boardState) =>
        pipe(
          openAdjacentSafeCells,
          doSideEffect((args) => {
            setCountToAdd(args.count);
          }),
          getState
        )({ row, col, boardState, showLog })
      );
    } else {
      setBoardState((boardState) => pipe(openCell, getState)({ row, col, boardState, showLog }));
      openedCount.current += 1;
    }
  };

  useEffect(() => {
    if (countToAdd > 0) {
      openedCount.current += countToAdd;
      setCountToAdd(0);
    }
  }, [countToAdd]);

  useEffect(() => {
    const isAllOpened = width * height - bombCount.current === openedCount.current;
    if (isAllOpened) endGameCallback(true);
  }, [openedCount.current]);

  return (
    <>
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
