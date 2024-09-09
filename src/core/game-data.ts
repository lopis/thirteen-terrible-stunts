import { gameStateMachine } from "@/game-state-machine";
import { GameBase } from "@/game-states/microgames/templates/base.game";
import { shuffleArray } from "@/util/util";
import spotlightGame from "@/game-states/microgames/spotlight.game";
import fireEscapeGame from "@/game-states/microgames/fire-escape.game";
import coffeeGame from "@/game-states/microgames/coffee.game";
import { fallingBuildingGame } from "@/game-states/microgames/falling-building.game";
import boatWheelGame from "@/game-states/microgames/boat.wheel.game";
import buildingClimbGame from "@/game-states/microgames/building-climb.game";
import buildingJumpGame from "@/game-states/microgames/building-jump.game";
import { trampolinGame } from "@/game-states/microgames/trampolin.game";
import { mattressGame } from "@/game-states/microgames/mattress.game";
import jumpingTrainGame from "@/game-states/microgames/jumping-train.game";
import ropeJumpingGame from "@/game-states/microgames/rope-jumping.game";
import startState from "@/game-states/start.state";
import { loadHiScore, loadLevel, saveLevel } from "./storage";
import { levelsState } from "@/game-states/levels.state";

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
    // https://en.wikipedia.org/wiki/Leni_Riefenstahl
    name: 'Director Leni',
    intro: 'Just do what one tells you, and stay out of my way.',
    final: 'Hurry, I have not the whole day.',
    outro: 'Obedient and disciplined. You\'ll get far, child.',
    gameover: 'Is there some reason my coffee isn\t here?',
  },
  {
    // https://en.wikipedia.org/wiki/Alfred_Hitchcock
    name: 'Director Alfred',
    intro: 'Good evening. Are you ready to face your fears?',
    final: 'It is time for your final act',
    outro: 'Well done. I must admit, you handled the tension admirably.',
    gameover: 'Was this worth the price of admission?',
  },
  {
    // https://en.wikipedia.org/wiki/Walt_Disney
    name: 'Wally',
    intro: 'I\'ve been watching you grow. Show me what you got, ha ha.',
    final: 'The wheel must keep spinning, ha ha!',
    outro: 'Splendid. I can definitely use you, ha ha!',
    gameover: 'This just won\'t do ha ha',
  },
];


export const levels: GameBase[][] = [
  [
    coffeeGame,
    buildingJumpGame,
    // cleaninigGame,
    jumpingTrainGame,
  ],
  [
    buildingClimbGame,
    buildingJumpGame,
    coffeeGame,
    trampolinGame,
    fallingBuildingGame,
  ],
  [
    spotlightGame,
    boatWheelGame,
    fallingBuildingGame,
    jumpingTrainGame,
    trampolinGame,
  ],
  [
    spotlightGame,
    fireEscapeGame,
    mattressGame,
    ropeJumpingGame,
    //rollingRockGame,
  ],
];

const allLevels: Set<GameBase> = new Set(levels.flat());

export const MAX_LIVES = 4;
class GameData {
  highScore = 0;
  boss = 0;
  level = -1;
  maxLevel = 0;
  lives = MAX_LIVES;
  endless = true;
  randomLevels: GameBase[] = [];
  easyMode = false;
  speedUp = false;

  constructor() {
    this.randomLevels = shuffleArray(Array.from(allLevels));
    this.boss = loadLevel();
    this.highScore = loadHiScore();
  }

  getBoss(): Boss {
    return bossData[this.boss];
  }

  getDifficulty(): number {
    const difficulty = this.endless ? this.level / 26 : (this.boss /3 + this.level / 12) / 2;

    return this.easyMode ? difficulty * 0.5 : difficulty;
  }

  start() {
    this.level = -1;
    this.level = -1;
    this.speedUp = false;
    this.nextLevel();
  }

  nextLevel() {
    this.level++;
    let level;
    if (this.endless) {
      level = this.randomLevels[this.level%this.randomLevels.length];
      level = jumpingTrainGame;
    } else {
      const bossLevels = levels[this.boss];
      level = bossLevels[this.level % bossLevels.length];
    }
    gameStateMachine.setState(level);
  }

  nextBoss() {
    if (this.boss == 3) {
      gameStateMachine.setState(levelsState);
      return;
    }

    this.boss++;
    saveLevel(this.boss);
    this.level = -1;
    this.speedUp = false;
    gameStateMachine.setState(startState);
  }

  restartLevel() {
    const fn = gameStateMachine.getState().onEnter;
    // @ts-ignore
    fn && gameStateMachine.getState().onEnter();
  }
}

export const gameData = new GameData();