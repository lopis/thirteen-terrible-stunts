import { character, CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { colors, drawEngine, HEIGHT, WIDTH } from '@/core/draw-engine';
import { vecAdd } from '@/util/util';

export class RopeJumpingGame extends JumpGame {
  acceleration = { x: 0.01, y: 0.05 };
  rope = new Collider({x:0,y:0}, {x:5,y:5});
  ropeHeight = 110;
  swingSpeed = 2000;
  swingPos = 0; // from 0 to 1
  grabbing = false;
  isJumping = false;

  onEnter() {
    super.onEnter();
    this.text = 'Swing over';
    this.grabbing = false;
    this.isJumping = false;

    this.platforms = [
      new Building({x: -BUILDING_WIDTH/2, y: 100 + CHARACTER_SIZE}),
      new Building({x: WIDTH - BUILDING_WIDTH/2, y: 100 + CHARACTER_SIZE}),
    ];
    this.deathColliders = [new Collider(
      { x: 0, y: HEIGHT + 20 },
      { x: WIDTH, y: 10 },
    )];
    this.goalColliders = [new Collider(
      {x: WIDTH - BUILDING_WIDTH/3, y: 100 + CHARACTER_SIZE - 1},
      {x: BUILDING_WIDTH, y: 10}
    )];
  }

  onUpdate(delta: number) {
    super.onUpdate(delta);
    this.swingPos += delta / this.swingSpeed;
    const ropeAngle = Math.sin(this.swingPos * 2 * Math.PI);

    // draw rope
    const x = WIDTH/2 + this.ropeHeight * Math.sin(ropeAngle);
    const y = this.ropeHeight * Math.cos(ropeAngle);
    drawEngine.drawLine(WIDTH/2, -20, x, y, colors.gray);
    this.rope.pos = {x,y};
    this.rope.render(colors.white,colors.black);

    if (!this.isEnding) {
      if (!this.isJumping && !this.grabbing && this.rope.collision().collides) {
        this.grabbing = true;
      }

      if (!this.isJumping && this.grabbing) {
        character.pos = vecAdd(this.rope.pos, -8, -24);
      }

      if (this.isJumping && this.grabbing) {
        character.velocity = {x: Math.sin(ropeAngle) * 4, y: -Math.cos(ropeAngle)};
        this.grabbing = false;
      }

      if(this.isGrounded) {
        this.isJumping = false;
        this.grabbing = false;
      }
    }
  }

  onUp() {
    this.isJumping = true;
  }
}

export default new RopeJumpingGame();