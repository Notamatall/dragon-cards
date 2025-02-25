import React, { PropsWithChildren, useMemo, useRef, useState } from "react";

import { useResourcesContext } from "hooks/useResourcesContext";
import Loader from "src/components/loader";
import { LOADER_MAX_PERCENT } from "types/constants";

const LoaderContext = React.createContext({});

const LoaderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [delay, setDelay] = useState(false);
  const { isLoadingResources } = useResourcesContext();
  const loaderDelayTimeout = useRef<number | null>(null);

  const loaderValues = useMemo(() => {
    return [!isLoadingResources];
  }, [isLoadingResources]);

  if (isLoadingResources || !delay) {
    const finishedProcessesCount = loaderValues.reduce<number>((sum, value) => {
      sum += +value;
      return sum;
    }, 0);
    const progressPercent = finishedProcessesCount * (LOADER_MAX_PERCENT / loaderValues.length);
    if (progressPercent === LOADER_MAX_PERCENT && loaderDelayTimeout.current === null) {
      loaderDelayTimeout.current = setTimeout(() => {
        setDelay(true);
      }, 1500);
    }

    return <Loader progressValue={progressPercent} />;
  }

  return <LoaderContext.Provider value={{}}>{children}</LoaderContext.Provider>;
};

export default LoaderProvider;
