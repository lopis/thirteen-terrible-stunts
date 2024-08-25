import { lineSplit } from "@/util/util";
import { bossIcons, colors, drawEngine, HEIGHT, IconKey, WIDTH } from "./draw-engine";
import { playSentence } from "./audio";
import { gameData } from "./game-data";

let timePassed = 0;
let letterIndex = 0;
const timePerLetter = 30;

let name = '';
let text = '';
let icon: IconKey;

export function setBossDialog(n: string, t: string) {
  name = n;
  text = t;
  icon = bossIcons[gameData.boss];
  timePassed = 0;
  letterIndex = 0;
  playSentence(t);
}

export function renderBossDialog(delta: number) {
  timePassed += delta;
  if (timePassed >= timePerLetter) {
    letterIndex++;
    timePassed -= timePerLetter;
  }

  drawEngine.drawRect(
    { x: 5, y: HEIGHT - 70 },
    { x: WIDTH - 10, y: 50 },
    colors.light,
    colors.white
  );
  drawEngine.drawRect(
    { x: 8, y: HEIGHT - 67 },
    { x: WIDTH - 16, y: 44 },
    colors.light,
    colors.white
  );
  drawEngine.drawText({
    text: name,
    x: 12,
    y: HEIGHT - 63,
    size: 2,
    color: colors.gray
  });
  lineSplit(text, 40).forEach((line, index) => {
    drawEngine.drawText({
      text: line,
      x: 12,
      y: HEIGHT - 45 + (index * 8),
      size: 1,
      maxLetters: letterIndex - (40 * index),
    });
  });

  drawEngine.ctx.save();
  drawEngine.ctx.translate(WIDTH - 45, HEIGHT - 60);
  drawEngine.ctx.save();
  drawEngine.ctx.scale(2, 2);
  drawEngine.drawIcon(icon, { x: 0, y: 0 });
  drawEngine.ctx.restore();
  drawEngine.ctx.restore();
}