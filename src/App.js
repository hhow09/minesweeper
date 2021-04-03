import Board from "component/Board";
import { useState } from "react";
const pageStyle = { display: "flex", flexDirection: "column", alignItems: "center" };

const configStyle = { display: "flex", flexDirection: "column", marginBottom: "20px" };
const labelStyle = { display: "flex", justifyContent: "space-between", marginBottom: "5px" };

const Page = ({ title, children }) => (
  <div style={pageStyle}>
    <h1>{title}</h1>
    {children}
  </div>
);

function App() {
  const [boardWidth, setBoardWidth] = useState(10);
  const [boardHeight, setBoardHeight] = useState(10);
  const [showLog, setShowLog] = useState(false);

  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(1);

  const handleEndGame = (win) => {
    if (win) alert("You win");
    else alert("You Loose");
    setStarted(false);
  };
  return (
    <div>
      <Page>
        <div style={configStyle}>
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
            Show Log
            <input
              checked={showLog}
              type="checkbox"
              onChange={() => {
                setShowLog((prev) => !prev);
              }}
            />
          </label>
          <button
            onClick={() => {
              if (started) {
                setStarted(false);
              } else {
                setStarted(true);
                setRound((prev) => ++prev);
              }
            }}>
            {started ? "STOP" : "START"}
          </button>
        </div>
        <Board
          key={round}
          width={boardWidth}
          height={boardHeight}
          endGameCallback={handleEndGame}
          disabled={!started}
          showLog={showLog}
        />
      </Page>
    </div>
  );
}

export default App;
