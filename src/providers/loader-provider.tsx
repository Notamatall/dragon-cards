import React, { PropsWithChildren } from "react";

import { useResourcesContext } from "hooks/useResourcesContext";
import Loader from "src/components/loader";
import { LOADER_MAX_PERCENT } from "types/constants";

const LoaderContext = React.createContext({});

const LoaderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loadingProgress } = useResourcesContext();
  console.log(loadingProgress);
  if (loadingProgress !== LOADER_MAX_PERCENT) {
    return <Loader progressValue={loadingProgress} />;
  }

  return <LoaderContext.Provider value={{}}>{children}</LoaderContext.Provider>;
};

export default LoaderProvider;
