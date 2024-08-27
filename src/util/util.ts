import { Vec2 } from "./types";

export function clampNearZero(num: number, tolerance = 0.1): number {
  if (num < tolerance && num > -tolerance) {
    return 0;
  }

  return num;
}

export function cap(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

export function lineSplit(input: string, maxLength: number): string[] {
  const regex = new RegExp(`(.{1,${maxLength}})(\\s|$)`, 'g');
  const chunks = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    chunks.push(match[1].trim());
  }

  return chunks;
}

export function roundVec(vec: Vec2): Vec2 {
  return {
    x: Math.round(vec.x),
    y: Math.round(vec.y),
  };
}

export function randomize(obj: Record<string, number>, heat = 0.3): Record<string, number> {
  const randomizedObject = {...obj};

  Object.keys(randomizedObject).forEach((key) => {
    const r = 1 + Math.random() * heat;
    randomizedObject[key] = randomizedObject[key] * r;
  });

  return randomizedObject;
}

export const roundTo16 = (num: number) => Math.round(num / 16) * 16;

export const interpolate = (range: [number, number], difficulty: number): number => {
  return range[0] + (range[1] - range[0]) * difficulty;
};