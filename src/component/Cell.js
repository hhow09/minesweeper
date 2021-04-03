import "assests/cell.css";
import bombPic from "assests/bomb.png";
import flagPic from "assests/flag.png";

import PropTypes from "prop-types";

const Cell = ({ opened, isBomb, adjBombNum, onClick, disabled, flagged }) => (
  <div className={`cell ${opened && "opened"}`} onClick={!disabled ? onClick : () => null}>
    {opened ? (
      isBomb ? (
        <img src={bombPic} width="100%" />
      ) : (
        adjBombNum > 0 && <span className={`bombNum_${adjBombNum}`}>{adjBombNum}</span>
      )
    ) : flagged ? (
      <img src={flagPic} width="100%" />
    ) : null}
  </div>
);

Cell.propTypes = {
  opened: PropTypes.bool.isRequired,
  isBomb: PropTypes.bool.isRequired,
  adjBombNum: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  flagged: PropTypes.bool,
};

export default Cell;
