import { colors, drawEngine, Icon, icons, npcIcons } from "@/core/draw-engine";
import { MoveGame } from "./move.game";
import { Entity } from "@/core/entities/entity";
import { Vec2 } from "@/util/types";
import { character } from "@/core/entities/character";

type ObjectProps = [Icon, Vec2, boolean?]
let objects: ObjectProps[] = [
  [icons.chair, {x: 100, y: 101}],
  [icons.chair, {x: 132, y: 101}, true],

  [icons.table, {x: 116, y: 101}],
  
  [icons.table, {x: 116, y: 116}],
  [icons.chair, {x: 132, y: 116}, true],
  [icons.chair, {x: 100, y: 116}],

  [icons.plant, {x: 100, y: 80}],
  [icons.plant, {x: 116, y: 80}],
  [icons.plant, {x: 132, y: 80}],
  [icons.camera, {x: 200, y: 116}, true],
  
  [icons.table, {x: 50, y: 200}],
];
objects = objects.sort((a,b) => (a[1].y) - (b[1].y));

let npcs: Vec2[] = [
  {x: 260, y: 116},
];

export class CoffeeGame extends MoveGame {
  coffee: Entity | null = new Entity({x: 50, y: 195}, icons.bigCoffee);

  constructor() {
    super();
  }

  onEnter(): void {
    character.setPos(30, 30);
    objects.forEach(([icon, pos, mirror = false]) => {
      this.entities.push(new Entity(pos, icon, {mirror}));
    });
    npcs.forEach((pos, i) => {
      this.entities.push(new Entity(pos, npcIcons[i], {isNPC: true}));
    });
    this.coffee && this.entities.push(this.coffee);
  }

  onUpdate(delta: number): void {
    for(let plank = 0; plank < this.planks; plank++) {
      drawEngine.drawRect(
        {x: -1, y: plank * this.plankSize},
        {x: c2d.width +1, y: this.plankSize},
        colors.light,
        colors.white,
      );
    }
    drawEngine.drawRect(
      {x: 180, y: 20},
      {x: 130, y: c2d.height - 40},
      colors.light,
      colors.white,
    );
    super.onUpdate(delta);
    this.entities.forEach((f) => {
      f.update(delta);
      if (f.isNPC && f.hasCollided && !f.holding && character.holding.length > 0) {
        f.holding = icons.coffee;
        f.say('TY#');
        character.holding.pop();
      }
    });

    if (this?.coffee?.hasCollided) {
      this.entities = this.entities.filter((entity) => entity !== this.coffee);
      character.hold(icons.bigCoffee);
      this.coffee = null;
    }
  }
}