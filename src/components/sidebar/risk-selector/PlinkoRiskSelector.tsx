import { memo, useCallback } from "react";
import { RISK_LIST } from "types/dragon-card/constants";
import { GenericState } from "types/index";
import styles from "./styles.module.scss";
import usePlinkoAudioContext from "hooks/useAudioContext";
import { DragonCardRiskType } from "types/dragon-card";

interface PlinkoRiskSelectorProps {
  isDisabled: boolean;
  risk: GenericState<DragonCardRiskType>;
}
const PlinkoRiskSelector: React.FC<PlinkoRiskSelectorProps> = ({ isDisabled, risk }) => {
  const { playClickSound } = usePlinkoAudioContext();

  const handleClick = useCallback(
    (value: DragonCardRiskType) => () => {
      playClickSound();
      risk.setValue(value);
    },
    [playClickSound, risk],
  );

  return (
    <div className="inputContainer" style={{ order: "2" }}>
      <div className="inputLabel">Risk</div>
      <div className={styles.riskButtons}>
        {RISK_LIST.map((value, index) => (
          <button
            key={`risk-${index}`}
            className={styles.riskButton}
            disabled={isDisabled || risk.value === value}
            data-active={risk.value === value}
            onClick={handleClick(value)}
          >
            {value.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(PlinkoRiskSelector);
