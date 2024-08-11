import { State } from '@/core/state';
import { gameStateMachine } from '@/game-state-machine';
import { gameData } from '@/core/game-data';

class GameState implements State {
  onEnter() {
    gameStateMachine.setState(gameData.getLevel());
  }

  onUpdate() {}
}

export const gameState = new GameState();
