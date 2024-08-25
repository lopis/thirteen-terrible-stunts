import { CHARACTER_SIZE } from "@/core/entities/character";
import { BuildingJumpGame } from "./building-jump.game";
import { Building, BUILDING_WIDTH } from "@/core/entities/building";
import { colors, drawEngine, HEIGHT, WIDTH } from "@/core/draw-engine";
import { Platform } from "@/core/entities/platform";
import { Collider } from "@/core/entities/collider";

class TrampolinGame extends BuildingJumpGame {
  trampolin = new Collider(
    {x: WIDTH/2, y: HEIGHT - 30},
    {x: CHARACTER_SIZE * 3, y: 5}
  );

  onEnter() {
    super.onEnter();
    this.text = 'Jump over';

    this.deathColliders = [new Platform(
      { x: 0, y: HEIGHT - 20 },
      { x: WIDTH, y: 20 },
      colors.gray
    )];
    this.platforms = [
      new Building({x: -2*BUILDING_WIDTH/3, y: 50 + CHARACTER_SIZE}),
      new Building({x: WIDTH -BUILDING_WIDTH/3, y: 50 + CHARACTER_SIZE}),
    ];
    this.goalColliders = [
      new Collider(this.platforms[1].pos, {x: BUILDING_WIDTH, y: 1})
    ];
  }

  onUpdate(delta: number): void {
    const {collides, standsOn} = this.trampolin.collision();
    if (collides || standsOn) {
      console.log('collided');
      
      this.velocity.y = -this.velocity.y;
    }

    const trampolinPos = this.trampolin.pos;
    const trampolinSize = this.trampolin.size;
    [
      {
        pos: {x: trampolinPos.x + 3, y: trampolinPos.y + trampolinSize.y - 1 }, 
        size: {x: 3, y: 8},
      },
      { 
        pos: {x: trampolinPos.x - 6 + trampolinSize.x, y: trampolinPos.y + trampolinSize.y - 1 }, 
        size: {x: 3, y: 8},
      },
      { 
        pos: trampolinPos, 
        size: trampolinSize,
      }
    ].forEach(({ pos, size }) => {
      drawEngine.drawRect(pos, size, colors.black, colors.white);
    });
    super.onUpdate(delta);
  }
}

export const trampolinGame = new TrampolinGame();