import CryptoJS from "crypto-js";
import RngGames from "src/rng/rng.games";
import { DragonCardRiskType } from "types/dragon-card";

export interface GameResult {
  payout: number;
  multiplier: number;
  results: number[];
  multiplierIndex: number;
  risk: DragonCardRiskType;
  roundId: number;
}

let roundId = 0;
export interface Card {
  id: number;
  value: string;
  img: string;
}

class ApiService {
  getResult(): Promise<{ serverCards: Card[]; roundId: number }> {
    const outcome = this.getOutcomes();
    const results = outcome.map(val => Math.floor(val * 6));
    const shuffledCards = RngGames.getRandom(results);
    // const multiplierIndex = results.reduce((result, current) => result + current, 0);
    // const multiplier = this.getMultiplier(rowsCount, risk, multiplierIndex);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          roundId: roundId++,
          serverCards: shuffledCards,
        });
      }, 200);
    });
  }

  private generateRandomBytesArray(length: number) {
    const wordArray = CryptoJS.lib.WordArray.random(length);
    const byteArray = [];

    for (let i = 0; i < wordArray.sigBytes; i++) {
      byteArray.push((wordArray.words[i >> 2] >> (24 - (i % 4) * 8)) & 0xff);
    }

    return byteArray;
  }

  private getOutcomes() {
    const cardsCount = 6;
    const bytes = this.generateRandomBytesArray(cardsCount * 4);
    const bytesByRowsCount = bytes.slice(0, cardsCount * 4);
    const chunks = bytesByRowsCount.reduce((result, current, index) => {
      if (index % 4 == 0) result.push([current]);
      else {
        const chunkIndex = Math.floor(index / 4);
        const chunk = result[chunkIndex];
        chunk.push(current);
      }
      return result;
    }, [] as number[][]);

    const outcome = chunks.map(bytesChunk =>
      bytesChunk.reduce((result, value, i) => {
        const divider = 256 ** (i + 1);
        const partialResult = value / divider;
        return result + partialResult;
      }, 0),
    );

    return outcome;
  }

  //   private generateBytes(serverSeed: string, clientSeed: string, nonce: number, rowsCount: number) {
  //     let currentCursor = 0;
  //     const endCursor = Math.ceil(rowsCount / 8);
  //     const bytes: number[] = [];

  //     while (currentCursor <= endCursor - 1) {
  //       const hash = createHash("sha256")
  //         .update(`${serverSeed}:${clientSeed}:${nonce}:${currentCursor}:${rowsCount}`)
  //         .digest();

  //       bytes.push(...hash);

  //       currentCursor++;
  //     }

  //     return bytes;
  //   }

  // private getRepresentativeDirections(outcome: number[]): number[] {
  //   const values = [0, 1];
  //   const mappedValues: number[] = outcome.map(result => values[Math.floor(result * 2)]);
  //   return mappedValues;
  // }

  // private getMultiplier(rowsCount: Rows, risk: RiskType, index: number): number {
  //   const oddsSet = MULTIPLIERS[rowsCount][risk];
  //   const multiplier = oddsSet[index];
  //   return multiplier;
  // }
}

const apiService = new ApiService();
export default apiService;
