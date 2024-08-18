import { Vec2 } from "@/util/types";
import { drawText, DrawTextProps } from "./font";

export const colors = {
  black: '#2e2622',
  white: '#cccec7',
  gray: '#77746f',
  light: '#a09f97',
};

const palette = Object.values(colors).join('').replace(/#/g, '');
const upperBody = '@@@@@@PUUE@PjjjA@ijjF@dZjY@PjjjA@iZeF@djjZ@';
export const icons = {
  base:  upperBody + "PUUUAPijjFPdjjZQPUUUQ@TUUA@PA@E@@E@T@@T@PA@",
  falling: "@@@@@@@@@@@@@@@@@TUUA@djjZ@PjjjA@ijjF@dZjY@PjjjA@iZeF@TUUU@TjjjEDijjFQTUUUD@UUU@@@EPA@",
  jumping: "@TUUA@djjZ@PjifA@ijjF@djUZ@PjjjQ@ijjFATUUUATjjjADiejFPTUUU@@UUU@@PAU@@@@U@@@@T@@@@@@@@"
};

const walkAnimation = [
  upperBody + "TUUUADijjVPdjjZDPUUUQ@TUUA@PA@E@@@@T@@@@PA@",
  upperBody + "TUUUADijjVPdjjZDPUUUQ@TUUA@@E@E@@T@T@@@@PA@",
  upperBody + "PUUUAPijjVPdjjZDQUUUQ@TUUA@@EPA@@T@E@@PA@@@",
  upperBody + "PUUUEPijjFQdjjZDQUUUA@TUUA@@EPA@@T@@@@PA@@@",
  upperBody + "PUUUEPijjFQdjjZDQUUUA@TUUA@@E@E@@T@T@@PA@@@",
  upperBody + "PUUUAPijjVPdjjZDQUUUQ@TUUA@@E@E@@T@T@@@@PA@"
];

const drawIcon = (ctx: CanvasRenderingContext2D, icon: string, {x, y}: Vec2) => {
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
      const ratio = Math.max(1, Math.min(min / 260, min / 320));
      // // eslint-disable-next-line id-denylist
      c2d.style.height = `${ratio * 260}px`;
      // eslint-disable-next-line id-denylist
      c2d.style.width = `${ratio * 320}px`;
    };

    window.addEventListener('resize', resize);
    resize();
    c2d.classList.remove('hidden');
  }

  drawIcon(icon: string, pos: Vec2) {
    drawIcon(this.ctx, icon, pos);
  }

  drawWalkingIcon(iconIndex: number, pos: Vec2) {
    drawIcon(this.ctx, walkAnimation[iconIndex], pos);
  }

  drawText(options: DrawTextProps) {
    drawText(this.ctx, options);
  }

  clear() {
    this.ctx.clearRect(0, 0, c2d.width, c2d.height);
  }

  drawRect(pos: Vec2, size: Vec2, stroke: string, fill: string) {
    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(pos.x, pos.y, size.x, size.y);
    // The extra 0.5 allows drawing a crisp stroke without aliasing.
    this.ctx.strokeRect(pos.x + 0.5, pos.y + 0.5, size.x, size.y);
  }
}

export const drawEngine = new DrawEngine();
