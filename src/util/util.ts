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