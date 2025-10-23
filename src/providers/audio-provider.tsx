import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { LS_KEYS } from "types/constants";
import { Howl } from "howler";
import { getProviderGamePath } from "utils/index";
import AudioContext from "contexts/audioContext";

const getAudioList = (isMobile: boolean) => ({
  bet: new Howl({
    src: [getProviderGamePath("audio", "bet.mp3")],
    html5: isMobile,
    volume: 0.8,
  }),
  result: new Howl({
    src: [getProviderGamePath("audio", "result.mp3")],
    html5: isMobile,
    volume: 0.8,
  }),
  click: new Howl({
    src: [getProviderGamePath("audio", "click.wav")],
    html5: isMobile,
    volume: 1,
  }),
  reveal: new Howl({
    src: [getProviderGamePath("audio", "reveal.mp3")],
    html5: isMobile,
    volume: 1,
  }),
  cardFlip: new Howl({
    src: [getProviderGamePath("audio", "card-flip.mp3")],
    html5: isMobile,
    volume: 1,
    rate: 6,
  }),
  reward: new Howl({
    src: [getProviderGamePath("audio", "reward.mp3")],
    html5: isMobile,
    volume: 1,
    rate: 2.5,
  }),
});

export type AudioKey = keyof ReturnType<typeof getAudioList>;

const AudioProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isSoundEnabled, setSoundEnabled] = useLocalStorage(LS_KEYS.SOUND, true);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const soundController = useMemo(() => {
    return {
      toggle: () => setSoundEnabled(prev => !prev),
      mute: () => setSoundEnabled(false),
      unmute: () => setSoundEnabled(true),
    };
  }, [setSoundEnabled]);

  const audioList = useRef<Record<AudioKey, Howl>>(getAudioList(isMobile));

  useEffect(() => {
    audioList.current = getAudioList(isMobile);
    return () => {
      Object.values(audioList.current).forEach(howl => howl.unload());
    };
  }, [isMobile]);

  useEffect(() => {
    Object.values(audioList.current).forEach(howl => howl.mute(!isSoundEnabled));
  }, [isSoundEnabled]);

  const playSound = useCallback((soundKey: AudioKey) => {
    return audioList.current[soundKey].play();
  }, []);

  return (
    <AudioContext.Provider
      value={{
        playSound,
        soundController,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
