export const colors = {
  black: '#0c0c0d',
  gray: '#3f3d47',
  light: '#8b7d73',
  white: '#cdb27b',
};

const palette = '0c0c0dcdb27b3f3d478b7d73';
const upperBody = '@@@@@@PUUE@PjjjA@ijjF@dZjY@PjjjA@iZeF@djjZ@';
// const icons = {
//   "base":  upperBody + "PUUUAPijjFPdjjZQPUUUQ@TUUA@PA@E@@E@T@@T@PA@",
// };

const walkAnimation = [
  upperBody + "TUUUADijjVPdjjZDPUUUQ@TUUA@PA@E@@@@T@@@@PA@",
  upperBody + "TUUUADijjVPdjjZDPUUUQ@TUUA@@E@E@@T@T@@@@PA@",
  upperBody + "PUUUAPijjVPdjjZDQUUUQ@TUUA@@EPA@@T@E@@PA@@@",
  upperBody + "PUUUEPijjFQdjjZDQUUUA@TUUA@@EPA@@T@@@@PA@@@",
  upperBody + "PUUUEPijjFQdjjZDQUUUA@TUUA@@E@E@@T@T@@PA@@@",
  upperBody + "PUUUAPijjVPdjjZDQUUUQ@TUUA@@E@E@@T@T@@@@PA@"
];

const drawIcon = (ctx: CanvasRenderingContext2D, icon: string, x: number, y: number) => {
  const imageData : number[] = [];

  [...icon].map(c => {
    const z = c.charCodeAt(0);
    
    imageData.push(z&3);
    imageData.push((z>>2)&3);
    imageData.push((z>>4)&3);  
    
  });

  const size = Math.floor(Math.sqrt(imageData.length));
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      if (imageData[j * size + i]) {
        const index = 6 * (imageData[j * size + i] - 1);
        ctx.fillStyle = '#' + palette.substring(index, index + 6);        
        ctx.fillRect(x + i, y + j, 1, 1);
      }
    }
  }
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
  charFrame = 0;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.ctx = c2d.getContext("2d") as CanvasRenderingContext2D;

    const resize = () => {
      const min = Math.min(window.innerHeight, window.innerWidth);
      // // eslint-disable-next-line id-denylist
      c2d.style.height = `${Math.floor(min / 320) * 320}px`;
      // eslint-disable-next-line id-denylist
      c2d.style.width = `${Math.floor(min / 320) * 320}px`;
    };

    window.addEventListener('resize', resize);
    resize();
  }

  drawWalkingIcon(iconIndex: number) {
    drawIcon(this.ctx, walkAnimation[iconIndex], 100, 100);
  }

  clear() {
    this.ctx.clearRect(0, 0, c2d.width, c2d.height);
  }
}

export const drawEngine = new DrawEngine();
