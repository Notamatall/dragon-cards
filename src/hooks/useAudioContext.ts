import React from "react";
import PlinkoAudioContext from "src/contexts/audioContext";

function usePlinkoAudioContext() {
  const context = React.useContext(PlinkoAudioContext);
  if (context === undefined) {
    throw new Error("usePlinkoAudioContext must be used within a PlinkoAudioContext");
  }
  return context;
}
export default usePlinkoAudioContext;
