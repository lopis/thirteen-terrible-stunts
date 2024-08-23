import { Vec2 } from "@/util/types";
import { colors, drawEngine, Icon } from "../draw-engine";
import { Collider } from "./collider";

type Attributes = {
  mirror?: boolean,
  isNPC?: boolean,
}

export class Entity extends Collider {
  icon: Icon;
  mirror: boolean;
  isNPC = false;
  holding: Icon | null = null;
  text: string | null = null;
  textTime = 0;
  maxTextTime = 1500;
  hide = false;

  constructor(pos: Vec2, icon: Icon, attributes: Attributes = {}) {
    const size = {x: 16, y: 16};
    super(pos, size);
    this.icon = icon;
    this.mirror = !!attributes.mirror;
    this.isNPC = !!attributes.isNPC;
  }

  update(delta: number) {
    if (this.hide) {  
      return;
    }
    drawEngine.drawIcon(this.icon, this.pos, false, this.mirror);
    if (this.holding) {
      drawEngine.drawIcon(this.holding, this.pos, false);
    }
    if (this.textTime > 0 && this.text) {
      this.textTime -= delta;
      const timeRatio = this.textTime / this.maxTextTime;
      drawEngine.drawText({
        text: this.text,
        x: this.pos.x + 8,
        y: this.pos.y - 10 + 3 * timeRatio,
        size: 1,
        color: timeRatio > 0.66 ? colors.black : timeRatio > 0.33 ? colors.gray : colors.light,
        textAlign: "center",
      });
    }
  }

  say(text: string, time = this.maxTextTime) {
    this.text = text;
    this.textTime = time;
  }
}