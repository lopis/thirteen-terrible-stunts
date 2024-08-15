import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { State } from "./state";

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  isConfirm = false;
  isEscape = false;
  inputDirection: DOMPoint;

  changed = true;

  keyMap: Map<string, boolean> = new Map();
  previousState = {
    isUp: this.isUp,
    isDown: this.isDown,
    isRight: this.isRight,
    isLeft: this.isLeft,
    isConfirm: this.isConfirm,
    isEscape: this.isEscape
  };

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    this.inputDirection = new DOMPoint();
  }

  queryController() {
    this.previousState.isUp = this.isUp;
    this.previousState.isDown = this.isDown;
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;

    const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('ArrowLeft')) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight')) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('ArrowUp')) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown')) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal) || 0;
    this.inputDirection.y = (upVal + downVal) || 0;

    this.isUp = this.inputDirection.y < 0;
    this.isDown = this.inputDirection.y > 0;
    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;
    this.isConfirm = Boolean(this.keyMap.get('Enter'));
    this.isEscape = Boolean(this.keyMap.get('Escape'));

    if (this.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }

  onUpdate(state: State) {
    if (!this.changed) {
      return;
    }
    this.queryController();

    if(this.isUp) {
      if (!this.previousState.isUp) {
        typeof state.onUp == 'function' && state.onUp();
      } else {
        typeof state.whileDown == 'function' && state.whileDown();
      }
    }

    if(this.isDown) {
      if (!this.previousState.isDown) {
        typeof state.onDown == 'function' && state.onDown();
      } else {
        typeof state.whileDown == 'function' && state.whileDown();
      }
    }

    if(this.isRight) {
      if (!this.previousState.isRight) {
        typeof state.onRight == 'function' && state.onRight();
      } else {
        typeof state.whileRight == 'function' && state.whileRight();
      }
    }

    if(this.isLeft) {
      if (!this.previousState.isLeft) {
        typeof state.onLeft == 'function' && state.onLeft();
      } else {
        typeof state.whileLeft == 'function' && state.whileLeft();
      }
    }

    if(this.isConfirm) {
      if (!this.previousState.isConfirm) {
        typeof state.onConfirm == 'function' && state.onConfirm();
      }
    }

    if(this.isEscape) {
      if (!this.previousState.isEscape) {
        typeof state.onEscape == 'function' && state.onEscape();
      }
    }

    this.changed = false;
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.changed = true;
    this.keyMap.set(event.code, isPressed);
  }
}

export const controls = new Controls();
