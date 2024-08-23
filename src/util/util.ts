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

/**
 * Rounds numbers larger than 0.95 to 1, and smaller than 0.05 to 0.
 * This is used to avoid the long tail of easing functions.
 * @param x Number from 0 to 1
 * @returns 
 */
// function cap(x: number): number {
//   return x > 0.95 ? 1
//     : x < 0.05 ? 0
//     : x;
// }

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