import { Vec2 } from "@/util/types";
import { Character } from "./character";

type CollisionMap = {
  right: boolean
  left: boolean
  top: boolean
  bottom: boolean
  collides: boolean
}

export class Collider {
  pos: Vec2;
  size: Vec2;

  constructor(pos: Vec2, size: Vec2) {
    this.pos = pos;
    this.size = size;
  }

  /**
   * Returns true if the character is colliding with this collider.
   * @param character the character, which has a pos and a size.
   */
  collision(character: Character): CollisionMap {
    const charRight = character.pos.x + character.size.x;
    const charBottom = character.pos.y + character.size.y;
    const colliderRight = this.pos.x + this.size.x;
    const colliderBottom = this.pos.y + this.size.y;

    const inRight = character.pos.x < colliderRight;
    const inLeft = charRight > this.pos.x;
    const inBottom = character.pos.y < colliderBottom;
    const inTop = charBottom > this.pos.y;
    const collides = inRight && inLeft && inBottom && inTop;
    
    return {
      collides,
      right: inRight && character.pos.x > this.pos.x,
      left: inLeft && character.pos.x < this.pos.x,
      bottom: inBottom && character.pos.y > this.pos.y,
      top: inTop && character.pos.y < this.pos.y,
    };
  }

  standsOn(character: Character): boolean {
    const charRight = character.pos.x + character.size.x;
    const charBottom = character.pos.y + character.size.y;
    const colliderRight = this.pos.x + this.size.x;
    const colliderBottom = this.pos.y + 2;

    return (
      character.pos.x < colliderRight &&
      charRight > this.pos.x &&
      character.pos.y < colliderBottom &&
      charBottom >= this.pos.y      
    );
  }
}