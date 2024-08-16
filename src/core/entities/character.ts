import { Vec2 } from "@/util/types";
import { drawEngine, icons } from "../draw-engine";

export const CHARACTER_SIZE = 16;

export class Character {
  frameDuration = 60; //ms
  timeAccumulator = 0;
  currentFrame = 0;
  size: Vec2 = {x: CHARACTER_SIZE, y: CHARACTER_SIZE};
  pos: Vec2 = {x: 0, y: 0};

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
    drawEngine.drawWalkingIcon(this.currentFrame, this.pos);
  }

  drawStanding() {
    this.timeAccumulator = 0;
    this.currentFrame = 0;
    drawEngine.drawIcon(icons.base, this.pos);
  }
}

export const character = new Character();
