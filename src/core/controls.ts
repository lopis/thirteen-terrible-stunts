import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { State } from "./state";
import { gameData } from "./game-data";

interface KeyboardLayoutMap {
  get: (key: string) => string
}

interface Keyboard extends EventTarget {
  getLayoutMap: () => Promise<KeyboardLayoutMap>
}

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  isConfirm = false;
  isEscape = false;
  isKeyE = false;
  inputDirection: DOMPoint;

  keyMap: Map<string, boolean> = new Map();
  previousState = {
    isUp: this.isUp,
    isDown: this.isDown,
    isRight: this.isRight,
    isLeft: this.isLeft,
    isConfirm: this.isConfirm,
    isEscape: this.isEscape,
    isKeyE: this.isKeyE,
  };
  keyboard: Keyboard | unknown;

  constructor() {
    if ('keyboard' in navigator) {
      this.keyboard = navigator.keyboard;
    }
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    this.inputDirection = new DOMPoint();
  }

  queryController() {
    this.previousState.isUp = this.isUp;
    this.previousState.isDown = this.isDown;
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;
    this.previousState.isKeyE = this.isKeyE;

    const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('KeyQ') || this.keyMap.get('ArrowLeft')) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight')) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('KeyZ') || this.keyMap.get('ArrowUp')) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown')) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal) || 0;
    this.inputDirection.y = (upVal + downVal) || 0;

    this.isUp = this.inputDirection.y < 0;
    this.isDown = this.inputDirection.y > 0;
    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;
    this.isConfirm = Boolean(this.keyMap.get('Enter')) || Boolean(this.keyMap.get('Space'));
    this.isEscape = Boolean(this.keyMap.get('Escape'));
    this.isKeyE = Boolean(this.keyMap.get('KeyE'));
  }

  onUpdate(state: State) {
    this.queryController();

    if(this.isUp) {
      if (!this.previousState.isUp) {
        typeof state.onUp == 'function' && state.onUp();
      }
    }

    if(this.isDown) {
      if (!this.previousState.isDown) {
        typeof state.onDown == 'function' && state.onDown();
      }
    }

    if(this.isRight) {
      if (!this.previousState.isRight) {
        typeof state.onRight == 'function' && state.onRight();
      }
    }

    if(this.isLeft) {
      if (!this.previousState.isLeft) {
        typeof state.onLeft == 'function' && state.onLeft();
      }
    }

    if(this.isConfirm) {
      if (!this.previousState.isConfirm) {
        typeof state.onConfirm == 'function' && state.onConfirm();
      }
    }
  }

  toggleKey(event: KeyboardEvent, isPressed: boolean) {
    if (!gameData.pause) {
      this.keyMap.set(event.code, isPressed);
    }

    if (!isPressed) {
      if (event.key === 'Escape') {
        if (gameStateMachine.getState() != menuState) {
          gameStateMachine.setState(menuState);
        }
        gameData.pause = false;
      }
      if (event.code === 'KeyP') {
        gameData.pause = !gameData.pause;
      }
    }
  }
}

export const controls = new Controls();
