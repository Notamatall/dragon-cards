import React from "react";
import DragonCardContext from "src/contexts/dragonCardContext";

export function useDragonCardContext() {
  const context = React.useContext(DragonCardContext);
  if (context === undefined) {
    throw new Error("usePlinkoContext must be used within a PlinkoContext");
  }
  return context;
}
