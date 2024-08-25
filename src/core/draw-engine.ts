import { Vec2 } from "@/util/types";
import { drawText, DrawTextProps } from "./font";
import { roundVec } from "@/util/util";
import { hexToRgb } from "@/util/colors";

export const colors = {
  black: '#1F0A00',
  white: '#FFFCEA',
  gray: '#A29782',
  light: '#CEC6AD',
};

const palette = Object.values(colors).join('').replace(/#/g, '');
const paletteDark = colors.black.repeat(4).replace(/#/g, '');
const upperBody = '@@@@@@PUUE@PjjjA@ijjF@dZjY@PjjjA@iZeF@djjZ@PUUUAPijjFPdjjZQPUUUQ@TUUA@';
export enum IconKey {
  base = 0,
  falling = 1,
  jumping = 2,
  dead = 3,

  boss1 = 4,
  boss2 = 5,
  boss3 = 6,
  boss4 = 7,

  chair = 8,
  table = 9,
  plant = 10,
  camera = 11,
  coffee = 12,
  bigCoffee = 13,
  coffeMachine = 14,

  npc1 = 15,
  npc2 = 16,
  npc3 = 17,

  walk1 = 18,
  walk2 = 19,
  walk3 = 20,
  walk4 = 21,
  walk5 = 22,
  walk6 = 23,
};
export const iconsData = [
  /*base*/         upperBody + 'PA@E@@E@T@@T@PA@',
  /*falling*/      '@@@@@@@@@@@@@@@@@TUUA@djjZ@PjjjA@ijjF@dZjY@PjjjA@iZeF@TUUU@TjjjEDijjFQTUUUD@UUU@@@EPA@',
  /*jumping*/      '@TUUA@djjZ@PjifA@ijjF@djUZ@PjjjQ@ijjFATUUUATjjjADiejFPTUUU@@UUU@@PAU@@@@U@@@@T@@@@@@@@',
  /*dead*/         "@@@@@@@@@@@@@@@@@@@@@@@@@@@PUUUA@YijZ@eejjFUVjjZEYiZfEdfffFPZZfYUiiijUUUUUE@D@@@@@U@@@",
                   
  /*boss1*/        '@@@@@@@UUE@@UUUA@ijjU@dfZZAPjYjE@YiVV@deZYAPjjjF@iUeZ@dZUjA@ijjA@PUUA@TjjZAdjjjZPUUUUA',
  /*boss2*/        '@@@@@@PUUE@PeZUAPijjU@ijjVAeUVYUTjifVQijjZEejjjUPjUjVAijjZ@PjjZ@@TiU@@@dF@@PUVUAPUUUU@',
  /*boss3*/        "@TUU@@djjF@djjjAPUUUF@ijjV@djjjAPVjeF@ijjZ@djjjAPjUjF@djjF@@ejF@@@iF@@TeZU@TUYUEPUUUU@",
  /*boss4*/        '@PA@E@PU@UAPUUUU@UiVUAPijUA@djZA@PfiF@@YfZ@@djjATdjjFPejjZ@djjZ@@UUU@@@@U@@@@UE@@PUUE@',
                   
  /*chair*/        "p@@@@kC@@@lN@@@pz@@@@k@|njjCp~jjN@kkjz@lnjjCpzjjN@k@ljjjCpjjjN@kz@l~kCp@|O@",
  /*table*/        "@C@kjjz@kjjjNkjjjjojjjj~jjjjzkjjjjojjjj~kjjj~{jjjns~oCljjjCpO@kCpz@lN@kCp@|O@",
  /*plant*/        "@pO@@|jjO@ljzjCpjznNpjjnjCknjjNlnkjzpjkzjskjzn~ojjnzokjjz~zzkjjjjjjjjz|@",
  /*camera*/       "@pOpO@pjsjC@kNkNLlzozpCj@{sjz@l~kjCpzojN@{s@|@pN@p@pjC@@p~{@@pNpN@pN@lCpN@@{@O@@pC",
  /*coffee*/       "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|C@@@pW@@@@C@@@|K@@@@J@@@@@@@@@@@@@@@@@",
  /*bigCoffee*/    "@@@@@@@@@@@@TUE@@djjA@d~Z@T^UmAdZUUFPfVUZ@YjjjEtjjjfQujj^Fi}_ZPZUUZ@djjZ@@UUU@@@@@@@",
  /*coffeMachine*/ "PUUUU@ijjjAdjjjFPjjjZ@UUUUAtGPUUu^@@@PAPUEmGPTVt_@QYQADeE}G@TUt_@UUUAtGPUUUU@",
                   
  /*npc1*/         "@@@@@@TUUA@TejZATUffEPUYZV@UejZAPeZiA@djjF@PUUU@PijjEPdjjFAQjjZDPUUUE@PAPA@@E@E@@@@@@@",
  /*npc2*/         "@@@@@@PUUA@PjjZ@@ijjA@dZZF@PjiY@@iZiA@djjF@PUUU@PiZiEPdjjFAQUUUDPUUUE@PAPA@@E@E@@@@@@@",
  /*npc3*/         "@@@@@@PUUA@PUUU@@ijjA@TUUE@PZiU@@ijjA@djjF@PUUU@PUUVEPTUYEAQUUUDPUUUE@PAPA@@E@E@@@@@@@",
                   
  /*walk1*/        upperBody + 'PA@E@@@@T@@@@PA@',
  /*walk2*/        upperBody + '@E@E@@T@T@@@@PA@',
  /*walk3*/        upperBody + '@EPA@@T@E@@PA@@@',
  /*walk4*/        upperBody + '@EPA@@T@@@@PA@@@',
  /*walk5*/        upperBody + '@E@E@@T@T@@PA@@@',
  /*walk6*/        upperBody + '@E@E@@T@T@@@@PA@',
];

export type Icon = ImageBitmap;
export const icons: ImageBitmap[] = [];
export let npcIcons: IconKey[] = [];
export let bossIcons: IconKey[] = [];
export let walkAnimationIcons: IconKey[] = [];

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
    this.ctx = c2d.getContext("2d", {alpha: false}) as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;

    const resize = () => {
      this.canvasScale = c2d.width / WIDTH;
    };

    const time = performance.now();
    Promise.all(iconsData.map((value, i) => this.preLoadIcon(i, value, false))).then(() => {
      console.log(`Loaded icons in ${performance.now() - time}ms`);
      
      npcIcons = [IconKey.npc1, IconKey.npc2, IconKey.npc3];
      bossIcons = [IconKey.boss1, IconKey.boss2, IconKey.boss3, IconKey.boss4];
      walkAnimationIcons = [IconKey.walk1, IconKey.walk2, IconKey.walk3, IconKey.walk4, IconKey.walk5, IconKey.walk6];
    });

    window.addEventListener('resize', resize);
    resize();
  }

  async preLoadIcon(id: IconKey, icon: string, dark: boolean) {
    const imageArray : number[] = [];
    const iconPalette = dark ? paletteDark : palette;
  
    [...icon].map(c => {
      const z = c.charCodeAt(0);
      
      imageArray.push(z&3);
      imageArray.push((z>>2)&3);
      imageArray.push((z>>4)&3);  
      
    });
  
    const size = Math.floor(Math.sqrt(imageArray.length));
    const imageData = new ImageData(size, size);
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        if (imageArray[j * size + i]) {
          // this.ctx.fillStyle = '#' + iconPalette.substring(index, index + 6);        
          // this.ctx.fillRect(i, j, 1, 1);
          const paletteIndex = 6 * (imageArray[j * size + i] - 1);
          const [r, g, b, a] = hexToRgb('#' + iconPalette.substring(paletteIndex, paletteIndex + 6));
          const index = (i + j * size) * 4; // 4 channels per pixel
          imageData.data[index] = r;
          imageData.data[index + 1] = g;
          imageData.data[index + 2] = b;
          imageData.data[index + 3] = a || 255;
        }
      }
    }

    const bitmap = await createImageBitmap(imageData);
    icons[id] = bitmap;
  }

  drawIcon(iconKey: IconKey, pos: Vec2, _dark = false, mirrored = false) {
    const icon = icons[iconKey];
    if (!icon) {
      return;
    }
    this.ctx.save();
    this.ctx.translate(pos.x + (mirrored ? icon.width : 0), pos.y);
    this.ctx.save();
    this.ctx.scale(mirrored ? -1 : 1, 1);
    this.ctx.drawImage(icon, 0, 0);
    this.ctx.restore();
    this.ctx.restore();
  }

  drawWalkingIcon(keyFrame: number, pos: Vec2, mirrored: boolean) {
    this.drawIcon(walkAnimationIcons[keyFrame], pos, false, mirrored);
  }

  drawText(options: DrawTextProps) {
    drawText(this.ctx, options);
  }

  clear() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.ctx.fillStyle = colors.white;
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
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
