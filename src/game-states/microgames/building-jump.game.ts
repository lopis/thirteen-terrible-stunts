import { CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { HEIGHT, WIDTH } from '@/core/draw-engine';

export class BuildingJumpGame extends JumpGame {
  acceleration = { x: 0.01, y: 0.05 };

  onEnter() {
    super.onEnter();
    this.text = 'Jump over';

    this.platforms = [
      new Building({x: 2, y: 100 + CHARACTER_SIZE}),
      new Building({x: WIDTH - 102, y: 120 + CHARACTER_SIZE}),
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