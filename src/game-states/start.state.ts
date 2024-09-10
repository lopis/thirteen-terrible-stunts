import { stopPlayingSentence } from '@/core/audio';
import { renderBossDialog, setBossDialog } from '@/core/boss-dialog';
import { drawEngine } from '@/core/draw-engine';
import { gameData } from '@/core/game-data';
import music from '@/core/music';
import { State } from '@/core/state';

export class StartState implements State {

  onEnter() {
    music.stop();
    music.start()
    .then(() => {
      music.setPlayHighNotes(false);
    });
    const { name, intro } = gameData.getBoss();
    setBossDialog(name, intro);
  }

  onLeave() {
    stopPlayingSentence();
  }

  onUpdate(delta: number) {
    drawEngine.drawControls();
    renderBossDialog(delta, true);
  }

  onConfirm() {
    gameData.start();
  }
}

export default new StartState();
