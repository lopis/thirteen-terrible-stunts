import { Vec2 } from "@/util/types";
import { colors, drawEngine } from "../draw-engine";
import { Platform } from "./platform";
import { roundVec } from "@/util/util";

export const BUILDING_WIDTH = 130;
export const FLOOR_HEIGHT = 50;

export class Building extends Platform {
  floors = 0;

  constructor(pos: Vec2, floors = 3) {
    const size = {x: BUILDING_WIDTH, y: FLOOR_HEIGHT * floors};
    super(roundVec(pos), size);
    this.floors = floors;
  }

  update() {
    drawEngine.drawRect(this.pos, this.size, colors.gray, colors.light);
    for (let floor = 0; floor < this.floors; floor++) {
      const pos = {x: this.pos.x - 1, y: this.pos.y + floor * FLOOR_HEIGHT};
      const size = {x: this.size.x + 2, y: 6};
      drawEngine.drawRect(pos, size, colors.gray, colors.gray);

      for (let w = 0; w < 5; w++) {
        c.save();
        c.translate(this.pos.x + 8 + 25 * w, this.pos.y + 14 + FLOOR_HEIGHT * floor);
        
        // Window
        const height = 12;
        const width = 14;
        drawEngine.drawRect({x: 0, y: 0}, {x: width, y: height}, colors.gray, colors.white);
        drawEngine.drawRect({x: 0, y: height}, {x: width, y: height}, colors.gray, colors.white);

        c.restore();
      }
    }
  }
}