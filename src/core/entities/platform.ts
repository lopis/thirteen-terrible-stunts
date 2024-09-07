import { Vec2 } from "@/util/types";
import { colors, drawEngine } from "../draw-engine";
import { Collider } from "./collider";

export class Platform extends Collider {
  stroke = colors.black;
  fill = colors.black;

  constructor(pos: Vec2, size: Vec2) {
    super(pos, size);
  }

  setColor(stroke: string, fill: string) {
    this.stroke = stroke || '';
    this.fill = fill || this.stroke;
  }

  update() {
    drawEngine.drawRect(this.pos, this.size, this.stroke, this.fill);
  }
}