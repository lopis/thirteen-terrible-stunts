import { State } from '@/core/state';

class GameState implements State {
  onEnter() {
    // gameStateMachine.setState();
  }

  onUpdate() {}
}

export const gameState = new GameState();
