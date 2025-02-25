import { Dispatch, SetStateAction } from "react";
import { DragonCardRiskType } from "./dragon-card";

export type BetModification = "1/2" | "x2" | "Max" | number;
export interface GenericState<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

export type ProvablyFairPanelType = "Seeds" | "Verification";

export enum ProvablyFairPanel {
  SEEDS = "Seeds",
  VERIFICATION = "Verification",
}

export class RoundReplayInfo {
  clientSeed: string = "";
  serverSeed: string = "";
  nonce: number = 0;
  risk: DragonCardRiskType = DragonCardRiskType.CLASSIC;
}

export interface ProveFairnessResult {
  wonMultiplier: number;
  risk: DragonCardRiskType;
  randomizationJson: string;
}

export type AssetType = "images" | "cards" | "audio";
