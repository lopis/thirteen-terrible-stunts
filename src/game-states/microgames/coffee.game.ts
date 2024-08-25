import { colors, drawEngine, HEIGHT, IconKey, npcIcons, WIDTH } from "@/core/draw-engine";
import { MoveGame } from "./templates/move.game";
import { Entity } from "@/core/entities/entity";
import { Vec2 } from "@/util/types";
import { character } from "@/core/entities/character";
import { preLoadStrings } from "@/core/font";

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

let npcs: Vec2[] = [
  {x: 260, y: 116},
];

preLoadStrings(['TY#'], [colors.black, colors.gray, colors.light], 1);

class CoffeeGame extends MoveGame {
  objects: ObjectProps[] = [];
  coffeeMaker: Entity = new Entity({x: 50, y: 195}, IconKey.coffeMachine, {mirror: true, onTable: true});
  maxCofees = 1;

  onEnter(): void {
    if (this.objects.length === 0) {
      this.objects = getObjects();
    }
    this.text = 'Bring coffee';
    this.entities = [];

    super.onEnter();
    character.setPos(30, 30);
    character.holding = [];
    this.objects.forEach(([icon, pos, mirror = false]) => {
      this.entities.push(new Entity(pos, icon, {mirror}));
    });
    npcs.forEach((pos, i) => {
      this.entities.push(new Entity(pos, npcIcons[i], {isNPC: true}));
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
          this.nextLevel();
        } else {
          f.hasCollided = false;
        }
      }
    });

    if (this.coffeeMaker.hasCollided && character.holding.length < this.maxCofees) {
      character.hold(IconKey.bigCoffee);
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