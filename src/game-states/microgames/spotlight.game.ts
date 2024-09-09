import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from "@/core/draw-engine";
import { GameBase } from "./templates/base.game";
import { controls } from "@/core/controls";
import { cap, interpolate } from "@/util/util";
import { gameData } from "@/core/game-data";

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  changeChance: [0.2, 0.2],
  actorSpeed: [0.04, 0.08],
};

const enum ActorState {
  MOVING_LEFT  = 0,
  FACING_LEFT  = 1,
  FACING_RIGHT = 2,
  MOVING_RIGHT = 3,
}

class SpotlightGame extends GameBase {
  actorPos = 0;
  actorSpeed = 0.07;
  actorState = ActorState.MOVING_RIGHT;
  changeChance = 0;

  spotlightSpeed = 0.0002;
  spotlightSize = 0.05;
  spotlightAngle = 0;

  onEnter() {
    super.onEnter();
    this.text = 'Spotlight';
    this.actorPos = WIDTH / 2;
    this.spotlightAngle = 0;
    this.actorState = Math.random() > 0.5 ? ActorState.MOVING_RIGHT : ActorState.MOVING_LEFT;

    const difficulty = gameData.getDifficulty();
    this.actorSpeed = interpolate(difficultyRange.actorSpeed, difficulty);
    this.changeChance = interpolate(difficultyRange.changeChance, difficulty);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);

    // Bottom
    drawEngine.drawRect({x: 0, y: HEIGHT-50}, {x: WIDTH, y: 50}, colors.light, colors.light);

    drawEngine.drawIcon(IconKey.camera, {x: 16, y: HEIGHT-50-16}, false, true);
    for(let i = 0; i < 4; i++) {
      drawEngine.drawIcon(IconKey.plant, {x: WIDTH/2 - 16*i*2 - 24, y: HEIGHT-50-16});
      drawEngine.drawIcon(IconKey.plant, {x: WIDTH/2 + 16*i*2 + 8, y: HEIGHT-50-16});
    }
    const facingLeft = this.actorState == ActorState.FACING_LEFT || this.actorState == ActorState.MOVING_LEFT;
    drawEngine.drawIcon(IconKey.npc1, {x: this.actorPos - 8, y: HEIGHT-50-10}, false, facingLeft);

    // Spotlight
    c.beginPath();
    c.moveTo(WIDTH/2, 80);
    c.globalAlpha = 1;
    c.fillStyle = colors.gray;
    const rightCorner = {
      x: WIDTH/2 +  Math.sin((this.spotlightAngle + this.spotlightSize) * 2 * Math.PI) * HEIGHT * 2,
      y: 80 + HEIGHT * 2 * Math.cos((this.spotlightAngle + this.spotlightSize) * 2 * Math.PI),
    };
    const leftCorner = {
      x: WIDTH/2 +  Math.sin((this.spotlightAngle - this.spotlightSize) * 2 * Math.PI) * HEIGHT * 2,
      y: 80 + HEIGHT * 2 * Math.cos((this.spotlightAngle - this.spotlightSize) * 2 * Math.PI),
    };
    c.lineTo(rightCorner.x, rightCorner.y);
    c.lineTo(WIDTH, HEIGHT);
    c.lineTo(WIDTH, 0);
    c.lineTo(0, 0);
    c.lineTo(0, HEIGHT);
    c.lineTo(leftCorner.x, leftCorner.y);
    c.lineTo(WIDTH/2, 80);
    c.fill();
    drawEngine.drawLine(WIDTH/2, 80, rightCorner.x, rightCorner.y, colors.light);
    drawEngine.drawLine(WIDTH/2, 80, leftCorner.x, leftCorner.y, colors.light);
    drawEngine.drawIcon(IconKey.base, {x: WIDTH/2 - 8, y: 80-16});
    drawEngine.drawIcon(IconKey.wheel, {x: WIDTH/2 - 8, y: 80-8});

    const lightPosX = (WIDTH * 0.5 * 0.9) * Math.sin(2 * Math.PI * this.spotlightAngle);
    const diff = (this.actorPos - WIDTH/2) - lightPosX;
    if (Math.abs(diff) > 40 && !this.isEnding) {
      this.loseLife();
    }

    if (!this.isEnding && !this.isStarting) {
      // Change Direction
      // const isMoving = this.actorState === actorState.MOVING_LEFT || this.actorState === actorState.MOVING_RIGHT;
      // if(delta * Math.random() < this.changeChance * (isMoving ? 1 : 2)) {
      //   const r = Math.random();
      //   if (r > 0.5) {
      //     this.actorState = Math.abs(this.actorState - 1);
      //   } else {
      //     this.actorState += (this.actorState === 3 ? -1 : 1);
      //   }
      // }
      this.actorPos += delta * this.actorSpeed * (
        this.actorState === ActorState.MOVING_LEFT ? -1
        : this.actorState === ActorState.MOVING_RIGHT ? 1
        : 0
      );
    }

    if (this.actorPos > WIDTH*0.8 && this.actorState === ActorState.MOVING_RIGHT) {
      this.actorState = ActorState.MOVING_LEFT;
    } else if (this.actorPos < WIDTH*0.2 && this.actorState === ActorState.MOVING_LEFT) {
      this.actorState = ActorState.MOVING_RIGHT;
    }
  }

  timeOver(): void {
    this.nice();
  }

  queryControls(delta: number): void {
    if(controls.isRight) {
      this.spotlightAngle += delta * this.spotlightSpeed;
    }
    if(controls.isLeft) {
      this.spotlightAngle -= delta * this.spotlightSpeed;
    }
    this.spotlightAngle = cap(this.spotlightAngle, -0.125, 0.125);
  }
}

export default new SpotlightGame();