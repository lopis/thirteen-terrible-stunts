export interface State {
  onUpdate: (timeElapsed: number) => void;
  postRender?(delta: number): unknown;
  onEnter?: Function;
  onLeave?: Function;

  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onConfirm?: () => void;
  onEscape?: () => void;
}
