export interface BufferGeneratorArgs {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  currentRound: number;
}

export interface RandomGeneratorArgs {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  cursor?: number;
}

export interface ByteGeneratorResult {
  generateNextByte: () => number;
  getCursor: () => number;
}

export interface RandomGeneratorResult {
  getRandom: (limit?: number) => number;
  getCursor: () => number;
}

export interface RandomLimboArgs extends RandomGeneratorArgs {
  rtp: number;
}

export interface RandomPlinkoArgs extends RandomGeneratorArgs {
  rowsCount: number;
}

export interface RandomKenoArgs extends RandomGeneratorArgs {
  gemsCount: number;
}
