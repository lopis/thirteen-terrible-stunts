import { drawEngine } from "./draw-engine";

export class Character {
  frameDuration = 60; //ms
  timeAccumulator = 0;
  currentFrame = 0;

  drawWalking(delta: number) {
    console.log('currentFrame', this.currentFrame);
    
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
    drawEngine.drawWalkingIcon(this.currentFrame);
  }
}

export const character = new Character();
