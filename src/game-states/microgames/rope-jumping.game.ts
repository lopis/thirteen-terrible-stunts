import { character, CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { Collider } from '@/core/entities/collider';
import { colors, drawEngine, HEIGHT, WIDTH } from '@/core/draw-engine';
import { interpolate, vecAdd } from '@/util/util';
import { gameData } from '@/core/game-data';

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  swingTime: [2500, 1800],
  ropeHeight: [120, 100],
};

export class RopeJumpingGame extends JumpGame {
  acceleration = { x: 0.01, y: 0.05 };
  rope = new Collider({x:0,y:0}, {x:5,y:5});
  ropeHeight = 110;
  swingTime = 2000;
  swingPos = 1; // from 0 to 1
  grabbing = false;
  isJumping = false;
  maxSpeed = 3;

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
    const goalX = WIDTH - BUILDING_WIDTH/3;
    this.goalCollider = new Collider(
      {x: goalX, y: 100 + CHARACTER_SIZE - 1},
      {x: Math.min(WIDTH - goalX, BUILDING_WIDTH), y: 10}
    );

    const difficulty = gameData.getDifficulty();
    this.swingTime = interpolate(difficultyRange.swingTime, difficulty);
    this.ropeHeight = interpolate(difficultyRange.ropeHeight, difficulty);
  }

  onUpdate(delta: number) {
    this.swingPos += delta / this.swingTime;
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

    super.onUpdate(delta);
  }

  onUp() {
    this.isJumping = true;
  }
}

export default new RopeJumpingGame();