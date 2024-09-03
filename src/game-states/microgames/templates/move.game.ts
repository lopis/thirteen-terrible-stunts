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

  entities: Entity[][] = Array.from({ length: 16 }, () => []);

  maxSpeed = 3;
  acceleration = 0.02;
  plankSize = 13;
  planks = HEIGHT / this.plankSize;

  onUpdate(delta: number) {
    super.onUpdate(delta);

    if (!this.isEnding) {
      [...this.entities.flat(), ...this.walls].forEach(f => {
        const collision = f.collision();
        if (collision.collides) {
          if (collision.right) {
            character.pos.x = f.pos.x + f.size.x;
            character.velocity.x = 0;
          }
          if (collision.left) {
            character.pos.x = f.pos.x - f.size.x;
            character.velocity.x = 0;
          }
          if (collision.bottom) {
            character.pos.y = f.pos.y + f.size.y;
            character.velocity.y = 0;
          }
          if (collision.top) {
            character.pos.y = f.pos.y - f.size.y;
            character.velocity.y = 0;
          }
        }
      });

      character.move();
      
      character.velocity = {
        x: clampNearZero(cap(character.velocity.x, -this.maxSpeed, this.maxSpeed)),
        y: clampNearZero(cap(character.velocity.y, -this.maxSpeed, this.maxSpeed)),
      };
    }

    if (character.velocity.x != 0 || character.velocity.y != 0) {
      character.drawWalking(delta);
    } else {
      character.drawStanding();
    }
  }

  queryControls(delta: number) {
    if (controls.isUp) {
      character.velocity.y -= this.acceleration * delta;
    } else if (controls.isDown) {
      character.velocity.y += this.acceleration * delta;
    } else {
      if (character.velocity.y > 0) {
        character.velocity.y = Math.max(0, character.velocity.y - this.acceleration * delta);
      } else if (character.velocity.y < 0) {
        character.velocity.y = Math.min(0, character.velocity.y + this.acceleration * delta);
      }
    }

    if (controls.isLeft) {
      character.velocity.x -= this.acceleration * delta;
      character.mirror = true;
    } else if (controls.isRight) {
      character.velocity.x += this.acceleration * delta;
      character.mirror = false;
    } else {
      if (character.velocity.x > 0) {
        character.velocity.x = Math.max(0, character.velocity.x - this.acceleration * delta);
      } else if (character.velocity.x < 0) {
        character.velocity.x = Math.min(0, character.velocity.x + this.acceleration * delta);
      }
    }
  }
}