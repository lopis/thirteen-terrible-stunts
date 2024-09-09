import { character } from "@/core/entities/character";
import { BuildingClimbGame } from "./building-climb.game";
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from "@/core/draw-engine";
import { BUILDING_WIDTH, FLOOR_HEIGHT } from "@/core/entities/building";
import { interpolate, roundTo16 } from "@/util/util";
import { gameData } from "@/core/game-data";

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  buildingNum: [4, 6],
};

class FireEscapeGame extends BuildingClimbGame {
  acceleration = { x: 0.3, y: 0.05 };
  maxSpeed = 2;
  ladders: number[] = [];
  fireAnimationProgress = 0;
  fireAnimationTime = 40;
  buildingNum = 5;
  standingOnStairs = false;

  onEnter(): void {
    super.onEnter();
    this.text = ' Escape ';
    this.ladders = [];
    this.standingOnStairs = false;
    
    const difficulty = gameData.getDifficulty();
    this.buildingNum = Math.round(interpolate(difficultyRange.buildingNum, difficulty));

    character.pos = {x: WIDTH / 2, y: HEIGHT / 2};
    for(let p=0; p < this.platforms.length - 1; p++) {
      this.ladders.push(4 + roundTo16(Math.random() * (BUILDING_WIDTH - 32)));
    }
  }

  onUpdate(delta: number): void {
    this.fireAnimationProgress += delta/this.fireAnimationTime;
    super.onUpdate(delta);
  }

  hasWon(): boolean {
    return this.platforms[this.platforms.length - 1].standsOn();
  }

  drawExtras() {
    super.drawExtras();
    const {x, y} = this.platforms[0].pos;

    const fireAnimationFrame = Math.round(this.fireAnimationProgress / 3) % 3;
    this.platforms.forEach((p, i) => {
      drawEngine.drawIcon(
        (fireAnimationFrame >= 1) ? IconKey.fire1 : IconKey.fire2,
        {x: x-4, y: p.pos.y + 10 * Math.cos(i + 1)},
        false,
        fireAnimationFrame % 2 === 0
      );
      drawEngine.drawIcon(
        (fireAnimationFrame >= 1) ? IconKey.fire1 : IconKey.fire2,
        {x: x + BUILDING_WIDTH - 4, y: p.pos.y + 20 * Math.cos(i)},
        false,
        fireAnimationFrame % 2 === 0
      );
    });
    this.platforms[this.platforms.length-1].render(colors.white, colors.black);

    this.standingOnStairs = false;
    this.ladders.forEach((ladderPos, index) => {   
      const standingOnStairs = (
        roundTo16(character.pos.x) === roundTo16(x + ladderPos) &&
        (character.pos.y < y + index*FLOOR_HEIGHT) &&
        (character.pos.y > y + (index-1)*FLOOR_HEIGHT)
      );
      this.standingOnStairs ||= standingOnStairs;
         
      const color = standingOnStairs
        ? colors.black : colors.gray;
      c.save();
      c.translate(x + ladderPos, y + index*FLOOR_HEIGHT);
      [0, 10].forEach(x1 => drawEngine.drawRect({x: x1, y:0}, {x: 2, y:FLOOR_HEIGHT}, color, color));
      for(let i=0; i<6; i++) {
        drawEngine.drawRect({x:0, y: 6 + 7 * i}, {x: 10, y:2}, color, color);
      }
      c.restore();
    });
  }

  onDown() {
    if (this.standingOnStairs) {
      character.velocity.y = 2;
      character.velocity.x = 0;
      character.pos.y += 15;
    }
  }
}

export default new FireEscapeGame();