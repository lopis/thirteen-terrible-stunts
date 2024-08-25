import { Vec2 } from "@/util/types";
import { colors, drawEngine } from "../draw-engine";
import { Collider } from "./collider";

export class Platform extends Collider {
  stroke = colors.black;
  fill = colors.black;

  constructor(pos: Vec2, size: Vec2, stroke?: string, fill?: string) {
    super(pos, size);
    this.stroke = stroke || '';
    this.fill = fill || this.stroke;
  }

  update() {
    drawEngine.drawRect(this.pos, this.size, this.stroke, this.fill);
  }
}