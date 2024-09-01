const queue = Array();
const SAMPLE_RATE = 40000;

function Square(pitch: number, duration: number) {
  let t = 0;
  const p = 2 ** (pitch / 12) * 1.24;
  const totalSamples = duration * SAMPLE_RATE;
  return function render() {
    let s = (t*p/2&128)/96-.75;
    ++t;
    if (t >= totalSamples * 0.2) return undefined;
    return s * Math.pow(.99985, t);
  };
}

// function Tri(pitch: number, duration = 1) {
//   let t = 0;
//   const p = 2**(pitch/12)*1.24;
//   const totalSamples = duration * SAMPLE_RATE;
//   return function render() {
//     // let s = Math.asin(Math.sin((t / 1) * p * Math.PI / 256)) * 2 / Math.PI;
//     let s = Math.asin(Math.sin(t*p*Math.PI/256))*2/Math.PI;
//     ++t;
//     if (t >= totalSamples) return undefined;
//     return s * Math.pow(.9999, 2*t) * 0.2;
//   };
// }

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

const lowNotes: Voice = {
	gen: Square,
	notes: genNotes(
    ('0,4 7,-3,4 7,-3,4 6,-6 4 6!,' + 
    '-3,4 6,-6,4 6,-2,4 7,-5 4 7!,' + 
    '0,4 7,-3,4 7,-3,4 6,-6!,' + 
    '-5,4 6,-6,-1 4 6,0,-3 4 7,-7!').repeat(2),
    2,
    1
  )
};

const highNotes: Voice = {
  gen: Square,
  notes: genNotes(
    ','.repeat(lowNotes.notes.length / 2) +
    '4,3,4,5,' +
    '4,3,2,4,' +
    '3,2,3,4,' +
    '3!,' +
    '3,2,3,4,' +
    '5,4,3,2,' +
    '2,2,3,3,' +
    '4!,' +
    '4,3,4,5,' +
    '4,3,2,4,' +
    '3,2,3,4,' +
    '3!,' +
    '3,2,3,4,' +
    '5,4,3,2,' +
    '0_,-3_,0!',
    1,
    30
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

const playNote = (t: number)=> {
	t = t * SAMPLE_RATE * 0.8;
	t |= 0;
	if (t%4096 == 0) {
		for (let voice of voices) {
			if (voice.notes[t/4096] !== undefined) {
        const [values, duration] = voice.notes[t/4096];
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
  source: AudioBufferSourceNode;
  queue: (() => number | undefined)[];
  startTime = 0;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.queue = [];
    const totalDuration = this.calculateTotalDuration();
    this.startTime = performance.now();
    this.buffer = this.audioContext.createBuffer(1, (totalDuration*1.2) * 4096, SAMPLE_RATE);
    this.source = this.audioContext.createBufferSource();

    requestAnimationFrame(() => this.preLoad());
  }

  calculateTotalDuration(): number {
    let maxDuration = 0;
    for (const voice of voices) {
      const voiceDuration = (voice.notes.length + 20);
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
    this.source.buffer = this.buffer;
    this.source.connect(this.audioContext.destination);
    console.log(`Created music buffer in ${performance.now() - this.startTime}ms`);
  }

  startPlayback() {
    this.source.start();
  }
}

export const musicPlayer = new MusicPlayer();