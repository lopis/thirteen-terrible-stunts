import { Vec2 } from "@/util/types";
import { drawEngine, icons } from "./draw-engine";

export class Character {
  frameDuration = 60; //ms
  timeAccumulator = 0;
  currentFrame = 0;

  drawWalking(delta: number, pos: Vec2) {
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
    drawEngine.drawWalkingIcon(this.currentFrame, pos);
  }

  drawStanding(pos: Vec2) {
    drawEngine.drawIcon(icons.base, pos);
  }
}

export const character = new Character();
