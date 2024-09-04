import { COLUMNS, drawEngine, HEIGHT, IconKey, ROWS, WIDTH } from "@/core/draw-engine";
import { MoveGame } from "./templates/move.game";
import { character } from "@/core/entities/character";
import { Collider } from "@/core/entities/collider";
import { Entity } from "@/core/entities/entity";
import { gameData } from "@/core/game-data";
import { interpolate } from "@/util/util";

const difficultyRange: Record<string, [number,number]> = {
  bushNum: [10, 30],
  houseFallDuration: [5000, 2000]
};

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
    character.setPos(160, 160);
    const difficulty = gameData.getDifficulty(); // From 0.0 to 1.0
    const bushNum = interpolate(difficultyRange.bushNum, difficulty);
    this.houseFallDuration = interpolate(difficultyRange.houseFallDuration, difficulty);

    const originalWidth = WIDTH * this.windowSize.x;
    const originalHeight = HEIGHT * this.windowSize.y * 2;
    const newWidth = originalWidth * 0.6;
    const newHeight = originalHeight * 0.6;
    const originalX = WIDTH * (1 - this.windowOffset * 2);
    const originalY = HEIGHT / 2 - HEIGHT * this.windowSize.y;
    const newX = originalX + (originalWidth - newWidth) / 2;
    const newY = originalY + (originalHeight - newHeight) / 2;
    this.goalCollider = new Collider(
      { x: newX, y: newY },
      { x: newWidth, y: newHeight }
    );

    this.entities = Array.from({ length: ROWS }, () => []);
    for(let n = 0; n < bushNum; n++) {
      let isUnique = false;
      let x = 0, y = 0;
      while (!isUnique) {
        x = Math.floor((Math.random()) * COLUMNS);
        y = Math.floor((Math.random()) * ROWS);

        isUnique = !this.entities[y][x];
        for (let i = -1; i <= 1 && isUnique; i++) {
          for (let j = -1; j <= 1 && isUnique; j++) {
            if (((character.pos.x == (x+j)*16) && (character.pos.y == (y+i) * 16))) {
              isUnique = false;
            }
          }
        }
      }
      this.entities[y][x] = new Entity({x: x*16, y: y*16}, IconKey.plant);
    }
  }

  onUpdate(delta: number) {
    super.onUpdate(delta);
    // this.goalCollider?.render('#00ff0055');
    this.entities.flat().forEach(f => f.update());
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
      drawEngine.drawHouse(Math.pow(this.progress, 3), this.windowSize, this.windowOffset);
    }
  }
}

export const fallingBuildingGame = new FallingBuildingGame();