import { hexToRgb } from "@/util/colors";
import { colors } from "./draw-engine";

export const tinyFont = /* font-start */',2rwzo,,58jgo,jp1dr,jz6rj,2pav8,dehn9,34ao,3o,b28,3k,20o0o,9a7vy,jbmjj,jhza7,ivhmm,etrs7,ju8e7,jalrz,jyn66,jwdj3,jwdlv,2t8g,2t8s,34yo,lskg,m2yo,jf4lo,jysjy,98ruh,j8htq,9v7zj,j8d32,ju78f,ju8t4,9ul2n,g44e1,90kge,jewdq,g4rbt,fgsgv,hha5t,g6xgz,98rou,j8d7c,98uwe,j8d7d,9xgxq,jykqs,g3zn2,g3z9g,b1ipn,h4qu3,c8oz2,jhyfz,,,,'/* font-end */.split(',');

const bitmaps: {[key: string]: ImageBitmap} = {};

export type DrawTextProps = {
  text: string,
  x: number,
  y: number,
  color?: string,
  textAlign?: CanvasTextAlign,
  size?: number,
}

export const drawText = (
  ctx: CanvasRenderingContext2D,
  {
    text,
    x,
    y,
    color = colors.black,
    textAlign = 'left',
    size = 2,
  } : DrawTextProps
) => {
  if (!text) text = ' ';
  const letterWidth = 5 * size;
  const spacing = 1 * size;
  const spaced = letterWidth + spacing;
  const width = spaced * text.length;
  const id = text+color;
  const offsetX = textAlign === 'left' ? 0 : textAlign === 'center' ? width / 2 : width;
  if (bitmaps[id]) {
    ctx.drawImage(bitmaps[id], x - offsetX, y);
  } else {
    const imageData = new ImageData(width, letterWidth);
    // this.context.getImageData(x - offsetX, y + offsetY, width, 5);
    const [r, g, b, a] = hexToRgb(color);
    text.toUpperCase().split('').forEach((character: string, i) => {
      // @ts-ignore
      const letter = character === ' ' ? '0' : tinyFont[character.charCodeAt(0) - 35];
      const paddedBinary = String(parseInt(letter, 36).toString(2)).padStart(25, '0');
      paddedBinary.split('').forEach((bit, j) => {
        if (bit !== '0') {
          for (let q = 0; q < size; q++) {
            const jSize = j * size;
            const baseIndex = (
              (i * spaced) + // character
              (jSize % (letterWidth)) + // pixel
              (size * width * Math.floor(jSize / letterWidth)) + // line
              (width * q)
            ) * 4;

            // Draw 1 pixel (4 channels)
            for (let p = 0; p < size; p++) {
              const index = p*4 + baseIndex;
              imageData.data[index] = r;
              imageData.data[index + 1] = g;
              imageData.data[index + 2] = b;
              imageData.data[index + 3] = a || 255;
            }
          }
        }
      });
    });
    createImageBitmap(imageData)
    .then(bitmap => {
      bitmaps[id] = bitmap;
      ctx.drawImage(bitmaps[id], x - offsetX, y);
    });
  }
};