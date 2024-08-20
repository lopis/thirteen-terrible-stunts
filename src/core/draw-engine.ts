import { Vec2 } from "@/util/types";
import { drawText, DrawTextProps } from "./font";

export const colors = {
  black: '#2e2622',
  white: '#cccec7',
  gray: '#77746f',
  light: '#a09f97',
};

const palette = Object.values(colors).join('').replace(/#/g, '');
const paletteDark = colors.black.repeat(4).replace(/#/g, '');
const upperBody = '@@@@@@PUUE@PjjjA@ijjF@dZjY@PjjjA@iZeF@djjZ@PUUUAPijjFPdjjZQPUUUQ@TUUA@';
export const icons = {
  base:  upperBody + 'PA@E@@E@T@@T@PA@',
  falling: '@@@@@@@@@@@@@@@@@TUUA@djjZ@PjjjA@ijjF@dZjY@PjjjA@iZeF@TUUU@TjjjEDijjFQTUUUD@UUU@@@EPA@',
  jumping: '@TUUA@djjZ@PjifA@ijjF@djUZ@PjjjQ@ijjFATUUUATjjjADiejFPTUUU@@UUU@@PAU@@@@U@@@@T@@@@@@@@',

  boss1: '@@@@@@@UUE@@UUUA@ijjU@dfZZAPjYjE@YiVV@deZYAPjjjF@iUeZ@dZUjA@ijjA@PUUA@TjjZAdjjjZPUUUUA',
  boss2: '@@@@@@PUUE@PeZUAPijjU@ijjVAeUVYUTjifVQijjZEejjjUPjUjVAijjZ@PjjZ@@TiU@@@dF@@PUVUAPUUUU@',
  boss3: "@TUU@@djjF@djjjAPUUUF@ijjV@djjjAPVjeF@ijjZ@djjjAPjUjF@djjF@@ejF@@@iF@@TeZU@TUYUEPUUUU@",
  boss4: '@PA@E@PU@UAPUUUU@UiVUAPijUA@djZA@PfiF@@YfZ@@djjATdjjFPejjZ@djjZ@@UUU@@@@U@@@@UE@@PUUE@',

  chair: "p@@@@kC@@@lN@@@pz@@@@k@|njjCp~jjN@kkjz@lnjjCpzjjN@k@ljjjCpjjjN@kz@l~kCp@|O@",
  table: "@C@kjjz@kjjjNkjjjjojjjj~jjjjzkjjjjojjjj~kjjj~{jjjns~oCljjjCpO@kCpz@lN@kCp@|O@",
  plant: "@@C@@pkzC@pjjz@pjnkNpjnkjCkkjnNlkjj{pzznkCkznjNpjjjN@|O@@pz@@@|@@pjjC@@ojO@@pO@@",
};

const walkAnimation = [
  upperBody + 'PA@E@@@@T@@@@PA@',
  upperBody + '@E@E@@T@T@@@@PA@',
  upperBody + '@EPA@@T@E@@PA@@@',
  upperBody + '@EPA@@T@@@@PA@@@',
  upperBody + '@E@E@@T@T@@PA@@@',
  upperBody + '@E@E@@T@T@@@@PA@'
];

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

  drawIcon(icon: string, pos: Vec2, dark = false, mirrored = false) {
    const imageData : number[] = [];
    const iconPalette = dark ? paletteDark : palette;
  
    [...icon].map(c => {
      const z = c.charCodeAt(0);
      
      imageData.push(z&3);
      imageData.push((z>>2)&3);
      imageData.push((z>>4)&3);  
      
    });
  
    const size = Math.floor(Math.sqrt(imageData.length));
    this.ctx.save();
    this.ctx.translate(pos.x + (mirrored ? size : 0), pos.y);
    this.ctx.save();
    this.ctx.scale(mirrored ? -1 : 1, 1);

    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        if (imageData[j * size + i]) {
          const index = 6 * (imageData[j * size + i] - 1);
          this.ctx.fillStyle = '#' + iconPalette.substring(index, index + 6);        
          this.ctx.fillRect(i, j, 1, 1);
        }
      }
    }

    this.ctx.restore();
    this.ctx.restore();
  }

  drawWalkingIcon(iconIndex: number, pos: Vec2, mirrored: boolean) {
    this.drawIcon(walkAnimation[iconIndex], pos, false, mirrored);
  }

  drawText(options: DrawTextProps) {
    drawText(this.ctx, options);
  }

  clear() {
    this.ctx.clearRect(0, 0, c2d.width, c2d.height);
  }

  drawRect(pos: Vec2, size: Vec2, stroke: string, fill: string) {
    this.ctx.save();
    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(pos.x, pos.y, size.x, size.y);
    // The extra 0.5 allows drawing a crisp stroke without aliasing.
    this.ctx.strokeRect(pos.x + 0.5, pos.y + 0.5, size.x, size.y);
    this.ctx.restore();
  }

  drawControls() {
    const keySize = 10;
    const padding = 2;
    const space = keySize + padding;
    this.ctx.save();
    this.ctx.translate(80, 80);
    [
      {x: space, y: 0},
      {x: 0, y: space},
      {x: space, y: space},
      {x: space*2, y: space},
    ].forEach(({x, y}) => {
      this.drawRect({x, y}, {x: keySize, y: keySize}, colors.gray, colors.light);
    });
    this.drawText({
      text: 'move',
      x: Math.round(space * 1.5),
      y: keySize * 3,
      textAlign: 'center',
      size: 2,
    });
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(c2d.width - 80 - keySize*4, 80);
    [
      {text: 'enter', y: 0},
      {text: 'shift', y: space},
    ].forEach(({text, y}) => {
      this.drawRect({x: 0, y}, {x: keySize*4, y: keySize}, colors.gray, colors.light);
      this.drawText({
        text,
        x: keySize * 2,
        y: y + 3,
        size: 1,
        textAlign: 'center',
      });
    });
    this.drawText({
      text: 'action',
      x: keySize * 2,
      y: keySize * 3,
      textAlign: 'center',
      size: 2,
    });
    this.ctx.restore();
  }
}

export const drawEngine = new DrawEngine();
