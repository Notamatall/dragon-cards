import React from "react";
import ResourcesContext from "src/contexts/resourcesContext";

export function useResourcesContext() {
  const context = React.useContext(ResourcesContext);
  if (context === undefined) {
    throw new Error("useResourcesContext must be used within a ResourcesContext");
  }
  return context;
}
