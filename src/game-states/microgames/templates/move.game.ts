import { character } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { cap, clampNearZero } from '@/util/util';
import { Collider } from '@/core/entities/collider';
import { Entity } from '@/core/entities/entity';
import { GameBase } from './base.game';
import { HEIGHT, WIDTH } from '@/core/draw-engine';

export class MoveGame extends GameBase {
  walls: Collider[] = [
    [-10, -10, 10, HEIGHT],
    [-10, -10, WIDTH, 10],
    [WIDTH, -10, 10, HEIGHT],
    [-10, HEIGHT, WIDTH, 10],
  ].map(([x,y,w,h]) => new Collider({x,y}, {x:w, y:h}));

  entities: Entity[] = [];

  maxSpeed = 3;
  acceleration = 0.02;
  plankSize = 13;
  planks = HEIGHT / this.plankSize;

  onUpdate(delta: number) {
    super.onUpdate(delta);

    if (!this.isEnding) {
      [...this.entities, ...this.walls].forEach(f => {
        const collision = f.collision();
        if (collision.collides) {
          if (collision.right) {
            this.velocity.x = -this.velocity.x;
            character.pos.x -= -this.velocity.x;
          }
          if (collision.left) {
            this.velocity.x = -this.velocity.x;
            character.pos.x -= -this.velocity.x;
          }
          if (collision.bottom) {
            this.velocity.y = -this.velocity.y;
            character.pos.y -= -this.velocity.y;
          }
          if (collision.top) {
            this.velocity.y = -this.velocity.y;
            character.pos.y -= -this.velocity.y;
          }
        }
      });

      character.move(
        this.velocity.x,
        this.velocity.y
      );
      
      this.velocity = {
        x: clampNearZero(cap(this.velocity.x, -this.maxSpeed, this.maxSpeed)),
        y: clampNearZero(cap(this.velocity.y, -this.maxSpeed, this.maxSpeed)),
      };
    }

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