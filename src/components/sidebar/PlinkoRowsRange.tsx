import { memo } from "react";
import { PlinkoRows } from "types/dragon-card";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./range-slider.css";

interface PlinkoRowsRangeProps {
  isDisabled: boolean;
  rowsCount: {
    value: PlinkoRows;
    setValue: (rowsCount: PlinkoRows) => void;
  };
}

const PlinkoRowsRange: React.FC<PlinkoRowsRangeProps> = memo(
  ({ isDisabled, rowsCount }): React.ReactElement => {
    return (
      <div className="inputContainer" style={{ order: "2" }}>
        <div className="inputLabel">Rows</div>
        <div className="inputLabel">{rowsCount.value}</div>
        <RangeSlider
          className={"single-thumb"}
          min={PlinkoRows.EIGHT}
          max={PlinkoRows.SIXTEEN}
          defaultValue={[PlinkoRows.EIGHT, rowsCount.value]}
          onInput={e => {
            rowsCount.setValue(e[1]);
          }}
          thumbsDisabled={[true, false]}
          rangeSlideDisabled={true}
          disabled={isDisabled}
        />
      </div>
    );
  },
);

export default PlinkoRowsRange;
