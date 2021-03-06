function getBoardWH(boardState) {
  return { width: boardState[0].length, height: boardState.length };
}

export function getAdjacentCells(row, col, width, height) {
  let adjacentCells = [];
  if (row - 1 >= 0) {
    adjacentCells.push({ row: row - 1, col }); //top
    if (col - 1 >= 0) adjacentCells.push({ row: row - 1, col: col - 1 }); //left-top
    if (col + 1 < width) adjacentCells.push({ row: row - 1, col: col + 1 }); //right-Top
  }
  if (row + 1 < height) {
    adjacentCells.push({ row: row + 1, col }); //bottom
    if (col - 1 >= 0) adjacentCells.push({ row: row + 1, col: col - 1 }); //left-Bottom
    if (col + 1 < width) adjacentCells.push({ row: row + 1, col: col + 1 }); //right-Bottom
  }
  if (col - 1 >= 0) adjacentCells.push({ row, col: col - 1 }); //left
  if (col + 1 < width) adjacentCells.push({ row, col: col + 1 }); //right

  return adjacentCells;
}

export function handleFirstBomb({ row, col, boardState, showLog }) {
  showLog && console.log(`first click on [${row},${col}] is a bomb. Remove it!`);
  const { width, height } = getBoardWH(boardState);
  const adjacentCells = getAdjacentCells(row, col, width, height);
  let newState = JSON.parse(JSON.stringify(boardState));
  newState[row][col].isBomb = false;
  for (let cell of adjacentCells) {
    newState[cell.row][cell.col].adjBombNum--;
  }
  showLog &&
    console.log(`Bomb number of adjacent cells (adjBombNum) are also updated.`, adjacentCells);

  return { row, col, boardState: newState };
}

export function openCell({ row, col, boardState, showLog }) {
  let newRow = JSON.parse(JSON.stringify(boardState[row]));
  newRow[col].opened = true;
  showLog && console.log(`Open a Cell at [${row},${col}]`);

  return {
    row,
    col,
    boardState: [...boardState.slice(0, row), newRow, ...boardState.slice(row + 1)],
  };
}

function findAdjacentSafeCells(row, col, visited, boardState) {
  const { width, height } = getBoardWH(boardState);
  // purpose: Clicking a square with no adjacent mine clears that square and clicks all adjacent squares.
  // strategy: BFS
  let queue = [{ row, col }];
  while (queue.length > 0) {
    const { row, col } = queue.shift();
    getAdjacentCells(row, col, width, height).forEach((cell) => {
      if (
        !visited[cell.row][cell.col] &&
        !boardState[cell.row][cell.col].opened &&
        !boardState[cell.row][cell.col].isBomb
      ) {
        visited[cell.row][cell.col] = true;
        if (boardState[cell.row][cell.col].adjBombNum === 0) {
          queue.push(cell);
        }
      }
    });
  }
}

export function openAdjacentSafeCells({ row, col, boardState, showLog }) {
  const { width, height } = getBoardWH(boardState);
  let visited = new Array(height).fill(1).map(() => new Array(width).fill(false));
  findAdjacentSafeCells(row, col, visited, boardState);
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
  let newState = JSON.parse(JSON.stringify(boardState));
  showLog && console.log("Found adjacentSafeCells", adjacentSafeCells);
  adjacentSafeCells.forEach((cell) => {
    newState[cell.row][cell.col].opened = true;
  });

  return {
    row,
    col,
    boardState: newState,
    count: adjacentSafeCells.length,
  };
}

export function openBomb({ row, col, boardState, showLog }) {
  let newRow = JSON.parse(JSON.stringify(boardState[row]));
  newRow[col] = { ...newRow[col], opened: true, backgroundColor: "red" };
  showLog && console.log(`Oops! Clicked a Bomb on [${row},${col}]`);

  return {
    row,
    col,
    boardState: [...boardState.slice(0, row), newRow, ...boardState.slice(row + 1)],
  };
}

export function flagCell({ row, col, boardState, showLog }) {
  let newRow = JSON.parse(JSON.stringify(boardState[row]));
  newRow[col].flagged = true;
  showLog && console.log(`Flag a Cell at [${row},${col}]`);

  return {
    row,
    col,
    boardState: [...boardState.slice(0, row), newRow, ...boardState.slice(row + 1)],
  };
}

export function unFlagCell({ row, col, boardState, showLog }) {
  let newRow = JSON.parse(JSON.stringify(boardState[row]));
  newRow[col].flagged = false;
  showLog && console.log(`Unflag a Cell at [${row},${col}]`);
  return {
    row,
    col,
    boardState: [...boardState.slice(0, row), newRow, ...boardState.slice(row + 1)],
  };
}

export const doSideEffect = (fn) => (args) => {
  fn(args);
  return args;
};

export const getState = ({ boardState }) => boardState;

export const pipe = (...functions) => (args) => functions.reduce((arg, fn) => fn(arg), args);
