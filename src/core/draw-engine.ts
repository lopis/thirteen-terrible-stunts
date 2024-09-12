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
export const enum IconKey {
  base = 0,
  falling,
  jumping,
  dead,
  broom,

  boss1,
  boss2,
  boss3,
  boss4,

  chair,
  table,
  plant,
  camera,
  coffee,
  bigCoffee,
  coffeMachine,
  wheel,

  npc1,
  npc2,
  npc3,

  walk1,
  walk2,
  walk3,
  walk4,
  walk5,
  walk6,

  fire1,
  fire2,
};
export const iconsData = [
  /*base*/         upperBody + 'PA@E@@E@T@@T@PA@',
  /*falling*/      '@@@@@@@@@@@@@@@@@TUUA@djjZ@PjjjA@ijjF@dZjY@PjjjA@iZeF@TUUU@TjjjEDijjFQTUUUD@UUU@@@EPA@',
  /*jumping*/      '@TUUA@djjZ@PjifA@ijjF@djUZ@PjjjQ@ijjFATUUUATjjjADiejFPTUUU@@UUU@@PAU@@@@U@@@@T@@@@@@@@',
  /*dead*/         "@@@@@@@@@@@@@@@@@@@@@@@@@@@PUUUA@YijZ@eejjFUVjjZEYiZfEdfffFPZZfYUiiijUUUUUE@D@@@@@U@@@",
  /*broom*/        "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@E@@@@}A@@`U_ji`@tgAh@@}U`@@PoF@@@djA@@PjZ@@@TUA",
                   
  /*boss1*/        '@@@@@@@UUE@@UUUA@ijjU@dfZZAPjYjE@iifV@ifZZAdjjjFPjUeZ@iZUjAPjjjA@TejU@UijUEUUjUUTUUUUA',
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
  /*wheel*/        "@@C@@pkzC@pzz@p~Np~oC{N{oo~~{{os~oC{Np~N@l~oN@@ojO@@@C@@",
                   
  /*npc1*/         "@@@@@@TUUA@TejZATUffEPUYZV@UejZAPeZiA@djjF@PUiV@PUYfEPTUfEAQUeUDPUUUE@TUUE@@E@E@@@@@@@",
  /*npc2*/         "@@@@@@PUUA@PjjZ@@ijjA@dZZF@PjiY@@iZiA@djjF@PUUU@PiZiEPdjjFAQUUUDPUUUE@PAPA@@E@E@@@@@@@",
  /*npc3*/         "@@@@@@PUUA@PUUU@@ijjA@TUUE@PZiU@@ijjA@djjF@PUUU@PUUVEPTUYEAQUUUDPUUUE@PAPA@@E@E@@@@@@@",
                   
  /*walk1*/        upperBody + 'PA@E@@@@T@@@@PA@',
  /*walk2*/        upperBody + '@E@E@@T@T@@@@PA@',
  /*walk3*/        upperBody + '@EPA@@T@E@@PA@@@',
  /*walk4*/        upperBody + '@EPA@@T@@@@PA@@@',
  /*walk5*/        upperBody + '@E@E@@T@T@@PA@@@',
  /*walk6*/        upperBody + '@E@E@@T@T@@@@PA@',

  /*fire1*/        "@|@L|psO|Lk~szlzC|O@",
  /*fire2*/        "C@@sp||@so{ljNlzC|O@",
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

export const HEIGHT = 256;
export const WIDTH = 320;
export const ROWS = HEIGHT / 16;
export const COLUMNS = WIDTH / 16;

class DrawEngine {
  charFrame = 0;
  ready = false;

  constructor() {
    (window as any).c = c2d.getContext("2d", {alpha: false}) as CanvasRenderingContext2D;
    c.imageSmoothingEnabled = false;
  }

  async init() {
    const time = performance.now();
    return Promise.all(iconsData.map((value, i) => this.preLoadIcon(i, value, false))).then(() => {
      console.debug(`Loaded icons in ${performance.now() - time}ms`);
      
      npcIcons = [IconKey.npc1, IconKey.npc2, IconKey.npc3];
      bossIcons = [IconKey.boss1, IconKey.boss2, IconKey.boss3, IconKey.boss4];
      walkAnimationIcons = [IconKey.walk1, IconKey.walk2, IconKey.walk3, IconKey.walk4, IconKey.walk5, IconKey.walk6];
      this.ready = true;
    });
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
          // c.fillStyle = '#' + iconPalette.substring(index, index + 6);        
          // c.fillRect(i, j, 1, 1);
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

  drawIcon(iconKey: IconKey, pos: Vec2, dark = false, mirrored = false, halfOnly = false) {
    const icon = icons[iconKey];
    if (!icon) {
      return;
    }
    c.save();
    dark && (c.filter = "brightness(0)");
    c.translate(pos.x + (mirrored ? icon.width : 0), pos.y);
    c.save();
    c.scale(mirrored ? -1 : 1, 1);
    if (halfOnly) {
      c.beginPath();
      c.rect(0, 0, 16, 8);
      c.clip();
    }
    c.drawImage(icon, 0, 0);
    c.restore();
    c.restore();
  }

  drawWalkingIcon(keyFrame: number, pos: Vec2, mirrored: boolean) {
    this.drawIcon(walkAnimationIcons[keyFrame], pos, false, mirrored);
  }

  drawText(options: DrawTextProps) {
    drawText(options);
  }

  clear() {
    c.clearRect(0, 0, WIDTH, HEIGHT);
    c.fillStyle = colors.white;
    c.fillRect(0, 0, WIDTH, HEIGHT);
  }

  drawRect(pos: Vec2, size: Vec2, stroke: string, fill: string) {
    const {x, y} = roundVec(pos);
    c.fillStyle = stroke;
    c.fillRect(x, y, size.x, size.y);
    c.fillStyle = fill;
    c.fillRect(x+1, y+1, size.x-2, size.y-2);
  }

  /**
   * Draws a pixelated line from (x0,y0) to (x1,y1).
   * This is used because the canvas is only able to draw
   * anti-aliased lines which don't fit the pixel-art aesthetics.
   * It is terribly inneficient, as it performs a rect() for
   * each pixel of the line.
   */
  drawLine(x0
    : number, y0: number, x1: number, y1: number, color: string) {
    // It's necessary to start from rounded coordinates
    let x = Math.round(x0);
    let y = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    // Calculate the deltas
    let dx = x1 - x;
    let dy = y1 - y;
    let dmax = Math.max(Math.abs(dx), Math.abs(dy));
    
    // Normalize deltas
    dx /= dmax;
    dy /= dmax;

    c.fillStyle = color;
    c.beginPath();

    // Draw the line
    for (let i = 0; i <= dmax; i++) {
      c.rect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
      x += dx;
      y += dy;
    }

    c.fill();
  }

  drawControls() {
    const keySize = 20;
    const padding = 2;
    const space = keySize + padding;
    c.save();
    c.translate(WIDTH / 2, 80);
    [
      {x: -50, y: 0},
      {x: -50, y: space},
      {x: -50 - space, y: space},
      {x: -50 + space, y: space},
    ].forEach(({x, y}) => {
      this.drawRect({x: x - space/2, y}, {x: keySize, y: keySize}, colors.gray, colors.gray);
      this.drawRect({x: x - space/2, y}, {x: keySize-2, y: keySize-2}, colors.light, colors.light);
    });
    this.drawText({
      text: 'move with arrows or wasd',
      x: -50,
      y: keySize * 3,
      textAlign: 'center',
      size: 1,
    });

    [
      ['esc', 'exit game'],
      [' P ', 'pause game'],
    ].forEach(([text, label], i) => {
      const y = i * space;
      this.drawRect({x: 40, y: y as number}, {x: 26, y: keySize}, colors.gray, colors.gray);
      this.drawRect({x: 40, y: y as number}, {x: 26-2, y: keySize-2}, colors.light, colors.light);
      this.drawText({
        text: `${text}  ${label}`,
        x: 45,
        y: y + 8,
        size: 1,
      });
    });

    c.restore();
    c.save();
    c.restore();
  }

  drawHouseShadow(points: number[][], progress: number) {
    c.save();
    c.globalAlpha = 0.5;
    const skewY = -1 + progress;
    const scaleX = progress;
    c.transform(scaleX, skewY, 0, 1, 0, 0);
    c.beginPath();
    c.moveTo(0, HEIGHT);
    points.forEach(([x, y]) => {
      c.lineTo(x * WIDTH, y * HEIGHT);
    });
    c.fillStyle = colors.black;
    c.clip();
    c.fillRect(0, 0, WIDTH, HEIGHT);
    c.restore();
  }

  drawHouseFace(points: number[][], progress: number) {
    progress = Math.min(1, progress);
    c.save();
    const skewY = 0.5 * (-1 + progress);
    const scaleX = Math.pow(progress, 3);
    c.transform(scaleX, skewY, 0, 1, 0, 0);
    c.beginPath();
    c.moveTo(0, HEIGHT);
    points.forEach(([x, y]) => {
      c.lineTo(x * WIDTH, y * HEIGHT);
    });
    c.fillStyle = colors.white;
    c.strokeStyle = colors.light;
    c.stroke();
    c.save();
    c.clip();
    const plankSize = Math.round(WIDTH / 30);
    c.fillRect(0, 0, WIDTH, HEIGHT);
    for(let i=0; i < 30; i++) {
      c.strokeRect(plankSize * i, 0, plankSize, HEIGHT);
    }
    c.restore();
    this.drawLine(points[1][0]*WIDTH, points[1][1]*HEIGHT, points[2][0]*WIDTH, points[2][1]*HEIGHT, colors.light);
    this.drawLine(points[2][0]*WIDTH, points[2][1]*HEIGHT, points[10][0]*WIDTH, points[10][1]*HEIGHT, colors.light);
    c.restore();
  }

  drawHouse(progress: number, windowSize: Vec2, windowOffset: number) {
    const points = [
      /*  0 */ [0, 0],
      /*  1 */ [0.5, 0],
      /*  2 */ [1, 0.5],
    
      /*  3 */ [1 - windowOffset, 0.5],
      /*  4 */ [1 - windowOffset, 0.5 - windowSize.y],
      /*  5 */ [1 - (windowOffset + windowSize.x), 0.5 - windowSize.y],
      /*  6 */ [1 - (windowOffset + windowSize.x), 0.5 + windowSize.y],
      /*  7 */ [1 - windowOffset, 0.5 + windowSize.y],
      /*  8 */ [1 - windowOffset, 0.5],
    
      /*  9 */ [1, 0.5],
      /* 10 */ [0.5, 1],
      /* 11 */ [0, 1],
    ];

    //  Draw shadow
    this.drawHouseShadow(points, progress);
    this.drawHouseFace(points, progress);
  }

  drawBoatWheel(wheelPos: number) {
    const radius = 40;
    const sectionNum = 8;
    const angleStep = 2 * Math.PI / sectionNum;
    for(let i = 0; i < sectionNum; i++) {
      const rad = angleStep * (i + (wheelPos * sectionNum));
      c.save();
      c.translate(WIDTH/2, HEIGHT/2);
      this.drawLine(
        radius * Math.cos(rad), radius * Math.sin(rad),
        radius * Math.cos(rad + angleStep), radius * Math.sin(rad + angleStep),
        colors.gray
      );
      this.drawLine(
        0, 0,
        2 * radius * Math.cos(rad), 2 * radius * Math.sin(rad),
        colors.gray
      );
      c.restore();
    }

    // Waterline
    const leftY = HEIGHT/2 + radius/2 + Math.sin(2 * Math.PI * wheelPos) * 5;
    const rightY = HEIGHT/2 + radius/2 + Math.cos(2 * Math.PI * wheelPos) * 5;
    this.drawLine(
      0, leftY,
      WIDTH, rightY,
      colors.gray,
    );
    c.beginPath();
    c.moveTo(0, leftY);
    c.lineTo(WIDTH, rightY);
    c.lineTo(WIDTH, HEIGHT);
    c.lineTo(0, HEIGHT);
    c.lineTo(0, leftY);
    c.fill();
  }

  renderPause() {
    c.fillStyle = colors.black + 'DD';
    c.fillRect(0, 0, WIDTH, HEIGHT);
    ['paused', 'press \'P\' to continue'].forEach((text, i) => {
      [colors.black, colors.white].forEach((color, c) => {
        drawText({
          text: text,
          x: WIDTH/2 - c * 1,
          y: HEIGHT/2 + i * 30 - 30 - c * 1,
          textAlign: 'center',
          color,
          size: 3 - i,
        });
      });
    });
  }

  // drawGrid() {
  //   c.strokeStyle = '#ccc';
  //   c.lineWidth = 1;
  //   for (let x = 0; x < WIDTH; x += 16) {
  //       c.beginPath();
  //       c.moveTo(x + 0.5, 0);
  //       c.lineTo(x + 0.5, HEIGHT);
  //       c.stroke();
  //   }
  //   for (let y = 0; y < HEIGHT; y += 16) {
  //       c.beginPath();
  //       c.moveTo(0, y + 0.5);
  //       c.lineTo(WIDTH, y + 0.5);
  //       c.stroke();
  //   }
  // }
}

export const drawEngine = new DrawEngine();
