import { icons } from "./draw-engine";

export type Boss = {
  name: string
  intro: string
  final: string
  outro: string
  gameover: string
  icon: string
}

const bossData: Boss[] = [
  {
    // https://en.wikipedia.org/wiki/D._W._Griffith
    name: 'Assistant Dave',
    intro: 'If you want to make it big in Hollywood kid, you better do as I say!',
    final: 'Is that all you got?',
    outro: 'I guess you\'re not totally worthless!',
    gameover: 'Stop wasting my time kid!',
    icon: icons.boss1,
  },
  {
    //https://de.wikipedia.org/wiki/Leni_Riefenstahl
    name: 'Producer Elena',
    intro: 'Just do as you\'re told and don\'t get in my way.',
    final: 'Hurry, I don\'t have all day',
    outro: 'Obedient and disciplined. You\'ll get far, child.',
    gameover: 'Is there some reason my coffee isn\t here?',
    icon: icons.boss2,
  },
  {
    // https://en.wikipedia.org/wiki/Alfred_Hitchcock
    name: 'Director Alfred',
    intro: 'Good evening. Are you ready to face your fears?',
    final: 'Time for your final act',
    outro: 'Well done. I must admit, you handled the tension admirably.',
    gameover: 'Was this worth the price of admission?',
    icon: icons.boss3,
  },
  {
    // https://en.wikipedia.org/wiki/Walt_Disney
    name: 'Wally',
    intro: 'I\'ve been following you growth. Show me what you got, ha ha.',
    final: 'The wheel must keep spinning, ha ha!',
    outro: 'Splendid. I can definitely use you, ha ha!',
    gameover: 'This just won\'t do ha ha',
    icon: icons.boss4,
  },
];

// function getStorage(): string {
//   const storage = localStorage.getItem('') || "";

//   return storage;
// }

class GameData {
  level = 0;
  maxLevel = 0;

  constructor() {
  }

  getBoss(): Boss {
    return bossData[this.level];
  }
}

export const gameData = new GameData();