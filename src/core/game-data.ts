import { color4, color5, color6 } from "./draw-engine";

export const levelColors = [
  color6,
  color5,
  color4,
];

function getStorage(): string {
  const storage = localStorage.getItem('') || "";

  return storage
}

class GameData {
  level = 0;
  maxLevel = 0;

  constructor() {
  }
}

export const gameData = new GameData();