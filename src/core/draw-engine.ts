export const colors = {
  black: '#0c0c0d',
  gray: '#3f3d47',
  light: '#8b7d73',
  white: '#cdb27b',
};

/**
 * Rounds numbers larger than 0.95 to 1, and smaller than 0.05 to 0.
 * This is used to avoid the long tail of easing functions.
 * @param x Number from 0 to 1
 * @returns 
 */
function cap(x: number): number {
  return x > 0.95 ? 1
    : x < 0.05 ? 0
    : x;
}

export function easeInOutSine (x: number): number {
  return cap(-(Math.cos(Math.PI * x) - 1) / 2);
};

export function exponencialSmoothing(value: number, target: number, elapsedMilis: number, speed: number = 3) {
  return value + (target - value) * (elapsedMilis * speed / 1000);
}

class DrawEngine {
  constructor() {
    const resize = () => {
      // eslint-disable-next-line id-denylist
      c2d.height = c2d.clientHeight;
      // eslint-disable-next-line id-denylist
      c2d.width = c2d.clientWidth;
    };

    window.addEventListener('resize', resize);
    resize();
  }
}

export const drawEngine = new DrawEngine();
