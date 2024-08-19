import { colors, drawEngine } from '@/core/draw-engine';
import { gameData } from '@/core/game-data';
import { State } from '@/core/state';
import { gameStateMachine } from '@/game-state-machine';
import { lineSplit } from '@/util/util';
import { MoveGame } from './microgames/move.game';

export class StartState implements State {
  timePassed = 0;
  letterIndex = 0;
  timePerLetter = 30;

  onEnter() {
    // gameStateMachine.setState();
  }

  onUpdate(delta: number) {
    this.timePassed += delta;
    if(this.timePassed >= this.timePerLetter) {
      this.letterIndex++;
      this.timePassed -= this.timePerLetter;
    }

    drawEngine.drawRect(
      {x: 5, y: c2d.height - 70},
      {x: c2d.width - 10, y: 50},
      colors.light,
      colors.white,
    );
    drawEngine.drawRect(
      {x: 8, y: c2d.height - 67},
      {x: c2d.width - 16, y: 44},
      colors.light,
      colors.white,
    );
    const {name, intro, icon} = gameData.getBoss();
    drawEngine.drawText({
      text: name,
      x: 12,
      y: c2d.height - 63,
      size: 2,
      color: colors.gray
    });
    lineSplit(intro, 40).forEach((line, index) => {
      drawEngine.drawText({
        text: line,
        x: 12,
        y: c2d.height - 45 + (index * 8),
        size: 1,
        maxLetters: this.letterIndex - (40 * index),
      });
    });

    drawEngine.ctx.save();
    drawEngine.ctx.translate(c2d.width - 45, c2d.height - 60);
    drawEngine.ctx.save();
    drawEngine.ctx.scale(2, 2);
    drawEngine.drawIcon(icon, {x: 0, y: 0});
    drawEngine.ctx.restore();
    drawEngine.ctx.restore();
  }

  onConfirm() {
    gameStateMachine.setState(new MoveGame());
  }
}
