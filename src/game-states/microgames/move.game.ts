import { character } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { State } from '@/core/state';
import { Vec2 } from '@/util/types';
import { cap, clampNearZero } from '@/util/util';

export class MoveGame implements State {
  charPos: Vec2 = {x: 0, y: 0};
  velocity: Vec2 = {x: 0, y: 0};
  maxSpeed = 3;
  acceleration = 0.02;

  onEnter() {
    // gameStateMachine.setState();
  }

  onUpdate(delta: number) {
    this.queryControls(delta);
    
    this.charPos = {
      x: Math.round(this.charPos.x + this.velocity.x),
      y: Math.round(this.charPos.y + this.velocity.y)
    };
    this.velocity = {
      x: clampNearZero(cap(this.velocity.x, -this.maxSpeed, this.maxSpeed)),
      y: clampNearZero(cap(this.velocity.y, -this.maxSpeed, this.maxSpeed)),
    };

    character.pos = this.charPos;
    if (this.velocity.x != 0 || this.velocity.y != 0) {
      character.drawWalking(delta);
    } else {
      character.drawStanding();
    }
  }

  queryControls(delta: number) {
    if (controls.isUp) {
      this.velocity.y -= this.acceleration * delta;
    } else if (controls.isDown) {
      this.velocity.y += this.acceleration * delta;
    } else {
      if (this.velocity.y > 0) {
        this.velocity.y = Math.max(0, this.velocity.y - this.acceleration * delta);
      } else if (this.velocity.y < 0) {
        this.velocity.y = Math.min(0, this.velocity.y + this.acceleration * delta);
      }
    }

    if (controls.isLeft) {
      this.velocity.x -= this.acceleration * delta;
      character.mirror = true;
    } else if (controls.isRight) {
      this.velocity.x += this.acceleration * delta;
      character.mirror = false;
    } else {
      if (this.velocity.x > 0) {
        this.velocity.x = Math.max(0, this.velocity.x - this.acceleration * delta);
      } else if (this.velocity.x < 0) {
        this.velocity.x = Math.min(0, this.velocity.x + this.acceleration * delta);
      }
    }
  }
}