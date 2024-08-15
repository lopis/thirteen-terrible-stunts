export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;

  onUp?: Function;
  whileUp?: Function;

  onDown?: Function;
  whileDown?: Function;

  onLeft?: Function;
  whileLeft?: Function;

  onRight?: Function;
  whileRight?: Function;

  onConfirm?: Function;
  onEscape?: Function;
}
