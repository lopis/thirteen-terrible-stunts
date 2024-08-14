// function getStorage(): string {
//   const storage = localStorage.getItem('') || "";

//   return storage;
// }

class GameData {
  level = 0;
  maxLevel = 0;

  constructor() {
  }
}

export const gameData = new GameData();