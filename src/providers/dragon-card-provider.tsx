import React, { PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";

import { BetModification, GenericState } from "types/index";
import { DEFAULT_RISK } from "types/dragon-card/constants";
import useNumberFunctions from "hooks/useNumberFunctions";
import { gameInfo } from "src/constants/game-info";
import { DragonCardRiskType } from "types/dragon-card";
import DragonCardContext from "contexts/dragonCardContext";

const DragonCardProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [risk, setRisk] = useState<DragonCardRiskType>(DEFAULT_RISK);

  const [betValue, setBet] = useState<number>(gameInfo.minBet);
  const [localBalance, setLocalBalance] = useState<number>(gameInfo.balance);
  const { normalizeBetSize } = useNumberFunctions();
  const localBalanceRef = useRef(gameInfo.balance);

  const addToBalance = useCallback((value: number) => {
    const newValue = localBalanceRef.current + value;
    const flooredValue = Math.floor(newValue * 100) / 100;
    localBalanceRef.current = flooredValue;
    setLocalBalance(flooredValue);
  }, []);

  const onBet = useCallback(
    async (bet: BetModification) => {
      if (typeof bet === "string") {
        switch (bet) {
          case "1/2":
            return setBet(prev => normalizeBetSize(prev / 2));
          case "x2":
            return setBet(prev => normalizeBetSize(prev * 2));
          case "Max": {
            return setBet(normalizeBetSize(localBalanceRef.current));
          }
        }
      } else {
        setBet(bet);
      }
    },
    [normalizeBetSize],
  );

  const betInfo = useMemo(() => {
    return {
      bet: {
        value: betValue,
        setValue: onBet,
      },
    };
  }, [betValue, onBet]);

  const riskInfo = useMemo(() => {
    return {
      risk: {
        value: risk,
        setValue: setRisk,
      } as GenericState<DragonCardRiskType>,
    };
  }, [risk]);

  const localBalanceInfo = useMemo(() => {
    return {
      localBalance: {
        ref: localBalanceRef,
        value: localBalance.toFixed(2),
        setValue: setLocalBalance,
        addToBalance,
      },
    };
  }, [localBalance, addToBalance]);

  return (
    <DragonCardContext.Provider
      value={{
        ...betInfo,
        ...riskInfo,
        ...localBalanceInfo,
      }}
    >
      <>{children}</>
    </DragonCardContext.Provider>
  );
};

export default DragonCardProvider;
