import { State } from '@/core/state';
import { stopAudio } from '@/core/audio';
import { colors, drawEngine, WIDTH } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import { gameData } from '@/core/game-data';
import { levelsState } from './levels.state';

const menu = [
  'new game',
  'continue',
  'about',
];

class MenuState implements State {
  private selectedButton = 0;

  onEnter() {
    stopAudio();
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
