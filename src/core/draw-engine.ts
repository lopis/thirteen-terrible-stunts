import { Vec2 } from "@/util/types";
import { drawText, DrawTextProps } from "./font";
import { roundVec } from "@/util/util";

export const colors = {
  black: '#1F0A00',
  white: '#FFFCEA',
  gray: '#A29782',
  light: '#CEC6AD',
};

const palette = Object.values(colors).join('').replace(/#/g, '');
const paletteDark = colors.black.repeat(4).replace(/#/g, '');
const upperBody = '@@@@@@PUUE@PjjjA@ijjF@dZjY@PjjjA@iZeF@djjZ@PUUUAPijjFPdjjZQPUUUQ@TUUA@';
export const icons = {
  base:  upperBody + 'PA@E@@E@T@@T@PA@',
  falling: '@@@@@@@@@@@@@@@@@TUUA@djjZ@PjjjA@ijjF@dZjY@PjjjA@iZeF@TUUU@TjjjEDijjFQTUUUD@UUU@@@EPA@',
  jumping: '@TUUA@djjZ@PjifA@ijjF@djUZ@PjjjQ@ijjFATUUUATjjjADiejFPTUUU@@UUU@@PAU@@@@U@@@@T@@@@@@@@',
  dead: "@@@@@@@@@@@@@@@@@@@@@@@@@@@PUUUA@YijZ@eejjFUVjjZEYiZfEdfffFPZZfYUiiijUUUUUE@D@@@@@U@@@",

  boss1: '@@@@@@@UUE@@UUUA@ijjU@dfZZAPjYjE@YiVV@deZYAPjjjF@iUeZ@dZUjA@ijjA@PUUA@TjjZAdjjjZPUUUUA',
  boss2: '@@@@@@PUUE@PeZUAPijjU@ijjVAeUVYUTjifVQijjZEejjjUPjUjVAijjZ@PjjZ@@TiU@@@dF@@PUVUAPUUUU@',
  boss3: "@TUU@@djjF@djjjAPUUUF@ijjV@djjjAPVjeF@ijjZ@djjjAPjUjF@djjF@@ejF@@@iF@@TeZU@TUYUEPUUUU@",
  boss4: '@PA@E@PU@UAPUUUU@UiVUAPijUA@djZA@PfiF@@YfZ@@djjATdjjFPejjZ@djjZ@@UUU@@@@U@@@@UE@@PUUE@',

  chair: "p@@@@kC@@@lN@@@pz@@@@k@|njjCp~jjN@kkjz@lnjjCpzjjN@k@ljjjCpjjjN@kz@l~kCp@|O@",
  table: "@C@kjjz@kjjjNkjjjjojjjj~jjjjzkjjjjojjjj~kjjj~{jjjns~oCljjjCpO@kCpz@lN@kCp@|O@",
  plant: "@pO@@|jjO@ljzjCpjznNpjjnjCknjjNlnkjzpjkzjskjzn~ojjnzokjjz~zzkjjjjjjjjz|@",
  camera: "@pOpO@pjsjC@kNkNLlzozpCj@{sjz@l~kjCpzojN@{s@|@pN@p@pjC@@p~{@@pNpN@pN@lCpN@@{@O@@pC",
  coffee: "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|C@@@pW@@@@C@@@|K@@@@J@@@@@@@@@@@@@@@@@",
  bigCoffee: "@@@@@@@@@@@@TUE@@djjA@d~Z@T^UmAdZUUFPfVUZ@YjjjEtjjjfQujj^Fi}_ZPZUUZ@djjZ@@UUU@@@@@@@",
  coffeMachine: "PUUUU@ijjjAdjjjFPjjjZ@UUUUAtGPUUu^@@@PAPUEmGPTVt_@QYQADeE}G@TUt_@UUUAtGPUUUU@",
};

export const npcIcons = [
  "@@@@@@TUUA@TejZATUffEPUYZV@UejZAPeZiA@djjF@PUUU@PijjEPdjjFAQjjZDPUUUE@PAPA@@E@E@@@@@@@",
  "@@@@@@PUUA@PjjZ@@ijjA@dZZF@PjiY@@iZiA@djjF@PUUU@PiZiEPdjjFAQUUUDPUUUE@PAPA@@E@E@@@@@@@",
  "@@@@@@PUUA@PUUU@@ijjA@TUUE@PZiU@@ijjA@djjF@PUUU@PUUVEPTUYEAQUUUDPUUUE@PAPA@@E@E@@@@@@@",
];

const walkAnimation = [
  upperBody + 'PA@E@@@@T@@@@PA@',
  upperBody + '@E@E@@T@T@@@@PA@',
  upperBody + '@EPA@@T@E@@PA@@@',
  upperBody + '@EPA@@T@@@@PA@@@',
  upperBody + '@E@E@@T@T@@PA@@@',
  upperBody + '@E@E@@T@T@@@@PA@'
];

export type Icon = typeof icons[keyof typeof icons];

export function easeInOutSine (x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
};

export function exponencialSmoothing(value: number, target: number, elapsedMilis: number, speed: number = 3) {
  return value + (target - value) * (elapsedMilis * speed / 1000);
}

export const HEIGHT = 260;
export const WIDTH = 320;

class DrawEngine {
  charFrame = 0;
  ctx: CanvasRenderingContext2D;
  canvasScale = 0;

  constructor() {
    this.ctx = c2d.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;

    const resize = () => {
      this.canvasScale = c2d.width / WIDTH;
    };

    window.addEventListener('resize', resize);
    resize();
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
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  drawRect(pos: Vec2, size: Vec2, stroke: string, fill?: string) {
    const {x, y} = roundVec(pos);
    this.ctx.fillStyle = stroke;
    this.ctx.fillRect(x, y, size.x, size.y);
    this.ctx.fillStyle = fill || stroke;
    this.ctx.fillRect(x+1, y+1, size.x-2, size.y-2);
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
      x: space * 1.5,
      y: keySize * 3,
      textAlign: 'center',
      size: 2,
    });
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(WIDTH - 80 - keySize*4, 70);
    [
      {text: 'enter', y: 0},
      {text: 'or', y: space},
      {text: 'space', y: space*2},
    ].forEach(({text, y}) => {
      text !== 'or' && this.drawRect({x: 0, y}, {x: keySize*4, y: keySize}, colors.gray, colors.light);
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
      y: keySize * 4,
      textAlign: 'center',
      size: 2,
    });
    this.ctx.restore();
  }

  // drawGrid(step = 20) {
  //   this.ctx.strokeStyle = '#ccc';
  //   this.ctx.lineWidth = 1;
  //   for (let x = 0; x < WIDTH; x += step) {
  //       this.ctx.beginPath();
  //       this.ctx.moveTo(x + 0.5, 0);
  //       this.ctx.lineTo(x + 0.5, HEIGHT);
  //       this.ctx.stroke();
  //   }
  //   for (let y = 0; y < HEIGHT; y += step) {
  //       this.ctx.beginPath();
  //       this.ctx.moveTo(0, y + 0.5);
  //       this.ctx.lineTo(WIDTH, y + 0.5);
  //       this.ctx.stroke();
  //   }
  // }
}

export const drawEngine = new DrawEngine();
