import { Vec2 } from "@/util/types";
import { colors, drawEngine } from "../draw-engine";
import { Collider } from "./collider";

export class Building extends Collider {
  ctx: CanvasRenderingContext2D;

  constructor(pos: Vec2) {
    const size = {x: 130, y: 200};
    super(pos, size);
    this.ctx = drawEngine.ctx;
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

    [0, 50, 100, 150].forEach((y) => {
      const [pos, size] = this.getPlatform(y);
      drawEngine.drawRect(pos, size, colors.gray, colors.gray);
    });

    for (let floor = 0; floor < 3; floor++) {
      for (let w = 0; w < 5; w++) {
        drawEngine.ctx.save();
        drawEngine.ctx.translate(this.pos.x + 8 + 25 * w, this.pos.y + 14 + 50 * floor);
        this.drawWindow();
        drawEngine.ctx.restore();
      }
    }
  }
}