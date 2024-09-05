import { CHARACTER_SIZE } from "@/core/entities/character";
import { BuildingJumpGame } from "./building-jump.game";
import { Building } from "@/core/entities/building";
import { colors, HEIGHT, WIDTH } from "@/core/draw-engine";
import { Platform } from "@/core/entities/platform";
import { gameData } from "@/core/game-data";
import { interpolate } from "@/util/util";

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  goalSize: [4, 2],
  buildingHeigh: [100, 50],
};

class MattressGame extends BuildingJumpGame {
  goalSize = 0;
  buildingHeigh = 0;

  onEnter() {
    super.onEnter();
    this.text = 'Land safely';

    const difficulty = gameData.getDifficulty();
    this.goalSize = interpolate(difficultyRange.goalSize, difficulty);
    this.buildingHeigh = interpolate(difficultyRange.buildingHeigh, difficulty);

    this.deathColliders = [new Platform(
      { x: 0, y: HEIGHT - 20 },
      { x: WIDTH, y: 20 },
      colors.gray
    )];
    const goal = new Platform(
      {x: WIDTH - 102, y: HEIGHT - 25},
      {x: CHARACTER_SIZE * this.goalSize, y: 5},
      colors.black,
      colors.white,
    );
    this.goalColliders = [goal];
    this.platforms = [
      new Building({x: -20, y: this.buildingHeigh + CHARACTER_SIZE}, 4),
      goal,
    ];
  }
}

export const mattressGame = new MattressGame();