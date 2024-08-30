import { Vec2 } from "@/util/types";
import { drawEngine, IconKey } from "../draw-engine";
import { addVec, roundVec } from "@/util/util";

export const CHARACTER_SIZE = 16;

export class Character {
  frameDuration = 60; //ms
  timeAccumulator = 0;
  currentFrame = 0;
  size: Vec2 = {x: CHARACTER_SIZE, y: CHARACTER_SIZE};
  pos: Vec2 = {x: 0, y: 0};
  mirror = false;
  holding: IconKey[] = [];
  dead = false;

  velocity: Vec2 = {x:0, y:0};

  setPos(x: number, y: number) {
    this.pos = roundVec({x, y});
  }

  move() {
    this.pos = addVec(this.pos, this.velocity);
  }

  draw(iconKey: IconKey) {
    drawEngine.drawIcon(iconKey, this.pos, false, this.mirror);
    this.drawHolding();
  }

  drawHolding() {
    this.holding.forEach((holding, i) => {
      drawEngine.drawIcon(
        holding,
        {
          ...this.pos,
          y: this.pos.y - (i+1)*12
        }
      );
    });
  }

  drawWalking(delta: number) {
    // Add the time elapsed since the last update
    this.timeAccumulator += delta;

    // Check if we need to switch to the next frame
    if (this.timeAccumulator >= this.frameDuration) {
        // Move to the next frame
        this.currentFrame = (this.currentFrame + 1) % 6; // Loop back to frame 0 after frame 5

        // Reset the time accumulator, but keep the overflow for smooth animation
        this.timeAccumulator -= this.frameDuration;
    }

    // Draw the current frame
    drawEngine.drawWalkingIcon(this.currentFrame, this.pos, this.mirror);
    this.drawHolding();
  }

  drawStanding() {
    this.draw(IconKey.base);
  }

  drawDead() {
    this.draw(IconKey.dead);
  }

  drawJumping() {
    this.draw(IconKey.jumping);
  }

  drawFalling() {
    this.draw(IconKey.falling);
  }

  drawDrowning() {
    drawEngine.drawIcon(IconKey.jumping, this.pos, false, this.mirror, true);
  }

  hold(icon: IconKey) {
    this.holding.push(icon);
  }

  pop() {
    this.holding.pop();
  }
}

export const character = new Character();
