import AudioContext from "contexts/audioContext";
import React from "react";

function useAudioContext() {
  const context = React.useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within a AudioContext");
  }
  return context;
}
export default useAudioContext;
