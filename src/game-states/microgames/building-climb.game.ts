import { character, CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH, FLOOR_HEIGHT } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { Platform } from '@/core/entities/platform';
import { addVec } from '@/util/util';

export class BuildingClimbGame extends JumpGame {
  acceleration = { x: 0.01, y: 0.05 };
  buildingNum = 10;
  jumpSpeed = 8.5;
  maxJumps = 1;

  onEnter() {
    super.onEnter();
    this.text = ' Escape ';

    this.maxY = Number.MAX_SAFE_INTEGER;
    this.minY = -Number.MAX_SAFE_INTEGER;
    character.pos = {x: WIDTH / 2, y: HEIGHT / 2 + (this.buildingNum) * FLOOR_HEIGHT - 10};

    this.platforms = [];
    for (let i = 0; i < this.buildingNum; i++) {
      this.platforms.push(new Building({x: (WIDTH - BUILDING_WIDTH) / 2, y: FLOOR_HEIGHT * i + HEIGHT / 2}, 1));
    }

    // Add floor
    const last = this.platforms[this.platforms.length - 1];
    this.platforms.push(new Platform(
      addVec(last.pos, {x: 0, y: FLOOR_HEIGHT}),
      last.size
    ));
    this.setDeathColliders();
  }

  setDeathColliders() {
    this.deathColliders = [new Collider(
      { x: 0, y: 10 + FLOOR_HEIGHT * this.buildingNum + HEIGHT / 2 },
      { x: WIDTH, y: HEIGHT },
    )];
  }

  onUpdate(delta: number): void {
    this.yOffset = -character.pos.y + HEIGHT / 2;
    super.onUpdate(delta);
    if (this.hasWon()) {
      this.nextLevel();
    }
  }

  drawExtras(): void {
    super.drawExtras();
    const y = this.deathColliders[0].pos.y - CHARACTER_SIZE;
    for (let p = 0; p < 6; p++) {
      drawEngine.drawIcon(IconKey.plant, {x: (WIDTH + BUILDING_WIDTH)/2 + 16*p, y});
      drawEngine.drawIcon(IconKey.plant, {x: (WIDTH - BUILDING_WIDTH)/2 - 16*(p+1), y});
    }
    this.deathColliders[0].render(colors.gray);
  }

  hasWon(): boolean {
    return !this.isEnding && this.platforms[0].standsOn();
  }
}

export default new BuildingClimbGame();