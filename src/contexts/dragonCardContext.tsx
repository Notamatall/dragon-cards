import React, { Dispatch, SetStateAction, RefObject } from "react";
import { DragonCardRiskType } from "types/dragon-card";
import {
  DEFAULT_BET_VALUE,
  DEFAULT_RISK,
  DEFAULT_LOCAL_BALANCE,
} from "types/dragon-card/constants";
import { BetModification, GenericState } from "types/index";

interface IDragonCardContext {
  bet: {
    value: number;
    setValue: (bet: BetModification) => void;
  };
  risk: GenericState<DragonCardRiskType>;

  localBalance: {
    ref: RefObject<number>;
    value: string;
    setValue: Dispatch<SetStateAction<number>>;
    addToBalance: (value: number) => void;
  };
}

const defaultValue: IDragonCardContext = {
  bet: {
    value: DEFAULT_BET_VALUE,
    setValue: () => {},
  },
  risk: {
    value: DEFAULT_RISK,
    setValue: () => {},
  },

  localBalance: {
    ref: { current: DEFAULT_LOCAL_BALANCE },
    value: `${DEFAULT_LOCAL_BALANCE}`,
    setValue: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addToBalance: (_value: number) => {},
  },
};

const DragonCardContext = React.createContext<IDragonCardContext>(defaultValue);

export default DragonCardContext;
