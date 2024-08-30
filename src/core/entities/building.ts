import { Vec2 } from "@/util/types";
import { colors, drawEngine } from "../draw-engine";
import { Platform } from "./platform";

export const BUILDING_WIDTH = 130;
export const FLOOR_HEIGHT = 50;

export class Building extends Platform {
  floors = 0;

  constructor(pos: Vec2, floors = 3) {
    const size = {x: BUILDING_WIDTH, y: FLOOR_HEIGHT * floors};
    super(pos, size);
    this.floors = floors;
  }

  getPlatform(y: number) {
    return [
      {x: this.pos.x - 1, y: this.pos.y + y},
      {x: this.size.x + 2, y: 6},
    ];
  }

  drawWindow() {
    const height = 12;
    const width = 14;
    drawEngine.drawRect({x: 0, y: 0}, {x: width, y: height}, colors.gray, colors.white);
    drawEngine.drawRect({x: 0, y: height}, {x: width, y: height}, colors.gray, colors.white);
  }

  update() {
    drawEngine.drawRect(this.pos, this.size, colors.gray, colors.light);
    for (let floor = 0; floor < this.floors; floor++) {
      const [pos, size] = this.getPlatform(floor * FLOOR_HEIGHT);
      drawEngine.drawRect(pos, size, colors.gray);

      for (let w = 0; w < 5; w++) {
        drawEngine.ctx.save();
        drawEngine.ctx.translate(this.pos.x + 8 + 25 * w, this.pos.y + 14 + FLOOR_HEIGHT * floor);
        this.drawWindow();
        drawEngine.ctx.restore();
      }
    }
  }
}