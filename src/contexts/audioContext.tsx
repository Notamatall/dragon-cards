import React from "react";

interface IAudioContext {
  playDropSound: () => void;
  playMultiplierSound: () => void;
  playClickSound: () => void;
  soundController: {
    toggle: () => void;
    mute: () => void;
    unmute: () => void;
  };
}

const defaultValue: IAudioContext = {
  playDropSound: () => {},
  playMultiplierSound: () => {},
  playClickSound: () => {},
  soundController: {
    toggle: () => {},
    mute: () => {},
    unmute: () => {},
  },
};

const AudioContext = React.createContext<IAudioContext>(defaultValue);

export default AudioContext;
