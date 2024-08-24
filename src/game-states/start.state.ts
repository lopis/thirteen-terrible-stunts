import { stopPlayingSentence } from '@/core/audio';
import { renderBossDialog, setBossDialog } from '@/core/boss-dialog';
import { drawEngine } from '@/core/draw-engine';
import { gameData } from '@/core/game-data';
import { State } from '@/core/state';

export class StartState implements State {

  onEnter() {
    const { name, intro, icon } = gameData.getBoss(); 
    setBossDialog(name, intro, icon);
  }

  onUpdate(delta: number) {
    drawEngine.drawControls();

    renderBossDialog(delta);
  }

  onConfirm() {
    stopPlayingSentence();
    gameData.nextLevel();
  }
}
