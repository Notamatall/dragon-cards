import { Dispatch, memo, SetStateAction, useCallback, useMemo } from "react";
import styles from "./styles.module.scss";
import usePlinkoAudioContext from "hooks/useAudioContext";
import { getProviderGamePath } from "utils/index";

interface PlinkoNumberOfBetsInputProps {
  isAutobetActive: boolean;
  autobetState: [number, Dispatch<SetStateAction<number>>];
}

const PlinkoNumberOfBetsInput: React.FC<PlinkoNumberOfBetsInputProps> = ({
  isAutobetActive,
  autobetState: [state, setter],
}: PlinkoNumberOfBetsInputProps) => {
  const { playClickSound } = usePlinkoAudioContext();
  const inputButtonStyle = useMemo(
    () => (state > 0 ? { border: "1px solid #fff" } : undefined),
    [state],
  );
  const handleInfinityClick = useCallback(() => {
    playClickSound();
    setter(0);
  }, [playClickSound, setter]);

  return (
    <div className="inputContainer" style={{ order: "2" }}>
      <div className="inputLabel">Number of bets</div>
      <div className="inputWrapper">
        <input
          type="number"
          disabled={isAutobetActive}
          value={state.toString()}
          onChange={e => {
            const value = e.target.value;
            setter(+value);
          }}
          onBlur={e => {
            const value = e.target.value;
            if (value === "") {
              setter(0);
            }
          }}
        />

        <div className="inputButtons">
          <button
            disabled={isAutobetActive || state === 0}
            className={styles.infinityBtn}
            onClick={handleInfinityClick}
            style={inputButtonStyle}
          >
            <img src={getProviderGamePath("images", "infinity.svg")} width={18} height={19} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PlinkoNumberOfBetsInput);
