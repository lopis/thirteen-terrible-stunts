export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;

  onUp?: Function;
  onDown?: Function;
  onLeft?: Function;
  onRight?: Function;
  onConfirm?: Function;
  onEscape?: Function;
}
