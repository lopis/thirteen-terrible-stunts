import { State } from '@/core/state';
import { startAudio, stopAudio } from '@/core/audio';

class MenuState implements State {
  private selectedButton = 0;
  private hasChanged = true;

  onEnter() {
    stopAudio();
  }

  onLeave() {
  }

  onUpdate() {
    if (this.hasChanged) {
      this.hasChanged = false;
      Array.from(document.getElementsByClassName('selected')).forEach(e => e.classList.remove('selected'));
      document.getElementById(`item${this.selectedButton + 1}`)?.classList.add('selected');
    }
  }

  onUp() {
    console.log('up');
    this.hasChanged = true;
    this.selectedButton--;
    if (this.selectedButton < 0) {
      this.selectedButton = 4;
    }
  }

  onDown() {
    console.log('down');
    this.hasChanged = true;
    this.selectedButton++;
    if (this.selectedButton > 4) {
      this.selectedButton = 0;
    }
  }

  onConfirm() {
    console.log('ok');
    startAudio();
  }

  startGame() {

  }

  continueGame() {

  }
}

export const menuState = new MenuState();
