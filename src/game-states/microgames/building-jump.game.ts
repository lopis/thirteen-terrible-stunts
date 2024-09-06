import { CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { HEIGHT, WIDTH } from '@/core/draw-engine';
import { interpolate } from '@/util/util';
import { gameData } from '@/core/game-data';

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  distance: [0, 40],
  heightDifference: [-10, 20],
};

export class BuildingJumpGame extends JumpGame {
  acceleration = { x: 0.01, y: 0.05 };

  onEnter() {
    super.onEnter();
    this.text = 'Jump over';

    const difficulty = gameData.getDifficulty();
    const distance = interpolate(difficultyRange.distance, difficulty);
    const heightDifference = interpolate(difficultyRange.heightDifference, difficulty);

    this.platforms = [
      new Building({x: 2 - distance, y: 100 + CHARACTER_SIZE + heightDifference}),
      new Building({x: WIDTH - 102 + distance, y: 120 + CHARACTER_SIZE - heightDifference}),
    ];
    this.deathColliders = [new Collider(
      { x: 0, y: HEIGHT + 20 },
      { x: WIDTH, y: 10 },
    )];
    this.goalColliders = [new Collider(
      {x: WIDTH - 102 + distance, y: 120 + CHARACTER_SIZE - 1 - heightDifference},
      {x: BUILDING_WIDTH, y: 10}
    )];
  }
}

export default new BuildingJumpGame();