declare module "react-range-slider-input" {
  import { FC } from "react";

  interface RangeSliderInputProps {
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    defaultValue?: number[];
    onInput?: (values: [num1: number, num2: number]) => void;
    disabled?: boolean;
    thumbsDisabled: boolean[];
    rangeSlideDisabled: boolean;
  }

  const RangeSliderInput: FC<RangeSliderInputProps>;
  export default RangeSliderInput;
}
