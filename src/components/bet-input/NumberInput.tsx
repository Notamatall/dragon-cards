import { ChangeEvent, InputHTMLAttributes, memo, useCallback, useEffect, useState } from "react";

export interface INumberInputProps {
  props?: InputHTMLAttributes<HTMLInputElement>;
  min: number;
  max: number;
  stateValue: number;
  maxDecimals: number;
  onValueChange: (value: number) => void;
  getValueOnBlur?: (parsedValue: number, min: number, max: number) => number;
}

const NumberInput = ({
  stateValue,
  props,
  min,
  max,
  maxDecimals,
  onValueChange,
  getValueOnBlur,
}: React.PropsWithChildren & INumberInputProps) => {
  const [displayedValue, setDisplayedValue] = useState<string>(stateValue.toString());

  useEffect(() => {
    const displayValueNumber = Number(displayedValue);
    if (!isNaN(displayValueNumber) && stateValue !== displayValueNumber) {
      setDisplayedValue(stateValue.toFixed(maxDecimals));
    }
  }, [displayedValue, maxDecimals, stateValue]);

  const normalizeDisplayValue = useCallback(
    (value: string) => {
      const numberValue = Number.parseFloat(value);
      const validValue = numberValue > max ? max : value;
      return validValue.toString();
    },
    [max],
  );

  const isValidFirstCharacter = useCallback((value: string) => {
    return (value.length > 1 && value[0] === "0" && value[1] !== ".") === false;
  }, []);

  const onInputValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const regex = new RegExp(`^-?\\d*\\.?\\d{0,${maxDecimals}}$`);

      let { value } = event.target;
      if (!isValidFirstCharacter(value)) value = value.slice(1);
      if (regex.test(value)) {
        const normalizedValue = normalizeDisplayValue(value);
        const parsedValue = Number(normalizedValue);
        setDisplayedValue(normalizedValue);
        if (!isNaN(parsedValue)) {
          onValueChange(parsedValue);
        }
      }
    },
    [isValidFirstCharacter, maxDecimals, normalizeDisplayValue, onValueChange],
  );

  const onBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      let parsedNumber = Number.parseFloat(value);
      parsedNumber = getValueOnBlur
        ? getValueOnBlur(parsedNumber, min, max)
        : isNaN(parsedNumber)
          ? min
          : parsedNumber;
      const valueOnBlur = parsedNumber < min ? min : stateValue > max ? max : parsedNumber;
      onValueChange(valueOnBlur);
      setDisplayedValue(valueOnBlur.toFixed(maxDecimals));
    },
    [getValueOnBlur, max, maxDecimals, min, onValueChange, stateValue],
  );

  return (
    <input
      placeholder={Number(0).toFixed(maxDecimals)}
      value={displayedValue}
      min={min}
      max={max}
      autoComplete="off"
      onChange={onInputValueChange}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default memo(NumberInput);
