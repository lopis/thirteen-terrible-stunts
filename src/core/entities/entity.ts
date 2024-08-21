import { Vec2 } from "@/util/types";
import { drawEngine, Icon } from "../draw-engine";
import { Collider } from "./collider";

export class Entity extends Collider {
  icon: Icon;
  mirror: boolean;

  constructor(pos: Vec2, icon: Icon, mirror: boolean = false) {
    const size = {x: 16, y: 16};
    super(pos, size);
    this.icon = icon;
    this.mirror = mirror;
  }

  update() {
    drawEngine.drawIcon(this.icon, this.pos, false, this.mirror);
  }
}