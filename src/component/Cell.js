import "assests/cell.css";
const Cell = ({ opened, isBomb, adjBombNum, onClick }) => (
  <div className={`cell ${opened && "opened"}`} onClick={onClick}>
    {opened ? (isBomb ? "B" : adjBombNum) : null}
  </div>
);

export default Cell;
