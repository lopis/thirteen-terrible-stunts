import { colors, drawEngine, HEIGHT, IconKey, npcIcons, WIDTH } from "@/core/draw-engine";
import { MoveGame } from "./templates/move.game";
import { Entity } from "@/core/entities/entity";
import { Vec2 } from "@/util/types";
import { character } from "@/core/entities/character";
import { preLoadStrings } from "@/core/font";
import { interpolate, roundTo16 } from "@/util/util";
import { gameData } from "@/core/game-data";

type ObjectProps = [IconKey, Vec2, boolean?]
const getObjects = () => {
  const objects: ObjectProps[] = [
    [IconKey.chair, {x: 100, y: 101}],
    [IconKey.chair, {x: 132, y: 101}, true],
  
    [IconKey.table, {x: 116, y: 101}],
    
    [IconKey.table, {x: 116, y: 116}],
    [IconKey.chair, {x: 132, y: 116}, true],
    [IconKey.chair, {x: 100, y: 116}],
  
    [IconKey.plant, {x: 100, y: 80}],
    [IconKey.plant, {x: 116, y: 80}],
    [IconKey.plant, {x: 132, y: 80}],
    [IconKey.camera, {x: 200, y: 116}, true],
  ];
  return objects.sort((a,b) => (a[1].y) - (b[1].y));
};

// Difficulty range of each property
const difficultyRange: Record<string, [number,number]> = {
  npcNum: [1, 5],
};


preLoadStrings(['TY#'], [colors.black, colors.gray, colors.light], 1);

class CoffeeGame extends MoveGame {
  objects: ObjectProps[] = [];
  coffeeMaker: Entity = new Entity({x: 50, y: 195}, IconKey.coffeMachine, {mirror: true, onTable: true});
  maxCofees = 1;
  npcs:  Vec2[] = [];
  npcNum = 0;

  onEnter(): void {
    if (this.objects.length === 0) {
      this.objects = getObjects();
    }
    this.text = 'Bring coffee';
    this.entities = [];

    this.npcs = [];
    const difficulty = gameData.getDifficulty(); // From 0.0 to 1.0
    console.log('difficulty', difficulty);
    
    this.npcNum = interpolate(difficultyRange.npcNum, difficulty);
    while (this.npcs.length < this.npcNum) {
      let newNpc: Vec2;
      let isUnique = false;
    
      while (!isUnique) {
        newNpc = {
          x: roundTo16((Math.random() * 0.4 + 0.6) * WIDTH),
          y: roundTo16((Math.random() * 0.6 + 0.3) * HEIGHT),
        };
    
        isUnique = !this.npcs.some(npc => npc.x === newNpc.x && npc.y === newNpc.y);
        isUnique && this.npcs.push(newNpc);
      }
    }

    super.onEnter();
    character.setPos(30, 30);
    character.holding = [];
    this.objects.forEach(([icon, pos, mirror = false]) => {
      this.entities.push(new Entity(pos, icon, {mirror}));
    });
    this.npcs.forEach((pos, i) => {
      this.entities.push(new Entity(pos, npcIcons[i%npcIcons.length], {isNPC: true}));
    });
    this.coffeeMaker.hasCollided = false;
    this.entities.push(this.coffeeMaker);
  }

  onUpdate(delta: number): void {
    this.render();
    this.entities.forEach((f) => {
      f.update(delta);
      if (f.isNPC && f.hasCollided) {
        if (!f.holding && character.holding.length > 0) {
          f.holding = IconKey.coffee;
          f.say('TY#');
          character.pop();
          if (!this.entities.some(e => e.isNPC && !e.holding)) {
            this.nextLevel();
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