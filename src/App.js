import Board from "component/Board";
import { useState, useMemo } from "react";
import githubLogo from "assests/gitHub-logo.png";
const pageStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  overflow: "auto",
};

const configStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "20px",
  border: "2px solid black",
  padding: "20px",
};

const boardStyle = {
  maxWidth: "90vw",
  overflow: "scroll",
};
const labelStyle = { display: "flex", justifyContent: "space-between", marginBottom: "5px" };

const Page = ({ children }) => <div style={pageStyle}>{children}</div>;

function App() {
  const [boardWidth, setBoardWidth] = useState(10);
  const [boardHeight, setBoardHeight] = useState(10);
  const [bombProbability, setBombProbability] = useState(0.2);
  const [showLog, setShowLog] = useState(false);

  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(1);

  const validBoardConfig =
    boardWidth > 0 && Number.isInteger(boardHeight) && boardHeight > 0 && bombProbability > 0;

  const handleEndGame = (win) => {
    if (win) alert("You win!");
    else alert("You lose!");
    setStarted(false);
  };

  //only update board config when round is updated
  const BoardMemo = useMemo(
    () => (
      <Board
        key={round}
        width={boardWidth || 0}
        height={boardHeight || 0}
        bombProbability={bombProbability}
        endGameCallback={handleEndGame}
        disabled={!started}
        showAll={round > 1 && !started}
        showLog={showLog}
      />
    ),
    [round, started]
  );

  return (
    <>
      <Page>
        <header>
          <h2>
            React Minesweeper
            <a href="https://github.com/hhow09/minesweeper" target="_blank" rel="noreferrer">
              <img src={githubLogo} width="20px" style={{ marginLeft: "15px" }} alt="github" />
            </a>
          </h2>
        </header>
        <section style={configStyle}>
          <label style={labelStyle}>
            <strong>Configuration</strong>
          </label>
          <label style={labelStyle}>
            Board Width
            <input
              placeholder="Board Width"
              value={boardWidth}
              type="number"
              disabled={started}
              min={1}
              onChange={(e) => {
                setBoardWidth(parseInt(e.target.value));
              }}
            />
          </label>
          <label style={labelStyle}>
            Board Height
            <input
              value={boardHeight}
              type="number"
              disabled={started}
              min={1}
              onChange={(e) => {
                setBoardHeight(parseInt(e.target.value));
              }}
            />
          </label>
          <label style={labelStyle}>
            Bomb Probability
            <input
              value={bombProbability}
              type="number"
              disabled={started}
              min={0.1}
              max={1}
              onChange={(e) => {
                setBombProbability(parseFloat(e.target.value) || 0);
              }}
            />
          </label>
          <label style={labelStyle}>
            Show Log
            <input
              checked={showLog}
              type="checkbox"
              onChange={() => {
                setShowLog((prev) => !prev);
              }}
            />
          </label>
          <label style={labelStyle}> (check Devtools console panel)</label>
          <button
            onClick={() => {
              if (started) {
                setStarted(false);
              } else {
                setStarted(true);
                setRound((prev) => ++prev);
              }
            }}
            disabled={!validBoardConfig}>
            {started ? "STOP" : "START"}
          </button>
        </section>
        <section style={boardStyle}>{BoardMemo}</section>
      </Page>
    </>
  );
}

export default App;
