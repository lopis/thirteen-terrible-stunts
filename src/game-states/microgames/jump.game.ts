import { character, CHARACTER_SIZE } from '@/core/entities/character';
import { controls } from '@/core/controls';
import { State } from '@/core/state';
import { Vec2 } from '@/util/types';
import { cap, clampNearZero } from '@/util/util';
import { Collider } from '@/core/entities/collider';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from '../menu.state';
import { Building } from '@/core/entities/building';

export class JumpGame implements State {
  velocity: Vec2 = {x: 0, y: 0};
  maxSpeed = 4;
  acceleration = { x: 0.3, y: 0.05 };
  jumpSpeed = 7;

  timeJumping = 0;
  maxTimeJumping = 100;

  jumps = 0;
  maxJumps = 2;
  platforms: Building[] = [];
  death: Collider = new Collider(
    { x: 0, y: c2d.height },
    { x: c2d.width, y: 10 },
  );
  isGrounded = false;

  onEnter() {
    character.pos = {x: 0, y: 50};
    this.platforms.push(
      new Building({x: 2, y: 100 + CHARACTER_SIZE}),
      new Building({x: c2d.width - 102, y: 120 + CHARACTER_SIZE}),
    );
  }

  onUpdate(delta: number) {
    if(this.death.collision(character).collides) {
      gameStateMachine.setState(menuState);
    }

    this.queryControls(delta);
    
    this.velocity = {
      x: clampNearZero(cap(this.velocity.x, -this.maxSpeed, this.maxSpeed)),
      y: clampNearZero(this.velocity.y),
    };

    character.pos = {
      x: cap(Math.round(character.pos.x + this.velocity.x), 0, c2d.width - CHARACTER_SIZE),
      y: cap(Math.round(character.pos.y + this.velocity.y), 0, c2d.height) + 1,
    };
    const platform = this.platforms.find(p => p.standsOn(character));

    this.platforms.forEach(p => {
      p.update();
    });

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

    if (this.velocity.x === 0 && this.velocity.y === 0) {
      character.drawStanding();
    } else if(this.velocity.y === 0) {
      character.drawWalking(delta);
    } else if(this.velocity.y > 0) {
      character.drawFalling();
    } else if(this.velocity.y < 0) {
      character.drawJumping();
    }
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

    // if (!controls.isUp) {
    //   this.jumpSpeed = 0;
    // }

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