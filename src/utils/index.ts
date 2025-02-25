import { AssetType } from "types/index";

export function randomInteger(min: number, max: number) {
  const random = Math.random();
  min = Math.round(min);
  max = Math.floor(max);

  return Math.floor(random * (max - min) + min);
}

export function isNil(value: unknown) {
  return value === null || value === undefined;
}
export function loadImageAsync(src: string): Promise<{ img: HTMLImageElement; src: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      console.log("resolving", img);
      resolve({ img, src });
    };
    img.onerror = e => reject(e);
  });
}

export function factorial(n: number) {
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function binomialCoefficient(rowsCount: number, index: number) {
  return factorial(rowsCount) / (factorial(index) * factorial(rowsCount - index));
}

export function calculateProbability(rowsCount: number, index: number) {
  const binomCoeff = binomialCoefficient(rowsCount, index);
  const probability = binomCoeff * Math.pow(0.5, rowsCount);
  return (probability * 100).toFixed(4);
}

export function calculateReward(bet: number, multiplier: number) {
  return (bet * multiplier).toFixed(4);
}

export function getProviderGamePath(type: AssetType, filename: string) {
  return `./${import.meta.env.VITE_PROVIDER}/${import.meta.env.VITE_GAME}/${type}/${filename}`;
}
