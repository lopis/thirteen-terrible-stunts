import { Vec2 } from "@/util/types";
import { character } from "./character";
import { drawEngine } from "../draw-engine";

type CollisionMap = {
  right: boolean
  left: boolean
  top: boolean
  bottom: boolean
  collides: boolean
  standsOn: boolean
}

export class Collider {
  pos: Vec2;
  size: Vec2;
  hasCollided = false;

  constructor(pos: Vec2, size: Vec2) {
    this.pos = pos;
    this.size = size;
  }

  update(_delta: number) {
    this.hasCollided = false;
  }

  /**
   * Returns true if the character is colliding with this collider.
   * @param character the character, which has a pos and a size.
   */
  collision(): CollisionMap {
    const charRight = character.pos.x + character.size.x;
    const charBottom = character.pos.y + character.size.y;
    const colliderRight = this.pos.x + this.size.x;
    const colliderBottom = this.pos.y + this.size.y;

    const inRight = character.pos.x < colliderRight;
    const inLeft = charRight > this.pos.x;
    const inBottom = character.pos.y < colliderBottom;
    const inTop = charBottom > this.pos.y;
    const collides = inRight && inLeft && inBottom && inTop;
    
    if (!collides) {
      this.hasCollided = false;
      return {
        collides: false,
        standsOn: false,
        right: false,
        left: false,
        bottom: false,
        top: false,
      };
    }
  
    const distRight = colliderRight - character.pos.x;
    const distLeft = charRight - this.pos.x;
    const distBottom = colliderBottom - character.pos.y;
    const distTop = charBottom - this.pos.y;
  
    const minDist = Math.min(distRight, distLeft, distBottom, distTop);
  
    this.hasCollided = true;
    return {
      collides,
      standsOn: this.standsOn(),
      right: minDist === distRight,
      left: minDist === distLeft,
      bottom: minDist === distBottom,
      top: minDist === distTop,
    };
  }

  standsOn(): boolean {
    if (character.velocity.y < 0) {
      return false;
    }

    const charRight = character.pos.x + character.size.x - 3;
    const charBottom = character.pos.y + character.size.y;
    const colliderRight = this.pos.x + this.size.x;
    const colliderBottom = this.pos.y + 2;

    return (
      (character.pos.x + 5) < colliderRight &&
      charRight > this.pos.x &&
      character.pos.y < colliderBottom &&
      charBottom >= this.pos.y
    );
  }

  render(color: string, stroke?: string) {
    drawEngine.drawRect(this.pos, this.size, stroke || color, color);
  }
}