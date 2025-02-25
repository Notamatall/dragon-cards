import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { LoadingActions } from "types/constants";
import { getProviderGamePath, loadImageAsync } from "utils/index";
import React from "react";
import ResourcesContext from "src/contexts/resourcesContext";

const ResourcesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [loadingQueue, setLoadingQueue] = useState<LoadingActions[]>([
    LoadingActions.DRAGON_CARDS,
    LoadingActions.CACHING_IMAGES,
  ]);

  const pushLoadingAction = useCallback((action: LoadingActions) => {
    setLoadingQueue(prev => (prev.includes(action) ? prev : [...prev, action]));
  }, []);

  const popLoadingAction = useCallback((action: LoadingActions) => {
    setLoadingQueue(prev => prev.filter(actionName => actionName !== action));
  }, []);

  useEffect(() => {
    async function loadAnimations() {
      try {
        const images = [
          "backface.png",
          "earth-dragon.png",
          "empty-card.png",
          "fire-dragon.png",
          "frost-dragon.png",
          "shadow-dragon.png",
          "storm-dragon.png",
        ];

        const fetchPromises = images.map(image =>
          loadImageAsync(getProviderGamePath("cards", image)),
        );
        const loadedImages = await Promise.all(fetchPromises);
        console.log(loadedImages);
      } catch (error) {
        console.error("Error loading dragon cards:", error);
      } finally {
        console.log("pop");
        popLoadingAction(LoadingActions.DRAGON_CARDS);
      }
    }

    loadAnimations();
  }, [popLoadingAction, pushLoadingAction]);

  useEffect(() => {
    async function loadImages() {
      try {
        await Promise.all([
          loadImageAsync(getProviderGamePath("images", "infinity.svg")),
          loadImageAsync(getProviderGamePath("images", "sound-off.svg")),
          loadImageAsync(getProviderGamePath("images", "sound-on.svg")),
        ]);
      } catch (error) {
        console.error("Error loading CACHING_IMAGES", error);
      } finally {
        console.log("pop");

        popLoadingAction(LoadingActions.CACHING_IMAGES);
      }
    }

    loadImages();
  }, [popLoadingAction, pushLoadingAction]);

  const isLoadingResources = useMemo(() => {
    return loadingQueue.length !== 0;
  }, [loadingQueue]);

  return (
    <ResourcesContext.Provider
      value={{
        isLoadingResources,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  );
};

export default ResourcesProvider;
