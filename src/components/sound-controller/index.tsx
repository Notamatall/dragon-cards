import styles from "./styles.module.scss";
import { useLocalStorage } from "usehooks-ts";
import React, { memo, useMemo } from "react";
import usePlinkoAudioContext from "hooks/useAudioContext";
import { LS_KEYS } from "types/constants";
import { getProviderGamePath } from "utils/index";

const SoundController = React.memo((): React.ReactElement | null => {
  const { soundController } = usePlinkoAudioContext();

  const [isSoundEnabled] = useLocalStorage(LS_KEYS.SOUND, true);

  const iconSrc = useMemo(() => {
    return isSoundEnabled
      ? getProviderGamePath("images", "sound-on.svg")
      : getProviderGamePath("images", "sound-off.svg");
  }, [isSoundEnabled]);

  return (
    <button className={styles.muteButton} onClick={() => soundController.toggle()}>
      {<img alt="sound" src={iconSrc} height={25} width={25} />}
    </button>
  );
});

export default memo(SoundController);
