import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import PlinkoAudioContext from "src/contexts/audioContext";
import { LS_KEYS } from "types/constants";
import { Howl } from "howler";
import { getProviderGamePath } from "utils/index";

const PlinkoAudioProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isSoundEnabled, setSoundEnabled] = useLocalStorage(LS_KEYS.SOUND, true);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const soundController = useMemo(() => {
    return {
      toggle: () => setSoundEnabled(prev => !prev),
      mute: () => setSoundEnabled(false),
      unmute: () => setSoundEnabled(true),
    };
  }, [setSoundEnabled]);

  const betAudio = useRef<Howl | null>(null);
  const resultAudio = useRef<Howl | null>(null);
  const clickAudio = useRef<Howl | null>(null);

  useEffect(() => {
    betAudio.current = new Howl({
      src: [getProviderGamePath("audio", "bet.mp3")],
      html5: isMobile,
      volume: 0.8,
    });

    resultAudio.current = new Howl({
      src: [getProviderGamePath("audio", "result.mp3")],
      html5: isMobile,
      volume: 0.8,
    });

    clickAudio.current = new Howl({
      src: [getProviderGamePath("audio", "click.wav")],
      html5: isMobile,
      volume: 1,
    });

    return () => {
      betAudio.current?.unload();
      resultAudio.current?.unload();
      clickAudio.current?.unload();
    };
  }, [isMobile]);

  useEffect(() => {
    betAudio.current?.mute(!isSoundEnabled);
    resultAudio.current?.mute(!isSoundEnabled);
    clickAudio.current?.mute(!isSoundEnabled);
  }, [isSoundEnabled]);

  const playMultiplierSound = useCallback(() => {
    resultAudio.current?.play();
  }, []);

  const playDropSound = useCallback(() => {
    betAudio.current?.play();
  }, []);

  const playClickSound = useCallback(() => {
    clickAudio.current?.play();
  }, []);

  return (
    <PlinkoAudioContext.Provider
      value={{
        playDropSound,
        playMultiplierSound,
        playClickSound,
        soundController,
      }}
    >
      {children}
    </PlinkoAudioContext.Provider>
  );
};

export default PlinkoAudioProvider;
