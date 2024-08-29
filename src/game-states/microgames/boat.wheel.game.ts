import { drawEngine, HEIGHT, IconKey, WIDTH } from "@/core/draw-engine";
import JumpGame from "./templates/jump.game";
import { character, CHARACTER_SIZE } from "@/core/entities/character";
import { addTimeEvent } from "@/core/timer";

// before this level: 68%
let radius = 40;
const initialPos = -7;

class BoatWheel extends JumpGame {
  wheelPos = 0;
  wheelTurnTime = 4000;
  characterPos = initialPos;
  isFalling = false;
  isDrifting = false;

  onEnter() {
    super.onEnter();
    this.text = 'Stay dry';
    character.mirror = true;
    this.characterPos = initialPos;
    this.wheelPos = 0;
    this.isFalling = false;
    this.isDrifting = false;
    this.setCharacterPos();
  }

  onUpdate(delta: number): void {
    if (!this.isStarting) {
      this.wheelPos += delta / this.wheelTurnTime;
      if (this.wheelPos >= 1) {
        this.wheelPos -= 1;
      }

      if (!this.isFalling && !this.isDrifting) {
        const pos = (this.wheelPos - (this.characterPos%8)/8);    
        if (pos <= 0.7 && pos >= 0.07) {
          this.isFalling = pos > 0.5;
          this.isDrifting = !this.isFalling;
          console.log(this.isFalling, this.isDrifting);
          
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

    drawEngine.drawBoatWheel(this.wheelPos);
    character.draw(character.dead ? IconKey.dead : IconKey.base);
  }
  setCharacterPos() {
    const pos = (this.wheelPos - this.characterPos/8) % 1;
    
    const angle = pos * 2 * Math.PI;
    character.setPos(
      WIDTH/2 +  (radius * 1.4) * Math.cos(angle) - CHARACTER_SIZE/2,
      HEIGHT/2 + (radius * 1.4) * Math.sin(angle) - CHARACTER_SIZE,
    );
  }

  onConfirm(){
    if (!this.isStarting && !this.isEnding) {
      this.characterPos++;
    }
  }
}

export default new BoatWheel();