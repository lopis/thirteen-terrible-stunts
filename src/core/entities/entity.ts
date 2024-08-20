import { Vec2 } from "@/util/types";
import { drawEngine, Icon } from "../draw-engine";
import { Collider } from "./collider";

export class Entity extends Collider {
  ctx: CanvasRenderingContext2D;
  icon: Icon;
  mirror: boolean;

  constructor(pos: Vec2, icon: Icon, mirror: boolean) {
    const size = {x: 16, y: 16};
    super(pos, size);
    this.ctx = drawEngine.ctx;
    this.icon = icon;
    this.mirror = mirror;
  }

  draw() {
    drawEngine.drawIcon(this.icon, this.pos, false, this.mirror);
  }
}