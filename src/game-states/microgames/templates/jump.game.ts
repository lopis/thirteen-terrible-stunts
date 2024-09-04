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
  maxFallSpeed = 14;

  timeJumping = 0;
  maxTimeJumping = 100;
  readyToJump = true;

  jumps = 0;
  maxJumps = 2;
  platforms: Platform[] = [];
  deathColliders: Collider[] = [];
  goalColliders: Collider[] = [];
  isGrounded = true;
  maxY = HEIGHT*2;
  minY = -HEIGHT;

  onEnter() {
    super.onEnter();
    Object.assign(character, {
      mirror: false,
      dead: false,
      pos: { x: 20, y: 20 },
      velocity: { x: 0, y: 0 }
    });
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
      character.velocity = {
        x: clampNearZero(cap(character.velocity.x, -this.maxSpeed, this.maxSpeed)),
        y: clampNearZero(character.velocity.y),
      };
  
      character.setPos(
        cap(character.pos.x + character.velocity.x, 0, WIDTH - CHARACTER_SIZE),
        cap(character.pos.y + Math.min(this.maxFallSpeed, character.velocity.y), this.minY, this.maxY) + 1,
      );
      const platform = this.platforms.find(p => p.standsOn());
  
      if(!this.isEnding && this.goalColliders.some((c) => c.collision().standsOn)) {
        this.nextLevel();
      }
  
      // Ensure character doesn't fall below the floor
      if (platform) {
        character.pos.y = platform.pos.y - CHARACTER_SIZE;
        character.velocity.y = 0;
        this.timeJumping = 0;
        this.jumps = 0;
        this.isGrounded = true;
      } else {
        character.velocity.y += this.acceleration.y * delta;
        this.isGrounded = false;
      }
    }
  
    this.renderCharacter(delta);

    super.onUpdate(delta);
  }

  renderCharacter(delta: number) {
    if (character.dead) {
      character.drawDead();
    } else if (character.velocity.x === 0 && character.velocity.y === 0) {
      character.drawStanding();
    } else if(character.velocity.y === 0) {
      character.drawWalking(delta);
    } else if(character.velocity.y > 0) {
      character.drawFalling();
    } else if(character.velocity.y < 0) {
      character.drawJumping();
    }
  }

  queryControls(delta: number) {
    if (
      controls.isUp
      && this.jumps < this.maxJumps
      && (!this.isGrounded || this.readyToJump)
    ) {
      if (!controls.previousState.isUp) {
        // New UP press
        this.readyToJump = true;
        this.timeJumping = 0;
        character.velocity.y = Math.min(0, character.velocity.y);
        this.jumps++;
      } else if (this.timeJumping < this.maxTimeJumping) {
        // Continued pressing UP
        this.readyToJump = false;
        this.timeJumping += delta;
        character.velocity.y = -this.jumpSpeed;
      }
    } else if (!controls.isUp) {
      // Reset readyToJump when UP key is released
      this.readyToJump = true;
    }

    if (this.isGrounded) {
      if (controls.isLeft) {
        character.velocity.x -= this.acceleration.x * delta;
      } else if (controls.isRight) {
        character.velocity.x += this.acceleration.x * delta;
      } else if (character.velocity.y == 0) {
        if (character.velocity.x > 0) {
          character.velocity.x = Math.max(0, character.velocity.x - 2*this.acceleration.x * delta);
        } else if (character.velocity.x < 0) {
          character.velocity.x = Math.min(0, character.velocity.x + 2*this.acceleration.x * delta);
        }
      }
    }
  }
}