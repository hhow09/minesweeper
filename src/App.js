import Board from "component/Board";
import { useState } from "react";
const Page = ({ title, children }) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);

function App() {
  const [boardWidth, setBoardWidth] = useState(10);
  const [boardHeight, setBoardHeight] = useState(10);

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
        <div>
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
          <input
            placeholder="Board Height"
            value={boardHeight}
            type="number"
            disabled={started}
            min={1}
            onChange={(e) => {
              setBoardHeight(parseInt(e.target.value));
            }}
          />
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
        />
      </Page>
    </div>
  );
}

export default App;
