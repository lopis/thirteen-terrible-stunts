import { State } from '@/core/state';
import { stopAudio } from '@/core/audio';
import { colors, drawEngine, icons } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import { MoveGame } from './microgames/move.game';

const menu: [string, number][] = [
  [' Story mode', 80],
  [' Endless mode', 160],
];

class LevelsState implements State {
  private selectedButton = 0;

  onEnter() {
    stopAudio();
  }

  onLeave() {
  }

  onUpdate(_delta: number) {
    // title
    drawEngine.drawText({
      text: 'Levels',
      x: c2d.width / 2,
      y: 30,
      textAlign: 'center',
      color: colors.gray,
      size: 3,
    });

    const width = 16 + 5;
    const x = c2d.width / 2 - 4 * width;
    [
      ...menu,
      ['&', this.selectedButton === 0 ? menu[0][1] : menu[1][1]] as [string, number],
    ].forEach(([text, y]) => {
      drawEngine.drawText({
        text,
        x: x - 10,
        y,
        color: colors.black,
        size: 2,
      });
    });

    drawEngine.drawText({
      text: 'Press ENTER to start',
      x: c2d.width / 2,
      y: c2d.height - 20,
      textAlign: 'center',
      color: colors.gray,
      size: 1,
    });
  
    drawEngine.ctx.save();
    drawEngine.ctx.translate(x, 100);
    [icons.boss1, icons.boss2, icons.boss3, icons.boss4].forEach((boss, i) => {
      drawEngine.ctx.save();
      drawEngine.ctx.scale(2, 2);
      const pos = {x: width * i, y: 0};
      drawEngine.drawRect(pos, {x: 16, y: 16}, 'transparent', colors.light);
      drawEngine.drawIcon(boss, pos, true);
      drawEngine.ctx.restore();
    });
    drawEngine.ctx.restore();
  }

  onUp() {
    console.log('up');
    this.selectedButton--;
    if (this.selectedButton < 0) {
      this.selectedButton = menu.length - 1;
    }
  }

  onDown() {
    console.log('down');
    this.selectedButton++;
    if (this.selectedButton > menu.length - 1) {
      this.selectedButton = 0;
    }
  }

  onConfirm() {
    if (this.selectedButton === 0) {
      gameStateMachine.setState(new MoveGame());
    }
  }
}

export const levelsState = new LevelsState();