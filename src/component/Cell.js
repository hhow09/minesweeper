import "assests/cell.css";
import PropTypes from "prop-types";

const Cell = ({ opened, isBomb, adjBombNum, onClick }) => (
  <div className={`cell ${opened && "opened"}`} onClick={onClick}>
    {opened ? (isBomb ? "B" : adjBombNum) : null}
  </div>
);

Cell.propTypes = {
  opened: PropTypes.bool.isRequired,
  isBomb: PropTypes.bool.isRequired,
  adjBombNum: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Cell;
