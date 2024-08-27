import { State } from '@/core/state';
import { stopAudio } from '@/core/audio';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import { gameData } from '@/core/game-data';
import { levelsState } from './levels.state';

const menu = [
  'new game',
  'continue',
  'about',
];

const bylines = [
  'Optimized for Firefox 2+',
  'Asbestos Free',
  'Not tested on animals',
  'If symptoms persist, consult a doctor',
  'Requires MS-DOS 5.0 or later',
  'For up-to 1 player(s)',
];

let byline = '';

class MenuState implements State {
  private selectedButton = 0;

  onEnter() {
    stopAudio();
    byline = bylines[Math.floor(Math.random() * bylines.length)];
  }

  onLeave() {
  }

  onUpdate(_delta: number) {
    ['THIRTEEN', 'TERRIBLE', 'STUNTS'].forEach(
      (text, i) => [colors.light, colors.black].forEach(
        (color, c) => drawEngine.drawText({
          text,
          x: WIDTH / 2 - c,
          y: 40 + i * 15 - c,
          textAlign: 'center',
          color,
          size: 2,
        })
      )
    );

    menu.forEach((text, i) => {
      drawEngine.drawText({
        text,
        x: WIDTH / 2,
        y: 120 + i * 16,
        textAlign: 'center',
        color: i === this.selectedButton ? colors.black : colors.gray,
        size: 1,
      });
    });

    drawEngine.ctx.save();
    drawEngine.ctx.globalAlpha = 0.5;
    drawEngine.ctx.translate(0.5, 0.5);
    drawEngine.ctx.rotate(-25);
    drawEngine.ctx.scale(8,8);
    drawEngine.drawIcon(IconKey.jumping, {x: 3, y: 15});
    drawEngine.ctx.restore();

    drawEngine.drawText({
      text: byline,
      x: WIDTH / 2,
      y: HEIGHT - 15,
      textAlign: 'center',
      color: colors.light,
      size: 1,
    });
  }

  onUp() {
    this.selectedButton--;
    if (this.selectedButton < 0) {
      this.selectedButton = menu.length - 1;
    }
  }

  onDown() {
    this.selectedButton++;
    if (this.selectedButton > menu.length - 1) {
      this.selectedButton = 0;
    }
  }

  onConfirm() {
    if (this.selectedButton === 0) {
      gameData.boss = 0;
      gameData.level = -1;
      gameStateMachine.setState(levelsState);
    }
  }
}

export const menuState = new MenuState();
