import { drawEngine, icons } from "@/core/draw-engine";
import { MoveGame } from "./move.game";

export class CoffeeGame extends MoveGame {
  constructor() {
    super();
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);

    drawEngine.drawIcon(icons.chair, {x: 100, y: 100});
    drawEngine.drawIcon(icons.table, {x: 116, y: 100});
    drawEngine.drawIcon(icons.chair, {x: 132, y: 100}, false, true);
    drawEngine.drawIcon(icons.plant, {x: 116, y: 80});
  }
}