const queue = Array();
const SAMPLE_RATE = 55000;

function Square(pitch: number, duration: number) {
  let t = 0;
  const p = 2 ** (pitch / 12) * 1.24;
  const totalSamples = duration * SAMPLE_RATE;
  return function render() {
    let s = (t*p/2&128)/96-.75;
    ++t;
    if (t >= totalSamples * 0.2) return undefined;
    return 0.2 * s * Math.pow(.99985, t);
  };
}

function Tri(pitch: number, duration = 1) {
  let t = 0;
  const p = 2**(pitch/12) / 1.24;
  const totalSamples = duration * SAMPLE_RATE;
  return function render() {
    let s = Math.tan(Math.cbrt(Math.sin(t * p / 30)));
    ++t;
    if (t >= totalSamples) return undefined;
    return s * Math.pow(.9999, 2*t) * 0.2;
  };
}

// function Sine(pitch: number, duration: number) {
//   let t = 0;
//   const p = 2 ** (pitch / 12) * BASE_PITCH;
//   const totalSamples = duration * SAMPLE_RATE;
//   return function render() {
//     let s = Math.sin(t * p * Math.PI / 256) / 2;
//     ++t;
//     if (t >= totalSamples) return undefined;
//     return s * .9999 ** t;
//   };
// }

type NoteList = [values: number[], duration: number][]

type Voice = {
  gen: typeof Square;
  notes: NoteList;
};

const genNotes = (str: string, noteDuration: number, offset = 0) => {
  return str.split(',').flatMap(value => {
    let duration = noteDuration;
    if (value.includes('!')) {
      duration = 4;
    }
    if (value.includes('_')) {
      duration = 2;
    }
    const values = value.replace(/!_/g, '').split(' ').flatMap(n => isNaN(parseInt(n)) ? [] : [parseInt(n) + offset]);
    
    const note:[values: number[], duration: number] = [values, duration];
    
    const emptyNote: [values: number[], duration: number] = [[], 4];
    const notes = [note];
    for(let i = 0; i < (duration-1); i++) {
      notes.push(emptyNote);
    }
    return notes;
  });
};

const lowPart1 = "11 -1 11,,11 15 18,,-9 3,,11 15 18,,-2 10,,18 13 10 10,,3 -9,,18 13 10 10,,";
const lowPart2 = "10 -2 10,,13 9 4,,3 -9,,9 13 4,,3 -9,,10 13 6,,4 -8,,-6 6 10 13,";
const lowNotes: Voice = {
	gen: Square,
	notes: genNotes(
    `${lowPart1}${lowPart1}${lowPart1}${lowPart2},11 -1,,11 15 18,,-9 3,,11 15 18,,-2 10,,18 13 10 10,,3 -9,,18 13 10 10,,${lowPart1}${lowPart1}${lowPart2}`.repeat(2),
    1,
    0,
  )
};

const highPart1 = "27,28 16,29 17,30 18,31 19,,32 20,,33 21,,34 22,,35 23,,36 24,,37 25 36,,37 25 36,,37 25 36,,";
const highPart2 = "37 25 36,,37 25 36,,36 24,,35 23,,34 22,,15";
const highPart3 = "15 27 32 39,,15 27 30 39,,,,15 27 31 39,,10 22 31 39,,14 31 26 38,,13 31 25 37,,12 31 24 36,,14 22 34,,12 24 36,,11 23 35,,10 22 34,,13 9 21 33,,10 22 34,,8 20 32,,8 20 32,,39 34 31 29 24,,39 31 29 24 34,,,,39 31 29 24,,39 24 29 31,,38 31 27 22,,37 31 26 21,,36 31 24,,4 28,39 27,26 38,37 25,36 24,35 23,34 22,33 21,32 20,31 19,30 18,29 17,28 16,27 15,26 14,25 13,27 38 39,,27 39,,27 39,,27 39,,27 39,,38 25,,37 24,,36 23,,35 22,,34 21,,33 20,,32 19,,31 18,,32 20,,33 21,,34 22,,22 27 38 39 15,,38 27 22 15 39 34,,38 36 27 22 15 39,,38 27 22 15 39,,38 27 22 15 39,,14 26 38,,37 25,,36 24,,35 23,,,,29 18,,16,,15 27,,,,24";
const highNotes: Voice = {
  gen: Tri,
  notes: genNotes(
    `15 19 ${highPart1} ${highPart2} ${highPart1} 36 25,,37 36 25,,37 36 25,,38 26,,38 26,,15 ${highPart1} ${highPart2} 27,28 16,29 17,30 18,31 19,,32 20,32 20,33 21,,34 22,,35 23,,36 24,,37 25 36,,37 25 36,,37 25 36,,37 36 25,,38 26,,38 26,,38 26,,38 26,${highPart3}`,
    1,
    -10
  )
};

// const bellNotes: Voice = {
// 	gen: Sine,
// 	notes: [
// 		...Tacet(32),
// 		[39,51],,[40,52],[41,53],[42,54],,,,
// 		[35,47],,[37,49],[38,50],[39,51],,,,
// 		[32,44],,[33,45],[34,46],[35,47],,,,
// 		[37,49],,[39,51],[37,49],[35,47],,[47,51,54,59],,
// 	]
// };

const voices: Voice[] = [highNotes, lowNotes];

const n = 4096;
const playNote = (t: number)=> {
	t = t * SAMPLE_RATE * 0.8;
	t |= 0;
	if (t%n == 0) {
		for (let voice of voices) {
			if (voice.notes[t/n] !== undefined) {
        const [values, duration] = voice.notes[t/n];
        for (let value of values)
          queue.push(voice.gen(value, duration));
      }
    }
	}
	let out = 0;
	for (let i=0; i < queue.length; ++i) {
		let result = queue[i]();
		if (result !== undefined)
			out += result;
		else
			queue.splice(i, 1);
	}
	return out/8;
};

class MusicPlayer {
  audioContext: AudioContext;
  buffer: AudioBuffer;
  source: AudioBufferSourceNode | undefined;
  queue: (() => number | undefined)[];
  startTime = 0;
  isPlaying = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.queue = [];
    const totalDuration = this.calculateTotalDuration();
    this.startTime = performance.now();
    this.buffer = this.audioContext.createBuffer(1, (totalDuration / 0.8) * n, SAMPLE_RATE);

    requestAnimationFrame(() => this.preLoad());
  }

  calculateTotalDuration(): number {
    let maxDuration = 0;
    for (const voice of voices) {
      const voiceDuration = (voice.notes.length);
      if (voiceDuration > maxDuration) {
        maxDuration = voiceDuration;
      }
    }
    return maxDuration;
  }

  preLoad() {
    const bufferData = this.buffer.getChannelData(0);
    for (let i = 0; i < bufferData.length; i++) {
      bufferData[i] = playNote(i / SAMPLE_RATE);
    }
    console.log(`Created music buffer in ${performance.now() - this.startTime}ms`);
  }

  startPlayback() {
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.audioContext.destination);
    this.source.loop = true;
    this.isPlaying = true;
    this.source?.start();
  }

  stop() {
    this.isPlaying = false;
    this.source?.stop();
  }
}

export let musicPlayer: MusicPlayer;
export const initMusic = async () => {
  return new Promise<void>((resolve) => {
    if (musicPlayer) {
      resolve();
    } else {
      musicPlayer = new MusicPlayer();
      resolve();
    }
  });
};