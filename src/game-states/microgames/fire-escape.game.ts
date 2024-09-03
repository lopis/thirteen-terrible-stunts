import { character } from "@/core/entities/character";
import { BuildingClimbGame } from "./building-climb.game";
import { colors, drawEngine, HEIGHT, WIDTH } from "@/core/draw-engine";
import { BUILDING_WIDTH, FLOOR_HEIGHT } from "@/core/entities/building";

class FireEscapeGame extends BuildingClimbGame {
  ladders: number[] = [];

  onEnter(): void {
    super.onEnter();
    this.ladders = [];
    character.pos = {x: WIDTH / 2, y: HEIGHT / 2};
    for(let p=0; p < this.platforms.length - 1; p++) {
      this.ladders.push(10 + Math.floor(Math.random() * (BUILDING_WIDTH - 30) / 25) * 25);
    }
  }

  hasWon(): boolean {
    return this.platforms[this.platforms.length - 1].standsOn();
  }

  drawExtras() {
    const {x, y} = this.platforms[0].pos;

    this.ladders.forEach((ladderPos, index) => {
      drawEngine.ctx.save();
      drawEngine.ctx.translate(x + ladderPos, y + index*FLOOR_HEIGHT);
      [0, 10].forEach(x1 => drawEngine.drawRect({x: x1, y:0}, {x: 2, y:FLOOR_HEIGHT}, colors.black));
      for(let i=0; i<6; i++) {
        drawEngine.drawRect({x:0, y: 6 + 7 * i}, {x: 10, y:2}, colors.black);
      }
      drawEngine.ctx.restore();
    });

  }
}

export default new FireEscapeGame();