import { CHARACTER_SIZE } from "@/core/entities/character";
import { BuildingJumpGame } from "./building-jump.game";
import { Building } from "@/core/entities/building";
import { colors, HEIGHT, WIDTH } from "@/core/draw-engine";
import { Platform } from "@/core/entities/platform";

class TrampolinGame extends BuildingJumpGame {
  onEnter() {
    super.onEnter();
    this.text = 'Jump off';

    this.deathColliders = [new Platform(
      { x: 0, y: HEIGHT - 20 },
      { x: WIDTH, y: 20 },
      colors.gray
    )];
    const goal = new Platform(
      {x: WIDTH - 102, y: HEIGHT - 25},
      {x: CHARACTER_SIZE * 2, y: 10},
      colors.black,
      colors.white,
    );
    this.goalColliders = [goal];
    this.platforms = [
      new Building({x: -20, y: 50 + CHARACTER_SIZE}),
      goal,
    ];
  }
}

export const trampolinGame = new TrampolinGame();