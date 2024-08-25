import { CHARACTER_SIZE } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { Vec2 } from '@/util/types';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { HEIGHT, WIDTH } from '@/core/draw-engine';

export class BuildingJumpGame extends JumpGame {
  velocity: Vec2 = {x: 0, y: 0};
  maxSpeed = 4;
  acceleration = { x: 0.01, y: 0.05 };
  jumpSpeed = 7;

  timeJumping = 0;
  maxTimeJumping = 100;

  jumps = 0;
  maxJumps = 2;
  isGrounded = false;

  onEnter() {
    super.onEnter();
    this.text = 'Jump over';

    this.platforms = [
      new Building({x: 2, y: 100 + CHARACTER_SIZE}),
      new Building({x: WIDTH - 102, y: 120 + CHARACTER_SIZE}),
    ];
    this.deathColliders = [new Collider(
      { x: 0, y: HEIGHT },
      { x: WIDTH, y: 10 },
    )];
    this.goalColliders = [new Collider(
      {x: WIDTH - 102, y: 120 + CHARACTER_SIZE - 1},
      {x: BUILDING_WIDTH, y: 10}
    )];
  }

  queryControls(delta: number) {
    if (
      controls.isUp
      && this.jumps < this.maxJumps
    ) {
      if (!controls.previousState.isUp) {
        this.timeJumping = 0;
        this.velocity.y = Math.min(0, this.velocity.y);
        this.jumps++;
      } else if (this.timeJumping < this.maxTimeJumping) {
        this.timeJumping += delta;
        this.velocity.y = -this.jumpSpeed;
      }
    }

    if (this.isGrounded) {
      if (controls.isLeft) {
        this.velocity.x -= this.acceleration.x * delta;
      } else if (controls.isRight) {
        this.velocity.x += this.acceleration.x * delta;
      } else if (this.velocity.y == 0) {
        if (this.velocity.x > 0) {
          this.velocity.x = Math.max(0, this.velocity.x - 4 * this.acceleration.x * delta);
        } else if (this.velocity.x < 0) {
          this.velocity.x = Math.min(0, this.velocity.x + 4 * this.acceleration.x * delta);
        }
      }
    }
  }
}

export default new BuildingJumpGame();