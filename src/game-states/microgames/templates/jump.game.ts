import { character, CHARACTER_SIZE } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { cap, clampNearZero } from '@/util/util';
import { Collider } from '@/core/entities/collider';
import { GameBase } from './base.game';
import { HEIGHT, WIDTH } from '@/core/draw-engine';
import { Platform } from '@/core/entities/platform';

export default class JumpGame extends GameBase {
  maxSpeed = 4;
  acceleration = { x: 0.3, y: 0.05 };
  jumpSpeed = 7;

  timeJumping = 0;
  maxTimeJumping = 100;

  jumps = 0;
  maxJumps = 2;
  platforms: Platform[] = [];
  deathColliders: Collider[] = [];
  goalColliders: Collider[] = [];
  isGrounded = false;

  onEnter() {
    super.onEnter();
    character.dead = false;
    character.pos = {x: 20, y: 20};
    this.velocity = {x: 0, y: 0};
  }

  onUpdate(delta: number) {
    if(!this.isEnding && this.deathColliders.some((c) => c.collision().collides)) {
      character.dead = true;
      this.loseLife();
    }

    [...this.platforms, ...this.deathColliders, ...this.goalColliders].forEach(p => {
      p.update(delta);
    });

    if (!this.isEnding) {
      this.velocity = {
        x: clampNearZero(cap(this.velocity.x, -this.maxSpeed, this.maxSpeed)),
        y: clampNearZero(this.velocity.y),
      };
  
      character.setPos(
        cap(character.pos.x + this.velocity.x, 0, WIDTH - CHARACTER_SIZE),
        cap(character.pos.y + this.velocity.y, -HEIGHT, HEIGHT) + 1,
      );
      const platform = this.platforms.find(p => p.standsOn());
  
      if(!this.isEnding && this.goalColliders.some((c) => {
        const {collides, standsOn} = c.collision();
        return collides || standsOn;
      })) {
        this.nextLevel();
      }
  
      // Ensure character doesn't fall below the floor
      if (platform) {
        character.pos.y = platform.pos.y - CHARACTER_SIZE;
        this.velocity.y = 0;
        this.timeJumping = 0;
        this.jumps = 0;
        this.isGrounded = true;
      } else {
        this.velocity.y += this.acceleration.y * delta;
        this.isGrounded = false;
      }
    }
  
    if (character.dead) {
      character.drawDead();
    } else if (this.velocity.x === 0 && this.velocity.y === 0) {
      character.drawStanding();
    } else if(this.velocity.y === 0) {
      character.drawWalking(delta);
    } else if(this.velocity.y > 0) {
      character.drawFalling();
    } else if(this.velocity.y < 0) {
      character.drawJumping();
    }

    super.onUpdate(delta);
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
          this.velocity.x = Math.max(0, this.velocity.x - this.acceleration.x * delta);
        } else if (this.velocity.x < 0) {
          this.velocity.x = Math.min(0, this.velocity.x + this.acceleration.x * delta);
        }
      }
    }
  }
}