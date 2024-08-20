import { character } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { State } from '@/core/state';
import { Vec2 } from '@/util/types';
import { cap, clampNearZero } from '@/util/util';
import { Entity } from '@/core/entities/entity';

export class MoveGame implements State {
  furniture: Entity[] = [];

  charPos: Vec2 = {x: 0, y: 0};
  velocity: Vec2 = {x: 0, y: 0};
  maxSpeed = 3;
  acceleration = 0.02;

  onUpdate(delta: number) {
    this.queryControls(delta);

    const collisions = this.furniture.filter(f => f.collision(character).collides);
    
    if (collisions.length > 0) {
      // Handle collisions
      collisions.forEach(f => {
        // Adjust position and velocity based on collision
        if (this.velocity.x > 0) {
          this.charPos.x = f.pos.x - character.size.x;
        } else if (this.velocity.x < 0) {
          this.charPos.x = f.pos.x + f.size.x;
        }
        if (this.velocity.y > 0) {
          this.charPos.y = f.pos.y - character.size.y;
        } else if (this.velocity.y < 0) {
          this.charPos.y = f.pos.y + f.size.y;
        }
        this.velocity = {x: 0, y: 0};
      });
    } else {
      // Update position if no collision
      this.charPos = {
        x: Math.round(this.charPos.x + this.velocity.x),
        y: Math.round(this.charPos.y + this.velocity.y)
      };
    }
    
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