import { character } from '@/core/character';
import { State } from '@/core/state';

class MoveGame implements State {
  onEnter() {
    // gameStateMachine.setState();
  }

  onUpdate(delta: number) {
    character.drawWalking(delta);
  }

  
}

export const gameState = new MoveGame();
