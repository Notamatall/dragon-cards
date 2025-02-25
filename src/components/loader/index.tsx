import styles from "./styles.module.scss";
import { useMemo } from "react";
import { LOADER_MAX_PERCENT } from "types/constants";
import { getProviderGamePath } from "utils/index";
interface ILoaderProps {
  progressValue: number;
}
const Loader = ({ progressValue }: ILoaderProps) => {
  const progressIndicatorWidth = useMemo(
    () => (progressValue <= LOADER_MAX_PERCENT ? progressValue : LOADER_MAX_PERCENT),
    [progressValue],
  );
  return (
    <div className={styles.loaderContainer}>
      <img
        src={getProviderGamePath("images", "evo-gaming-logo.svg")}
        alt="Evo Gaming"
        width={272}
        height={42}
      />
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarIndicator} />
        <div
          className={styles.progressBarIndicatorValue}
          style={{ width: `${progressIndicatorWidth}%` }}
        />
      </div>
    </div>
  );
};

export default Loader;
