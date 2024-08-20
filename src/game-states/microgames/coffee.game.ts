import { Icon, icons } from "@/core/draw-engine";
import { MoveGame } from "./move.game";
import { Entity } from "@/core/entities/entity";
import { Vec2 } from "@/util/types";

const objects: [Icon, Vec2, boolean?][] = [
  [icons.chair, {x: 100, y: 101}],
  [icons.chair, {x: 100, y: 116}],
  [icons.chair, {x: 100, y: 131}],

  [icons.table, {x: 116, y: 101}],
  [icons.table, {x: 116, y: 116}],
  [icons.table, {x: 116, y: 131}],

  [icons.chair, {x: 132, y: 101}, true],
  [icons.chair, {x: 132, y: 116}, true],
  [icons.chair, {x: 132, y: 131}, true],

  [icons.plant, {x: 116, y: 80}],
];

export class CoffeeGame extends MoveGame {  
  constructor() {
    super();
  }

  onEnter(): void {
    objects.forEach(([icon, pos, mirror = false]) => {
      this.furniture.push(new Entity(pos, icon, mirror));
    });
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
    this.furniture.forEach(f => f.draw());
  }
}