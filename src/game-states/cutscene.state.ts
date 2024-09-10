import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { Building, BUILDING_WIDTH } from '@/core/entities/building';
import { character } from '@/core/entities/character';
import { State } from '@/core/state';
import { gameStateMachine } from '@/game-state-machine';
import startState from './start.state';
import { doorSound } from '@/core/audio';
import { addTimeEvent } from '@/core/timer';

export class CutSceneState implements State {
  progress = 0;
  isStarting = false;
  fadeOut = 0;
  building = new Building(
    {x: WIDTH / 2 - BUILDING_WIDTH / 2, y: 0},
    5,
  );

  onEnter() {
    this.progress = 0;
    this.isStarting = false;
  }

  onUpdate(delta: number) {
    // Plants
    for(let x = 0; x < WIDTH; x +=16) {
      drawEngine.drawIcon(IconKey.plant, {x, y: 183});
    }

    this.building.update();

    // Floor
    c.fillStyle = colors.gray;
    c.fillRect(0, 200, WIDTH, 100);

    // Doors
    drawEngine.drawRect({x:WIDTH/2-14, y:161}, {x:14, y:39}, colors.gray, colors.white);
    drawEngine.drawRect({x:WIDTH/2, y:161}, {x:14, y:39}, colors.gray, colors.white);

    // Sign
    drawEngine.drawRect({x:WIDTH/2-50, y:130}, {x:100, y:20}, colors.black, colors.black);
    drawEngine.drawText({
      text: 'movie studio',
      x: WIDTH/2,
      y: 138,
      textAlign: 'center',
      size: 1,
      color: colors.white,
    });
    if (this.progress < 1) {
      this.progress += delta / 3000;
      character.drawWalking(delta);
    } else {
      character.drawStanding();
      drawEngine.drawText({
        text: 'Press ENTER to apply for job',
        x: WIDTH / 2,
        y: HEIGHT - 15,
        textAlign: 'center',
        color: colors.white,
        size: 1,
      });
    }

    character.setPos(-100 + this.progress * (WIDTH/2 + 92), 194);

    if (this.isStarting) {
      this.fadeOut = Math.min(1, this.fadeOut + delta / 1500);
      const color = colors.white + (Math.round(this.fadeOut * 16 / 3) * 3).toString(16).repeat(2);
      drawEngine.drawRect({x:0,y:0}, {x:WIDTH, y:HEIGHT}, color, color);
    }
  }

  onConfirm() {
    if (this.progress >= 1 && !this.isStarting) {
      this.isStarting = true;
      doorSound();
      addTimeEvent(() => {
        gameStateMachine.setState(startState);
      }, 1500);
    }
  }
}

export default new CutSceneState();
