const STORAGE_KEY = '13_terrible_stunts_game_save';

export function loadLevel(): number {
  const storage = localStorage.getItem(STORAGE_KEY) || "";

  return parseInt(storage, 10) || 0;
}

export function saveLevel(boss: number) {
  localStorage.setItem(STORAGE_KEY, boss.toString());
}