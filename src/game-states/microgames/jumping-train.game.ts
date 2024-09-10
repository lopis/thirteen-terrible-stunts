import { character, CHARACTER_SIZE } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Collider } from '@/core/entities/collider';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { Platform } from '@/core/entities/platform';
import { interpolate, vecAdd } from '@/util/util';
import { gameData } from '@/core/game-data';
import { drawText } from '@/core/font';

const trainSize = 70;

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  goalSize: [4, 2.5],
  trainSpeed: [130, 200],
};

export class BuildingJumpGame extends JumpGame {
  acceleration = { x: 0.05, y: 0.05 };
  jumpSpeed = 6;
  trainSpeed = 150;
  trainNum = 4;
  maxFallSpeed = 7;
  goalSize = 3;

  onEnter() {
    super.onEnter();
    this.text = 'Land safely';

    const difficulty = gameData.getDifficulty();
    this.goalSize = interpolate(difficultyRange.goalSize, difficulty);
    this.trainSpeed = interpolate(difficultyRange.trainSpeed, difficulty);

    this.platforms = [];
    for (let i = 0; i < this.trainNum; i++) {
      const platform = new Platform({x: i * (3 * trainSize + 25), y: 152}, {x: 3*trainSize, y: trainSize});
      platform.setColor(colors.gray, colors.light);
      this.platforms.push(platform);
    }
    this.deathColliders = [new Collider(
      { x: 0, y: HEIGHT - 10 },
      { x: WIDTH, y: 10 },
    )];
    this.goalCollider = new Collider(
      {x: WIDTH - 102, y: HEIGHT - 45},
      {x: CHARACTER_SIZE * this.goalSize, y: 10}
    );

    character.pos = {x: 20, y: 70};
  }

  onUpdate(delta: number): void {
    drawEngine.drawRect({x: 0, y: HEIGHT - 35}, {x: WIDTH, y: 35}, colors.gray, colors.gray);

    this.goalCollider!.render(colors.white, colors.black);

    super.onUpdate(delta);

    if (!this.isStarting && !this.isEnding) {
      character.pos.x -= this.acceleration.x * delta;
    }

    // Draw train extras (trains are platforms)
    this.platforms.forEach((p, i) => {
      if (!this.isStarting) {
        p.pos.x -= delta * this.trainSpeed / 1000;
      }
      drawEngine.drawIcon(IconKey.wheel, vecAdd(p.pos, 16, trainSize - 8));
      drawEngine.drawIcon(IconKey.wheel, vecAdd(p.pos, 16*3, trainSize - 8));
      drawEngine.drawIcon(IconKey.wheel, vecAdd(p.pos, 3 * trainSize - 16, trainSize - 8));
      drawEngine.drawIcon(IconKey.wheel, vecAdd(p.pos, 3 * trainSize - 16*3, trainSize - 8));
      drawText({
        text: (this.trainNum - i).toString(),
        x: p.pos.x + 15,
        y: p.pos.y + 15,
        size: 6,
        color: colors.gray,
      });
    });
  }

  renderCharacter(delta: number) {
    if (character.dead) {
      character.drawDead();
    } else if (this.isEnding) {
      character.drawStanding();
    } else {
      character.drawWalking(delta);
    }
  }
}

export default new BuildingJumpGame();