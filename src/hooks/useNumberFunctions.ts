import { useCallback } from "react";
import { gameInfo } from "src/constants/game-info";

function useNumberFunctions() {
  const normalizeBetSize = useCallback((value: number): number => {
    const normalizedValue =
      value < gameInfo.minBet ? gameInfo.minBet : value > gameInfo.maxBet ? gameInfo.maxBet : value;
    return Math.floor(normalizedValue * 100) / 100;
  }, []);
  return { normalizeBetSize };
}

export default useNumberFunctions;
