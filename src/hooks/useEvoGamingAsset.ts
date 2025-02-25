import { useCallback } from "react";
import { AssetType } from "types/index";
import { getProviderGamePath } from "utils/index";

function useEvoGamingAsset() {
  const getAsset = useCallback((assetType: AssetType, fileName: string) => {
    return getProviderGamePath(assetType, fileName);
  }, []);
  return { getAsset };
}

export default useEvoGamingAsset;
