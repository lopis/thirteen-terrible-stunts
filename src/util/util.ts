export function clampNearZero(num: number, tolerance = 0.1): number {
  if (num < tolerance && num > -tolerance) {
    return 0;
  }

  return num;
}

export function cap(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}
