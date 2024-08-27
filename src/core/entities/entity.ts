import { Vec2 } from "@/util/types";
import { colors, drawEngine, IconKey } from "../draw-engine";
import { Collider } from "./collider";

type Attributes = {
  mirror?: boolean,
  isNPC?: boolean,
  onTable?: boolean,
}

export class Entity extends Collider {
  icon: IconKey;
  mirror: boolean;
  isNPC = false;
  onTable = false;
  holding: IconKey | null = null;
  text: string | null = null;
  textTime = 0;
  maxTextTime = 1500;
  hide = false;

  constructor(pos: Vec2, icon: IconKey, attributes: Attributes = {}) {
    const size = {x: 16, y: 16};
    super(pos, size);
    this.icon = icon;
    this.mirror = !!attributes.mirror;
    this.isNPC = !!attributes.isNPC;
    this.onTable = !!attributes.onTable;
  }

  update(delta?: number) {
    if (this.hide) {  
      return;
    }
    if (this.onTable) {
      drawEngine.drawIcon(IconKey.table, {...this.pos, y: this.pos.y + 8});
    }
    drawEngine.drawIcon(this.icon, this.pos, false, this.mirror);
    if (this.holding) {
      drawEngine.drawIcon(this.holding, this.pos, false);
    }
    if (this.textTime > 0 && this.text) {
      this.textTime -= delta || 0;
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