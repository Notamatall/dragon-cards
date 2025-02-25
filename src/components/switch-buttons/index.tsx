import { ISwitchButton } from "types/switch-buttons";
import styles from "./styles.module.scss";

interface SwitchButtonsProps {
  buttons: ISwitchButton[];
  changeOrderInMobile?: boolean;
}

const SwitchButtons = ({ buttons, changeOrderInMobile = false }: SwitchButtonsProps) => {
  return (
    <div className={styles.plinkoSwitchButtons} data-order={changeOrderInMobile}>
      {buttons.map((button, index) => (
        <button
          key={`${index}-${button.label}`}
          className={button.isActive ? styles.plinkoSwitchButtonActive : styles.plinkoSwitchButton}
          disabled={button.disabled}
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};
export default SwitchButtons;
