import { memo, useState } from "react";
import styles from "./styles.module.scss";
import useEvoGamingAsset from "hooks/useEvoGamingAsset";
import { getProviderGamePath } from "utils/index";

const Accordion = ({ children }: React.PropsWithChildren) => {
  // const { getAsset } = useEvoGamingAsset();

  const [isRotated, setIsRotated] = useState<boolean>(false);
  return (
    <div className={styles.accordionContainer} data-open={isRotated}>
      <button
        className={styles.accordionButton}
        data-open={isRotated}
        onClick={() => setIsRotated(prev => !prev)}
      >
        <div className={styles.accordionButtonText}>Provably Fair</div>
        <div
          className={styles.accordionRotateButton}
          style={isRotated ? { transform: "rotate(180deg)" } : {}}
        >
          <img src={getProviderGamePath("images", "arrow-icon.svg")} />
        </div>
      </button>

      <div className={styles.accordionPanel} data-open={isRotated}>
        <div className={styles.accordionPanelContent} data-open={isRotated}>
          <div className={styles.accordionPanelBody}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Accordion);
