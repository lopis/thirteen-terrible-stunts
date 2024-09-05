import { CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { HEIGHT, WIDTH } from '@/core/draw-engine';
import { gameData } from '@/core/game-data';
import { interpolate } from '@/util/util';

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  distance: [0, 50],
};

export class BuildingJumpGame extends JumpGame {
  acceleration = { x: 0.01, y: 0.05 };

  onEnter() {
    super.onEnter();
    this.text = 'Jump over';

    const difficulty = gameData.getDifficulty();
    const distance = interpolate(difficultyRange.distance, difficulty);

    this.platforms = [
      new Building({x: 2 - distance, y: 100 + CHARACTER_SIZE}),
      new Building({x: WIDTH - 102 + distance, y: 120 + CHARACTER_SIZE}),
    ];
    this.deathColliders = [new Collider(
      { x: 0, y: HEIGHT + 20 },
      { x: WIDTH, y: 10 },
    )];
    this.goalColliders = [new Collider(
      {x: WIDTH - 102, y: 120 + CHARACTER_SIZE - 1},
      {x: BUILDING_WIDTH, y: 10}
    )];
  }
}

export default new BuildingJumpGame();