import { drawEngine, HEIGHT, IconKey, WIDTH } from "@/core/draw-engine";
import { MoveGame } from "./templates/move.game";
import { character } from "@/core/entities/character";
import { Collider } from "@/core/entities/collider";
import { Entity } from "@/core/entities/entity";

class FallingBuildingGame extends MoveGame {
  progress = 0;
  houseFallDuration = 5000;
  windowOffset = 0.2;
  windowSize = {x: 0.2, y: 0.1};
  goalCollider: Collider | null = null;

  onEnter(){
    super.onEnter();
    this.progress = 0;
    this.text = 'Stay in';
    character.setPos(150, 150);
    this.goalCollider = new Collider(
      {x: WIDTH*(1-this.windowOffset*2), y: HEIGHT / 2 - HEIGHT * this.windowSize.y},
      {x: WIDTH*this.windowSize.x, y: HEIGHT * this.windowSize.y * 2},
    );

    this.entities = [];
    for(let i = 0; i < 5; i++) {
      const x = Math.round((Math.random() * 0.5 + 0.25) * WIDTH / 16)*16;
      const y = Math.round((Math.random() * 0.5 + 0.25) * HEIGHT / 16)*16;
      this.entities.push(new Entity({x, y}, IconKey.plant));
    }
  }

  onUpdate(delta: number) {
    super.onUpdate(delta);
    this.entities.forEach(f => f.update());
    if (!this.isStarting) {
      if (this.progress >= 1) {
        if (!this.isEnding) {
          if (this.goalCollider?.collision().collides) {
            this.nextLevel();
          } else {
            this.loseLife();
          }
        }
      } else {
        this.progress += delta / this.houseFallDuration;
      }
      drawEngine.drawHouse(Math.pow(this.progress, 2), this.windowSize, this.windowOffset);
    }
  }
}

export const fallingBuildingGame = new FallingBuildingGame();