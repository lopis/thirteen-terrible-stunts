import { character } from '@/core/character';
import { controls } from '@/core/controls';
import { State } from '@/core/state';
import { Vec2 } from '@/util/types';
import { cap, clampNearZero } from '@/util/util';

export class JumpGame implements State {
  floor = 200;
  charPos: Vec2 = {x: 0, y: this.floor};
  velocity: Vec2 = {x: 0, y: 0};
  maxSpeed = 5;
  acceleration = { x: 0.3, y: 0.1 };
  jumpSpeed = 10;
  timeJumping = 0;
  maxTimeJumping = 200;

  onEnter() {
    // gameStateMachine.setState();
  }

  onUpdate(delta: number) {
    this.queryControls(delta);
    
    this.velocity = {
      x: clampNearZero(cap(this.velocity.x, -this.maxSpeed, this.maxSpeed)),
      y: clampNearZero(this.velocity.y),
    };

    if (this.charPos.y < this.floor) {
      this.velocity.y += this.acceleration.y * delta;
    }

    this.charPos = {
      x: Math.round(this.charPos.x + this.velocity.x),
      y: Math.round(this.charPos.y + this.velocity.y)
    };

    // Ensure character doesn't fall below the floor
    if (this.charPos.y >= this.floor) {
      this.charPos.y = this.floor;
      this.velocity.y = 0;
      this.timeJumping = 0;
    }

    if (this.velocity.x != 0 || this.velocity.y != 0) {
      character.drawWalking(delta, this.charPos);
    } else {
      character.drawStanding(this.charPos);
    }
  }

  queryControls(delta: number) {
    if (controls.isUp && this.timeJumping < this.maxTimeJumping) {
      this.timeJumping += delta;
      this.velocity.y = -this.jumpSpeed;
    }

    if (controls.isLeft) {
      this.velocity.x -= this.acceleration.x * delta;
    } else if (controls.isRight) {
      this.velocity.x += this.acceleration.x * delta;
    } else if (this.velocity.y == 0) {
      if (this.velocity.x > 0) {
        this.velocity.x = Math.max(0, this.velocity.x - this.acceleration.x * delta);
      } else if (this.velocity.x < 0) {
        this.velocity.x = Math.min(0, this.velocity.x + this.acceleration.x * delta);
      }
    }
  }
}