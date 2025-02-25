import { memo, useState } from "react";
import styles from "./styles.module.scss";
import { getProviderGamePath } from "utils/index";

interface CopyButtonComponentProps {
  copyValue: string;
}

const CopyButton = ({ copyValue }: CopyButtonComponentProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onCopyClick = async () => {
    if (!isCopied) {
      await navigator.clipboard.writeText(copyValue);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    }
  };

  return (
    <div className={styles.copyButtonContainer}>
      {isCopied ? (
        <span> Copied </span>
      ) : (
        <img
          onClick={e => {
            e.stopPropagation();
            onCopyClick();
          }}
          src={getProviderGamePath("images", "copy.svg")}
          className={styles.copyIcon}
          alt="copy"
          width={20}
          height={20}
        />
      )}
    </div>
  );
};

export default memo(CopyButton);
