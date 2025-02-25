import { InputHTMLAttributes, memo } from "react";
export interface ICustomInputProps {
  label: string;
  value: string;
  props?: InputHTMLAttributes<HTMLInputElement>;
  color?: string;
}

const CustomInput = ({
  label,
  props,
  value,
  color,
}: ICustomInputProps & React.PropsWithChildren) => {
  return (
    <div className="inputContainer">
      <div className="inputLabel">{label}</div>
      <div className="inputWrapper" style={{ background: color }}>
        <input {...props} value={value} />
      </div>
    </div>
  );
};

export default memo(CustomInput);
