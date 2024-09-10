const STORAGE_KEY = '13_terrible_stunts_game_';

export function loadLevel(): number {
  const storage = localStorage.getItem(`${STORAGE_KEY}save`) || "";
  return parseInt(storage, 10) || 0;
}

export function saveLevel(boss: number) {
  localStorage.setItem(`${STORAGE_KEY}save`, boss.toString());
}

export function saveHiScore(level: number) {
  localStorage.setItem(`${STORAGE_KEY}hs`, level.toString());
}

export function loadHiScore(): number {
  const storage = localStorage.getItem(`${STORAGE_KEY}hs`) || "";

  return parseInt(storage, 10) || 0;
}