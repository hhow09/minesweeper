import { memo } from "react";
import "assests/cell.css";
import bombPic from "assests/bomb.png";
import flagPic from "assests/flag.png";

import PropTypes from "prop-types";

const areEqual = (prevProps, nextProps) => {
  if (
    prevProps.opened === nextProps.opened &&
    prevProps.isBomb === nextProps.isBomb &&
    prevProps.adjBombNum === nextProps.adjBombNum &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.handleRightClick === nextProps.handleRightClick &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.flagged === nextProps.flagged &&
    prevProps.backgroundColor === nextProps.backgroundColor
  )
    return true;
  else return false;
};

const Cell = ({
  opened,
  isBomb,
  adjBombNum,
  onClick,
  row,
  col,
  handleRightClick,
  disabled,
  flagged,
  backgroundColor,
}) => {
  return (
    <div
      className={`cell ${opened && "opened"}`}
      onClick={
        !disabled
          ? (e) => {
              onClick(row, col);
            }
          : () => null
      }
      onContextMenu={!disabled ? (e) => handleRightClick(row, col, e) : () => null}
      style={{ backgroundColor }}>
      {opened ? (
        isBomb ? (
          <img src={bombPic} width="100%" alt="mine" />
        ) : (
          adjBombNum > 0 && <span className={`bombNum_${adjBombNum}`}>{adjBombNum}</span>
        )
      ) : flagged ? (
        <img src={flagPic} width="100%" alt="flag" />
      ) : null}
    </div>
  );
};

Cell.propTypes = {
  opened: PropTypes.bool.isRequired,
  isBomb: PropTypes.bool.isRequired,
  adjBombNum: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  flagged: PropTypes.bool,
};

export default memo(Cell, areEqual);
