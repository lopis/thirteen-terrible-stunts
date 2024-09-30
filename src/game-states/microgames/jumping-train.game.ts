import { character } from '@/core/entities/character';
import JumpGame from './templates/jump.game';
import { Collider } from '@/core/entities/collider';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { Platform } from '@/core/entities/platform';
import { interpolate, vecAdd } from '@/util/util';
import { drawText } from '@/core/font';
import { Building } from '@/core/entities/building';
import { gameData } from '@/core/game-data';

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
    this.text = 'Off board';

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
    this.goalCollider = new Building(
      {x: WIDTH - (this.goalSize * 25), y: HEIGHT - 50},
      1,
      false,
    );

    character.pos = {x: 100, y: 70};
  }

  onUpdate(delta: number): void {
    // Floor
    drawEngine.drawRect({x: 0, y: HEIGHT - 40}, {x: WIDTH, y: 40}, colors.gray, colors.gray);

    super.onUpdate(delta);

    this.platforms.forEach((p) => {
      if (!this.isStarting) {
        p.pos.x -= delta * this.trainSpeed / 1000;
      }
    });

    if (!this.isStarting && !this.isEnding) {
      character.pos.x -= this.acceleration.x * delta * 0.7;
    }
  }

  drawExtras(): void {
    // Draw train extras (trains are platforms)
    this.platforms.forEach((p, i) => {
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

    this.goalCollider?.update(0);

    if (this.goalCollider) {
      drawEngine.drawIcon(IconKey.lamp, {x: this.goalCollider.pos.x + 16, y: this.goalCollider.pos.y - 32});
      drawEngine.drawIcon(IconKey.pole, {x: this.goalCollider.pos.x + 16, y: this.goalCollider.pos.y - 16});
      
      drawEngine.drawIcon(IconKey.lamp, {x: this.goalCollider.pos.x + 64, y: this.goalCollider.pos.y - 32});
      drawEngine.drawIcon(IconKey.pole, {x: this.goalCollider.pos.x + 64, y: this.goalCollider.pos.y - 16});
    }
    super.drawExtras();
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