import { memo } from "react";
import { ButtonSize, ButtonStyle } from "types/button";

interface ButtonProps {
  label: string;
  attributes: React.ButtonHTMLAttributes<HTMLButtonElement>;
  style?: ButtonStyle;
  size?: ButtonSize;
  adaptiveOrder?: boolean;
}

const Button = ({
  label,
  attributes,
  style = "primary",
  size = "md",
  adaptiveOrder = false,
}: ButtonProps) => {
  return (
    <button
      className="plinkoButton"
      data-size={size}
      data-style={style}
      data-adaptive-order={adaptiveOrder}
      {...attributes}
    >
      {label}
    </button>
  );
};

export default memo(Button);
