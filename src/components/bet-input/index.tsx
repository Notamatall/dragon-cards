import NumberInput, { INumberInputProps } from "./NumberInput";
import styles from "./styles.module.scss";
export interface IBetAmountInputProps extends INumberInputProps {
  inError?: boolean;
  label?: string;
}

const BetAmountInput = ({
  props,
  stateValue,
  inError,
  onValueChange,
  children,
  min,
  max,
  maxDecimals,
  label = "Bet Amount",
}: IBetAmountInputProps & React.PropsWithChildren) => {
  return (
    <div className="inputContainer">
      <div className="inputLabel">{label}</div>
      <div className={styles.betInputLabelContainer}>
        <span className={styles.betInputMaxBet}>Max bet: {max.toFixed(maxDecimals)}</span>
        <span className={styles.betInputCurrency}> $</span>
      </div>
      <div
        data-in-error={inError}
        className="inputWrapper"
        data-error-text={`Can't bet more than your balance`}
      >
        <NumberInput
          props={{ ...props, id: "bet-amount-input" }}
          stateValue={stateValue}
          maxDecimals={maxDecimals}
          onValueChange={onValueChange}
          min={min}
          max={max}
        />
        {children}
      </div>
    </div>
  );
};

export default BetAmountInput;
