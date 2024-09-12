import { Building, BUILDING_WIDTH, FLOOR_HEIGHT } from "@/core/entities/building";
import { GameBase } from "./templates/base.game";
import { colors, drawEngine, HEIGHT, npcIcons, WIDTH } from "@/core/draw-engine";
import { interpolate } from "@/util/util";
import { controls } from "@/core/controls";
import { character } from "@/core/entities/character";
import { addTimeEvent } from "@/core/timer";

class BalancingGame extends GameBase {
  progress = 0;
  jumpProgress = 0;
  isFalling = false;
  buildings: Building[] = [
    -BUILDING_WIDTH / 2,
    WIDTH - BUILDING_WIDTH / 2
  ].map(x => new Building({x, y: HEIGHT - FLOOR_HEIGHT*2 - 50}, 2));

  onEnter() {
    super.onEnter();
    this.maxTime = 5;
    this.timeLeft = 5;
    this.text = "DON'T MOVE";
    this.progress = 0;
    this.jumpProgress = 0;
    this.isFalling = false;
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
    let modifiedProgress = this.progress * 0.98 + 0.02 * Math.cos(this.progress * 2 * Math.PI * 4);
    drawEngine.drawRect({x: 0, y: HEIGHT-60}, {x: WIDTH, y: 60}, colors.gray, colors.gray);
    this.buildings.forEach(b => b.update());
    const xOffset = Math.sin(this.progress * 2 * Math.PI * 4);
    const x = Math.floor(interpolate([BUILDING_WIDTH/2, WIDTH - BUILDING_WIDTH/2], modifiedProgress));
    
    let i;
    for(i = 0; i < 7; i++) {
      drawEngine.drawIcon(
        npcIcons[i % 3],
        {
          x: x - xOffset*i + (this.isFalling ? 5 * this.jumpProgress * (i % 2 ? 1 : -1) * i : 0),
          y: HEIGHT - 65 - i*14*(1 - (this.isFalling ? this.jumpProgress*this.jumpProgress : 0)),
        }
      );
    }

    if(this.progress < 1 && !this.isFalling) {
      character.setPos(x - xOffset*i, HEIGHT - 65 - i*14);
    }
    
    if (!this.isStarting && !this.isEnding && !this.isFalling) {
      if (this.progress < 1) {
        this.progress += delta / ((this.maxTime-1) * 1000);
      } else {
        character.setPos(
          x - xOffset*i + 30 * this.jumpProgress,
          HEIGHT - 65 - i*14 - 30 * Math.sin(this.jumpProgress * Math.PI * 0.98),
        );
      }

      if (this.progress >= 1 && this.jumpProgress < 1) {
        this.jumpProgress = Math.min(1, this.jumpProgress + delta / 300);
      }

      const hasMoved = controls.isUp || controls.isDown || controls.isLeft || controls.isRight;
      if (hasMoved && !this.isFalling) {
        console.log("fall");
        this.isFalling = true;
        this.jumpProgress = 0;
        addTimeEvent(() => {
          this.loseLife();
        }, 500);
      }

    }
    if (this.isFalling && this.jumpProgress < 1) {
      this.jumpProgress = Math.min(1, this.jumpProgress + delta / 200);
      character.setPos(
        x - xOffset*i,
        HEIGHT - 65 - i*14 * (1 - this.jumpProgress),
      );
    }
    
    character.drawStanding();
  }

  timeOver(): void {
    this.nice();
  }
}

export default new BalancingGame();