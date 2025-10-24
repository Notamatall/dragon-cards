import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { LoadingActions } from "types/constants";
import { getProviderGamePath, loadImageAsync } from "utils/index";
import React from "react";
import ResourcesContext from "src/contexts/resourcesContext";
import { Asset } from "types/index";

const ResourcesProvider: React.FC<{ assets: Asset[] } & PropsWithChildren> = ({
  assets,
  children,
}) => {
  const [loadingQueue, setLoadingQueue] = useState<LoadingActions[]>([
    LoadingActions.DRAGON_CARDS,
    LoadingActions.CACHING_IMAGES,
  ]);

  const [filesLoaded, setFilesLoaded] = useState(0);

  const pushLoadingAction = useCallback((action: LoadingActions) => {
    setLoadingQueue(prev => (prev.includes(action) ? prev : [...prev, action]));
  }, []);

  const popLoadingAction = useCallback((action: LoadingActions) => {
    setLoadingQueue(prev => prev.filter(actionName => actionName !== action));
  }, []);

  useEffect(() => {
    async function loadAnimations() {
      try {
        const fetchPromises = assets.map(image =>
          loadImageAsync(getProviderGamePath(image.folderName, image.fileName)).then(() =>
            setFilesLoaded(prev => prev + 1),
          ),
        );
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("Error loading dragon cards:", error);
      } finally {
        popLoadingAction(LoadingActions.DRAGON_CARDS);
      }
    }

    loadAnimations();
  }, [assets, popLoadingAction, pushLoadingAction]);

  // useEffect(() => {
  //   async function loadImages() {
  //     try {

  //         loadImageAsync(getProviderGamePath("images", "infinity.svg")),
  //         loadImageAsync(getProviderGamePath("images", "sound-off.svg")),
  //         loadImageAsync(getProviderGamePath("images", "sound-on.svg")),
  //     } catch (error) {
  //       console.error("Error loading CACHING_IMAGES", error);
  //     } finally {
  //       popLoadingAction(LoadingActions.CACHING_IMAGES);
  //     }
  //   }

  //   loadImages();
  // }, [popLoadingAction, pushLoadingAction]);

  const isLoadingResources = useMemo(() => {
    return loadingQueue.length !== 0;
  }, [loadingQueue]);

  const loadingProgress = useMemo(() => {
    console.log(filesLoaded);
    return Math.ceil((filesLoaded / assets.length) * 100);
  }, [assets, filesLoaded]);

  return (
    <ResourcesContext.Provider
      value={{
        isLoadingResources,
        loadingProgress,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  );
};

export default ResourcesProvider;
