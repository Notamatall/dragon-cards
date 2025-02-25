// import { createHmac } from 'crypto';
// import {
//   BufferGeneratorArgs,
//   ByteGeneratorResult,
//   RandomGeneratorArgs,
//   RandomGeneratorResult,
// } from './dto';
// import { MAXIMAL_RANDOM_LIMIT, SHA256_BUFFER_SIZE } from './constants';
// import { RngError } from './rng.error';

// abstract class Rng {
//   private static validateRandomLimit(limit: number) {
//     if (!Number.isInteger(limit)) {
//       throw new RngError('Random function limit must be an integer');
//     }
//     if (limit <= 0) {
//       throw new RngError('Random function limit must be positive');
//     }
//     if (limit > MAXIMAL_RANDOM_LIMIT) {
//       throw new RngError(
//         `Random function limit cannot exceed 32-bit range (not greater than 2**32 = ${MAXIMAL_RANDOM_LIMIT})`
//       );
//     }
//   }

//   private static getBuffer({
//     serverSeed,
//     clientSeed,
//     nonce,
//     currentRound,
//   }: BufferGeneratorArgs): Buffer {
//     const hmac = createHmac('sha256', serverSeed);
//     hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
//     const buffer = hmac.digest();
//     return buffer;
//   }

//   private static createByteGenerator({
//     serverSeed,
//     clientSeed,
//     nonce,
//     cursor = 0,
//   }: RandomGeneratorArgs): ByteGeneratorResult {
//     let currentRound: number = Math.floor(cursor / SHA256_BUFFER_SIZE);
//     let currentRoundCursor: number = cursor % SHA256_BUFFER_SIZE;
//     let buffer: Buffer = this.getBuffer({
//       serverSeed,
//       clientSeed,
//       nonce,
//       currentRound,
//     });

//     const generateNextByte = () => {
//       if (currentRoundCursor >= SHA256_BUFFER_SIZE) {
//         currentRoundCursor = 0;
//         currentRound++;
//         buffer = this.getBuffer({
//           serverSeed,
//           clientSeed,
//           nonce,
//           currentRound,
//         });
//       }

//       const byte = Number(buffer[currentRoundCursor]);
//       currentRoundCursor++;
//       return byte;
//     };

//     function getCursor(): number {
//       return currentRound * SHA256_BUFFER_SIZE + currentRoundCursor;
//     }

//     return { generateNextByte, getCursor };
//   }

//   /**
//    * @param {number} cursor - Value which is used to start iteration at particular byte. Used for multistage games
//    * when you need to reuse same serverSeed, clientSeed, nonce combination to get next random number.
//    */
//   public static createRandomGenerator({
//     serverSeed,
//     clientSeed,
//     nonce,
//     cursor = 0,
//   }: RandomGeneratorArgs): RandomGeneratorResult {
//     const { generateNextByte, getCursor } = this.createByteGenerator({
//       serverSeed,
//       clientSeed,
//       nonce,
//       cursor,
//     });

//     const getRandom = (limit: number = 2 ** 32) => {
//       this.validateRandomLimit(limit);
//       let randomSum = 0;

//       for (let i = 0; i < 4; i++) {
//         const byte = generateNextByte();
//         const divider = 256 ** (i + 1);
//         randomSum += byte / divider;
//       }

//       return Math.floor(randomSum * limit);
//     };

//     return { getRandom, getCursor };
//   }
// }

// export default Rng;
