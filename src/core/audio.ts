import { gameData } from "./game-data";

/* eslint-disable max-classes-per-file */
const melodies = [
  [6, 5, 3, 3, 5, 5, 0, 5, -2, 0, -2, 0, 6, 3, 2, 3],
  [4, 3, 5, 4, 3, 5, 6, 4, 3, 5, 4, 3, 5, 6, 4, 3],
  [3, 2, 3, 6, 0, -2, 0, -2, 5, 0, 5, 5, 3, 3, 5, 6],
];
const baseTracks = [
  [2, 3, 2.5, 4],
  [4, 3.5, 3, 2.5],
  [4, 2.5, 3, 2],
];

const f = (melody: number[], baseTrack: number[]) => (t: number): number => {
  const drums = Math.sin(Math.pow(10, (-(t+1) / 2048) % 8) * 60) / 8;
  const mainNote = Math.tan(Math.cbrt(Math.sin(t * melody[t >> 13 & 15] / 30)));

  const noteLengths = [2, 3, 4, 6, 8, 12, 16, 24];
  const mainTrack = mainNote / noteLengths[t / [1, 1.5][t >> 12 & 1] >> 10 & 7] / 32;

  const base = Math.cbrt(Math.asin(Math.sin(t / baseTrack[t >> 16 & 3] / 10))) / 64;
  
  return (drums + mainTrack + base);
};

const SAMPLE_RATE = 32000;
class BytebeatPlayer {
  source: AudioBufferSourceNode | null = null;
  buffers: AudioBuffer[] = [];
  ctx: AudioContext;

  constructor() {
    this.ctx = new AudioContext();
    this.createBuffers();
  }

  createBuffers() {
    for (let i = 0; i < 3; i++) {
      const melody = melodies[i % melodies.length];
      const baseTrack = baseTracks[i % melodies.length];
      const bufferSize = (melody.length + 0.4) * SAMPLE_RATE / 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, SAMPLE_RATE); 
      const data = buffer.getChannelData(0);
      for (let d = 0; d < bufferSize; d++) {
        data[d] = f(melody, baseTrack)(d);
      }
      this.buffers.push(buffer);
    }
  }

  start() {
    this.ctx = new AudioContext();
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.buffers[gameData.level];
    this.source.connect(this.ctx.destination);
    this.source.loop = true;
    
    this.source.start();
  }
  
  stop() {
    this?.source?.stop();
  }
}

let player: BytebeatPlayer;
export const initAudio = () => {
  player = new BytebeatPlayer();
};

export const startAudio = () => {
  setTimeout(() => {
    player.start();
  }, 100);
};
export const stopAudio = () => {
  player && player.stop();
};

