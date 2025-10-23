import React from "react";
import { AudioKey } from "src/providers/audio-provider";

interface IAudioContext {
  playSound: (audioKey: AudioKey) => number;

  soundController: {
    toggle: () => void;
    mute: () => void;
    unmute: () => void;
  };
}

const defaultValue: IAudioContext = {
  playSound: () => 0,
  soundController: {
    toggle: () => {},
    mute: () => {},
    unmute: () => {},
  },
};

const AudioContext = React.createContext<IAudioContext>(defaultValue);

export default AudioContext;
