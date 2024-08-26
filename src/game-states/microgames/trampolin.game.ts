import { CHARACTER_SIZE } from "@/core/entities/character";
import { BuildingJumpGame } from "./building-jump.game";
import { Building, BUILDING_WIDTH } from "@/core/entities/building";
import { colors, drawEngine, HEIGHT, WIDTH } from "@/core/draw-engine";
import { Platform } from "@/core/entities/platform";
import { Collider } from "@/core/entities/collider";
import { gameData } from "@/core/game-data";
import { randomize } from "@/util/util";

const levels = [
  {buildingHeight: 100, trampolinSize: 4, spaceApart: 0.4},
  {buildingHeight: 150, trampolinSize: 3, spaceApart: 0.45},
  {buildingHeight: 180, trampolinSize: 2.5, spaceApart: 0.5},
];

class TrampolinGame extends BuildingJumpGame {
  trampolin = new Collider(
    {x: WIDTH/2 - CHARACTER_SIZE * 3/2, y: HEIGHT - 40},
    {x: CHARACTER_SIZE * 3, y: 15}
  );

  onEnter() {
    super.onEnter();
    this.text = 'Jump over';

    const {buildingHeight, trampolinSize, spaceApart} = randomize(levels[gameData.boss] || levels[2]);

    this.deathColliders = [new Platform(
      { x: 0, y: HEIGHT - 20 },
      { x: WIDTH, y: 20 },
      colors.gray
    )];
    this.platforms = [
      new Building({x: -BUILDING_WIDTH*spaceApart, y: HEIGHT - buildingHeight + CHARACTER_SIZE}),
      new Building({x: WIDTH -BUILDING_WIDTH*(1-spaceApart), y: HEIGHT - buildingHeight + CHARACTER_SIZE}),
    ];
    this.goalColliders = [
      new Collider(this.platforms[1].pos, {x: BUILDING_WIDTH, y: 1})
    ];

    const size = CHARACTER_SIZE * trampolinSize;
    this.trampolin = new Collider(
      {x: WIDTH/2, y: HEIGHT - 40},
      {x: size, y: 15}
    );
  }

  onUpdate(delta: number): void {
    const {collides, standsOn} = this.trampolin.collision();
    if (collides || standsOn) {
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