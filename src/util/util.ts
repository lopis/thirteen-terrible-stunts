import { Vec2 } from "./types";

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

export function addVec({x,y}: Vec2, vec2: Vec2) {
  return {x: x+vec2.x, y: y+vec2.y};
}

export function randomize(obj: Record<string, number>, heat = 0.3): Record<string, number> {
  const randomizedObject = {...obj};

  Object.keys(randomizedObject).forEach((key) => {
    const r = 1 + Math.random() * heat;
    randomizedObject[key] = randomizedObject[key] * r;
  });

  return randomizedObject;
}

export const roundTo32 = (num: number) => Math.round(num / 15) * 15;

export const interpolate = (range: [number, number], difficulty: number): number => {
  return range[0] + (range[1] - range[0]) * difficulty;
};

export const vecAdd = (vec: Vec2, x: number, y: number) => ({x: vec.x + x, y: vec.y + y});

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}