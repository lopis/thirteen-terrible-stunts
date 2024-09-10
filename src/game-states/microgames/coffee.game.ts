import { colors, COLUMNS, drawEngine, HEIGHT, IconKey, npcIcons, ROWS, WIDTH } from "@/core/draw-engine";
import { MoveGame } from "./templates/move.game";
import { Entity } from "@/core/entities/entity";
import { character } from "@/core/entities/character";
import { preLoadStrings } from "@/core/font";
import { gameData } from "@/core/game-data";
import { interpolate } from "@/util/util";

type ObjectProps = [IconKey, number, number, boolean?]
const objects: ObjectProps[] = [
  [IconKey.plant, 6, 5],
  [IconKey.plant, 7, 5],
  [IconKey.plant, 8, 5],
  [IconKey.chair, 6, 6],
  [IconKey.chair, 8, 6, true],
  [IconKey.table, 7, 6],
  [IconKey.table, 7, 7],
  [IconKey.chair, 8, 7, true],
  [IconKey.chair, 6, 7],
  [IconKey.camera, 12, 7, true],
];

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  npcNum: [1, 5],
};

preLoadStrings(['TY#'], [colors.black, colors.gray, colors.light], 1);

class CoffeeGame extends MoveGame {
  coffeeMaker: Entity = new Entity({x: 48, y: 192}, IconKey.coffeMachine, {mirror: true, onTable: true});
  maxCofees = 1;
  npcNum = 0;

  onEnter(): void {
    this.text = 'Bring coffee';
    this.entities = Array.from({ length: ROWS }, () => []);

    const difficulty = gameData.getDifficulty(); // From 0.0 to 1.0
    
    this.npcNum = interpolate(difficultyRange.npcNum, difficulty);

    super.onEnter();
    character.setPos(30, 30);
    character.holding = [];
    objects.forEach(([icon, x, y, mirror = false]) => {
      this.entities[y][x] = new Entity({x: x * 16, y: y * 16}, icon, {mirror});
    });

    this.coffeeMaker.hasCollided = false;
    this.entities[this.coffeeMaker.pos.y/16][this.coffeeMaker.pos.x/16] = this.coffeeMaker;

    for (let n = 0; n < this.npcNum; n++) {
      let x = 0;
      let y = 0;
      let isUnique = false;
    
      while (!isUnique) {
        x = Math.floor((0.15 + 0.7 *Math.random()) * COLUMNS);
        y = Math.floor((0.15 + 0.7 *Math.random()) * ROWS);
      
        isUnique = true;
        for (let i = -1; i <= 1 && isUnique; i++) {
          for (let j = -1; j <= 1 && isUnique; j++) {
            if (
              this.entities[y + i] && this.entities[y + i][x + j] ||
              ((character.pos.x == x+j) && (character.pos.y == y+i))
            ) {
              isUnique = false;
            }
          }
        }
      }

      this.entities[y][x] = new Entity(
        {x: x * 16, y: y * 16},
        npcIcons[n % (npcIcons.length)],
        {isNPC: true, mirror: true}
      );
    }
  }

  onLeave(): void {
    character.holding = [];
  }

  onUpdate(delta: number): void {
    this.render();
    this.entities.flat().forEach((f) => {
      f.update(delta);
      if (f.isNPC && f.hasCollided) {
        if (!f.holding && character.holding.length > 0) {
          f.holding = IconKey.coffee;
          f.say('TY#');
          character.pop();
          if (!this.entities.flat().some(e => e.isNPC && !e.holding)) {
            this.nice();
          }
        } else {
          f.hasCollided = false;
        }
      }
    });

    // Get coffees
    if (this.coffeeMaker.hasCollided && character.holding.length < this.maxCofees) {
      while(character.holding.length < this.npcNum) {
        character.hold(IconKey.bigCoffee);
      }
    }
    super.onUpdate(delta);
  }

  render() {
    for(let plank = 0; plank < this.planks; plank++) {
      drawEngine.drawRect(
        {x: -1, y: plank * this.plankSize},
        {x: WIDTH +1, y: this.plankSize},
        colors.light,
        colors.white,
      );
    }
    drawEngine.drawRect(
      {x: 180, y: 20},
      {x: 130, y: HEIGHT - 40},
      colors.light,
      colors.white,
    );
  }
}

export default new CoffeeGame();