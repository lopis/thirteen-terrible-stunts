import { State } from '@/core/state';
import { controls } from '@/core/controls';
import { colorDark } from '@/core/draw-engine';
import { stopAudio } from '@/core/audio';

class MenuState implements State {
  private selectedButton = 0;
  private buttons = [this.startGame, this.continueGame];

  onEnter() {
    stopAudio();
  }

  onLeave() {
  }

  onUpdate() {
    this.updateControls();
  }

  updateControls() {
    if (controls.isUp && !controls.previousState.isUp) {
      this.selectedButton--;
      if (this.selectedButton < 0) {
        this.selectedButton = this.buttons.length - 1;
      }
    }

    if (controls.isDown && !controls.previousState.isDown) {
      this.selectedButton++;
      if (this.selectedButton >= this.buttons.length) {
        this.selectedButton = 0;
      }
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      const func = this.buttons[this.selectedButton];
      if (func) {
        func();
      }
    }
  }

  startGame() {

  }

  continueGame() {

  }
}

export const menuState = new MenuState();
