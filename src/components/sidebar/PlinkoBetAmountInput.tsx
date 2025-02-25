import usePlinkoAudioContext from "hooks/useAudioContext";
import { memo, useCallback, useMemo } from "react";
import { BetModification } from "types/index";
import BetAmountInput from "../bet-input";
import { gameInfo } from "src/constants/game-info";

interface PlinkoBetAmountInputProps {
  isDisabled: boolean;
  canMakeBet: boolean;
  bet: {
    value: number;
    setValue: (bet: BetModification) => void;
  };
}

const inputSetters: BetModification[] = ["1/2", "x2", "Max"];
const PlinkoBetAmountInput: React.FC<PlinkoBetAmountInputProps> = ({
  isDisabled,
  canMakeBet,
  bet,
}: PlinkoBetAmountInputProps) => {
  const { playClickSound } = usePlinkoAudioContext();
  const onInputButtonClick = useCallback(
    (value: BetModification) => {
      playClickSound();
      bet.setValue(value);
    },
    [playClickSound, bet],
  );
  const inputButtons = useMemo(() => {
    return (
      <div className="inputButtons">
        {inputSetters.map(value => (
          <button
            className="inputButton"
            key={value}
            disabled={isDisabled}
            onClick={() => onInputButtonClick(value)}
          >
            {value}
          </button>
        ))}
      </div>
    );
  }, [isDisabled, onInputButtonClick]);

  return (
    <BetAmountInput
      props={{ disabled: isDisabled }}
      stateValue={bet.value}
      onValueChange={bet.setValue}
      maxDecimals={gameInfo.maxDecimals}
      inError={!canMakeBet}
      min={gameInfo.minBet}
      max={gameInfo.maxBet}
    >
      {inputButtons}
    </BetAmountInput>
  );
};

export default memo(PlinkoBetAmountInput);
