const width = 50;
const height = 50;
const bombProbability = 0.1;

const DEFAULT_CELL_STATE = {
  opened: false,
  isBomb: false,
  adjBombNum: 0,
  flagged: false,
};
const getAdjacentCells = (row, col, width, height) => {
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
};

function findAdjacentSafeCells(row, col, visited, boardState) {
  // purpose: Clicking a square with no adjacent mine clears that square and clicks all adjacent squares.
  if (
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

  const adjacentCells = getAdjacentCells(row, col, width, height).filter(
    (cell) => !visited[cell.row][cell.col] && !boardState[row][col].opened
  );

  adjacentCells.length > 0 &&
    adjacentCells.forEach((cell) => {
      findAdjacentSafeCells(cell.row, cell.col, visited, boardState);
    });
}

const placeBomb = (prevState) => {
  let newState = JSON.parse(JSON.stringify(prevState));
  let sideEffects = []; //index of cell that should adjBombNum ++ at next step
  for (let rowIdx = 0; rowIdx < height; rowIdx++) {
    for (let colIdx = 0; colIdx < width; colIdx++) {
      if (Math.random() < bombProbability) {
        newState[rowIdx][colIdx].isBomb = true;
        sideEffects = [...sideEffects, ...getAdjacentCells(rowIdx, colIdx, width, height)];
      }
    }
  }
  for (let cell of sideEffects) {
    newState[cell.row][cell.col].adjBombNum++;
  }
  return newState;
};

const boardState = placeBomb(new Array(height).fill(new Array(width).fill(DEFAULT_CELL_STATE)));

let row = 10;
let col = 10;
while (boardState[row][col].isBomb) {
  row++;
}

let adjacentSafeCells = [];

while (adjacentSafeCells.length < 100 && col < width - 1) {
  row++;
  if (row > height - 1) {
    row = 0;
    col++;
  }

  let visited = new Array(height).fill(1).map(() => new Array(width).fill(false));
  findAdjacentSafeCells(row, col, visited, boardState);
  adjacentSafeCells = visited.reduce(
    (result, row, rowIdx) => [
      ...result,
      ...row.reduce((result, cellVisited, colIdx) => {
        if (cellVisited === true) return [...result, { row: rowIdx, col: colIdx }];
        else return [...result];
      }, []),
    ],
    []
  );

  console.log("adjacentSafeCells", adjacentSafeCells.length);
}
