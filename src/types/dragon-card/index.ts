export enum DragonCardRiskType {
  CLASSIC = "CLASSIC",
  LOW = "LOW",

  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type DragonCardRiskTypes = "LOW" | "MEDIUM" | "HIGH" | "CLASSIC";

export const DragonCardRiskList: DragonCardRiskTypes[] = [
  DragonCardRiskType.CLASSIC,
  DragonCardRiskType.LOW,
  DragonCardRiskType.MEDIUM,
  DragonCardRiskType.HIGH,
];

export interface DragonCardAudioSource {
  buffer: AudioBuffer | null;
  gainNode: GainNode;
}

export interface DragonCardBetInfo {
  payout: number;
  multiplier: number;
  bet: number;
  roundId: string;

  risk: DragonCardRiskType;
}

export interface DragonCardRateLimit {
  manualMs: number;
  autoMs: number;
}

export interface DragonCardConfig extends DragonCardRateLimit {
  minBet: number;
  maxBet: number;
}

export type SideBarTabs = "Manual" | "Auto";

export enum SideBarTab {
  MANUAL = "Manual",
  AUTO = "Auto",
}

export interface DragonCardImages {
  sparksImage: HTMLImageElement;
  ballImage: HTMLImageElement;
  collidingPegImage: HTMLImageElement;
}
