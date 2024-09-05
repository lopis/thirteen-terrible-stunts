import { drawEngine, HEIGHT, IconKey, WIDTH } from "@/core/draw-engine";
import { character, CHARACTER_SIZE } from "@/core/entities/character";
import { addTimeEvent } from "@/core/timer";
import { GameBase } from "./templates/base.game";
import { interpolate } from "@/util/util";
import { gameData } from "@/core/game-data";

// before this level: 68%

let radius = 40;
const initialPos = -7;
const difficultyRange:[number,number] = [3000, 2500];

class BoatWheel extends GameBase {
  wheelPos = 0;
  wheelOffset = 0;
  wheelTurnTime = 3000;
  characterPos = initialPos;
  
  isJumping = false;
  jumpProgress = 0;
  jumpTime = 50;

  isFalling = false;
  isDrifting = false;

  onEnter() {
    super.onEnter();
    this.timeLeft = 5;
    const difficulty = gameData.getDifficulty(); // From 0.0 to 1.0
    this.wheelTurnTime = interpolate(difficultyRange, difficulty);

    this.text = 'Stay dry';
    character.mirror = true;
    this.characterPos = initialPos;
    this.wheelPos = 0;
    this.wheelOffset = Math.cos(this.wheelPos * 2 * Math.PI) / 20;
    this.isFalling = false;
    this.isDrifting = false;
    this.setCharacterPos();
  }

  timeOver(): void {
    this.nextLevel();
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);

    if (!this.isStarting && !this.isEnding) {
      this.wheelPos += delta / this.wheelTurnTime;
      this.wheelOffset = Math.cos(this.wheelPos * 2 * Math.PI) / 20;
      
      if (this.wheelPos >= 1) {
        this.wheelPos -= 1;
      }

      if (!this.isFalling && !this.isDrifting) {
        if (character.pos.y > (HEIGHT/2 + 20)) {
          this.isFalling = false;
          this.isDrifting = true;
          addTimeEvent(() => this.loseLife(), 500);
        } else if (character.pos.x < (WIDTH/2 - 20)) {
          this.isFalling = true;
          this.isDrifting = false;
          addTimeEvent(() => this.loseLife(), 500);
        } else {
          this.setCharacterPos();
        }
      }
    }

    if (this.isDrifting) {
      character.pos.y += 0.04 * delta;
      character.pos.x -= 0.2 * delta;
    } else if (this.isFalling) {
      character.pos.x -= 0.04 *delta;
      character.pos.y += 0.2 *delta;
      if (character.pos.y > HEIGHT * 0.6) {
        this.isDrifting = true;
      }
    }

    if (this.isJumping) {
      this.jumpProgress += delta / this.jumpTime;
      
      if (this.jumpProgress > 1) {
        this.isJumping = false;
        this.jumpProgress = 0;
      }
    }

    drawEngine.drawBoatWheel(this.wheelPos + this.wheelOffset);
    character.mirror = !this.isDrifting;
    if (this.isDrifting) {
      character.drawDrowning();
    } else {
      character.draw(this.isJumping ? IconKey.jumping : IconKey.base);
    }
  }

  setCharacterPos() {
    let pos = (this.wheelPos + this.wheelOffset - this.characterPos/8) % 1;
    if (this.isJumping) {
      pos = (this.wheelPos + this.wheelOffset - (this.characterPos - 1 + this.jumpProgress)/8) % 1;
    }
    
    const angle = pos * 2 * Math.PI;
    character.setPos(
      WIDTH/2 +  (radius * 1.5) * Math.cos(angle) - CHARACTER_SIZE/2,
      HEIGHT/2 + (radius * 1.5) * Math.sin(angle) - CHARACTER_SIZE,
    );
  }

  onUp(){
    if (!this.isStarting && !this.isEnding && !this.isJumping) {
      this.characterPos++;
      this.isJumping = true;
      this.jumpProgress = 0;
    }
  }
}

export default new BoatWheel();