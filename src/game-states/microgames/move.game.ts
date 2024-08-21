import { character } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { State } from '@/core/state';
import { Vec2 } from '@/util/types';
import { cap, clampNearZero } from '@/util/util';
import { Entity } from '@/core/entities/entity';

export class MoveGame implements State {
  furniture: Entity[] = [];

  velocity: Vec2 = {x: 0, y: 0};
  maxSpeed = 3;
  acceleration = 0.02;

  onUpdate(delta: number) {
    this.queryControls(delta);

    this.furniture.forEach(f => {
      const collision = f.collision(character);
      if (collision.collides) {
        if (collision.right) {
          console.log('right');
          this.velocity.x = -this.velocity.x;
          character.pos.x -= -this.velocity.x;
        }
        if (collision.left) {
          console.log('left');
          this.velocity.x = -this.velocity.x;
          character.pos.x -= -this.velocity.x;
        }
        if (collision.bottom) {
          console.log('bottom');
          this.velocity.y = -this.velocity.y;
          character.pos.y -= -this.velocity.y;
        }
        if (collision.top) {
          console.log('top');
          this.velocity.y = -this.velocity.y;
          character.pos.y -= -this.velocity.y;
        }
      }
    });

    character.pos = {
      x: Math.round(character.pos.x + this.velocity.x),
      y: Math.round(character.pos.y + this.velocity.y)
    };
    
    this.velocity = {
      x: clampNearZero(cap(this.velocity.x, -this.maxSpeed, this.maxSpeed)),
      y: clampNearZero(cap(this.velocity.y, -this.maxSpeed, this.maxSpeed)),
    };

    character.pos = character.pos;
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