import buildingJumpGame from "@/game-states/microgames/building-jump.game";
import { gameStateMachine } from "@/game-state-machine";
import coffeeGame from "@/game-states/microgames/coffee.game";
import { GameBase } from "@/game-states/microgames/templates/base.game";
import { trampolinGame } from "@/game-states/microgames/trampolin.game";
import { mattressGame } from "@/game-states/microgames/mattress.game";
import { fallingBuildingGame } from "@/game-states/microgames/falling-building.game";
import jumpingTrainGame from "@/game-states/microgames/jumping-train.game";
import boatWheelGame from "@/game-states/microgames/boat.wheel.game";
import buildingClimbGame from "@/game-states/microgames/building-climb.game";

export type Boss = {
  name: string
  intro: string
  final: string
  outro: string
  gameover: string
}

const bossData: Boss[] = [
  {
    // https://en.wikipedia.org/wiki/D._W._Griffith
    name: 'Assistant Dave',
    intro: 'If you want to make it big in Hollywood kid, you better do as I say!',
    final: 'Is that all you got?',
    outro: 'I guess you\'re not totally worthless!',
    gameover: 'Stop wasting my time kid!',
  },
  {
    //https://de.wikipedia.org/wiki/Leni_Riefenstahl
    name: 'Producer Elena',
    intro: 'Just do as you\'re told and don\'t get in my way.',
    final: 'Hurry, I don\'t have all day',
    outro: 'Obedient and disciplined. You\'ll get far, child.',
    gameover: 'Is there some reason my coffee isn\t here?',
  },
  {
    // https://en.wikipedia.org/wiki/Alfred_Hitchcock
    name: 'Director Alfred',
    intro: 'Good evening. Are you ready to face your fears?',
    final: 'Time for your final act',
    outro: 'Well done. I must admit, you handled the tension admirably.',
    gameover: 'Was this worth the price of admission?',
  },
  {
    // https://en.wikipedia.org/wiki/Walt_Disney
    name: 'Wally',
    intro: 'I\'ve been following you growth. Show me what you got, ha ha.',
    final: 'The wheel must keep spinning, ha ha!',
    outro: 'Splendid. I can definitely use you, ha ha!',
    gameover: 'This just won\'t do ha ha',
  },
];

// function getStorage(): string {
//   const storage = localStorage.getItem('') || "";

//   return storage;
// }

export const levels: GameBase[][] = [
  [
    boatWheelGame,
    buildingClimbGame,
    coffeeGame,
    buildingJumpGame,
    fallingBuildingGame,
    trampolinGame,
    mattressGame,
    jumpingTrainGame,
  ],
  [
    boatWheelGame,
    buildingClimbGame,
    coffeeGame,
    buildingJumpGame,
    fallingBuildingGame,
    trampolinGame,
    mattressGame,
    jumpingTrainGame,
  ],
  [
    boatWheelGame,
    buildingClimbGame,
    coffeeGame,
    buildingJumpGame,
    fallingBuildingGame,
    trampolinGame,
    mattressGame,
    jumpingTrainGame,
  ],
  [
    boatWheelGame,
    buildingClimbGame,
    coffeeGame,
    buildingJumpGame,
    fallingBuildingGame,
    trampolinGame,
    mattressGame,
    jumpingTrainGame,
  ],
];

export const MAX_LIVES = 4;
class GameData {
  boss = 0;
  level = -1;
  maxLevel = 0;
  lives = MAX_LIVES;
  endless = false;

  constructor() {
  }

  getBoss(): Boss {
    console.log(this.boss, bossData[this.boss]);
    
    return bossData[this.boss];
  }

  getDifficulty(): number {
    return (this.boss /3 + this.level / 12) / 2;
  }

  nextLevel() {
    this.level++;
    let level;
    if (this.endless) {
      level = this.getRandomLevel();
    } else {
      level = levels[this.boss][this.level];
    }
    gameStateMachine.setState(level);
  }

  getRandomLevel(): GameBase {
    const randomBossIndex = Math.floor(Math.random() * levels.length);
    const randomLevelIndex = Math.floor(Math.random() * levels[randomBossIndex].length);
    return levels[randomBossIndex][randomLevelIndex];
  }

  restartLevel() {
    const fn = gameStateMachine.getState().onEnter;
    // @ts-ignore
    fn && gameStateMachine.getState().onEnter();
  }
}

export const gameData = new GameData();