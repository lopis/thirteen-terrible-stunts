import { Vec2 } from "@/util/types";
import { drawEngine, Icon, icons } from "../draw-engine";
import { Entity } from "./entity";

export class NPC extends Entity {

  constructor(pos: Vec2, icon: Icon, mirror: boolean = false) {
    super(pos, icon, mirror);
  }

  update() {
    super.update();
    if (this.hasCollided) {
      drawEngine.drawIcon(icons.coffee, this.pos, false, this.mirror);
    }
  }
}