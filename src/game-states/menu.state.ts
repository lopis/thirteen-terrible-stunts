import { State } from '@/core/state';
import { stopAudio } from '@/core/audio';
import { colors, drawEngine } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import { JumpGame } from './microgames/jump';

const menu = [
  'new game',
  'continue',
  'levels',
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
    menu.forEach((text, i) => {
      drawEngine.drawText({
        text,
        x: c2d.width / 2,
        y: 100 + i * 8,
        textAlign: 'center',
        color: i === this.selectedButton ? colors.black : colors.light,
      });
    });
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
      gameStateMachine.setState(new JumpGame());
    }
  }
}

export const menuState = new MenuState();
