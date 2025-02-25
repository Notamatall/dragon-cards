import { DragonCardRiskType } from ".";

export const DEFAULT_LOCAL_BALANCE = 0;
export const DEFAULT_BET_VALUE: number = 0;
export const DEFAULT_BALL_SIZE_PX: number = 20;
export const DEFAULT_RISK: DragonCardRiskType = DragonCardRiskType.CLASSIC;

export const RISK_LIST: DragonCardRiskType[] = [
  DragonCardRiskType.LOW,
  DragonCardRiskType.MEDIUM,
  DragonCardRiskType.HIGH,
  DragonCardRiskType.CLASSIC,
];
