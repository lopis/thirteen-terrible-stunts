const queue = Array();

function Square(pitch: number) {
  let t = 0;
  const p = 2 ** (pitch / 12) * 1.24;
  return function render() {
    let s = (t * p / 2 & 128) / 96 - .75;
    ++t;
    if (t == 32768) return undefined;
    return s * .9999 ** t;
  };
}

function Tri(pitch: number) {
  let t = 0;
  const p = 2 ** (pitch / 12) * 1.24;
  return function render() {
    let s = Math.asin(Math.sin(t * p * Math.PI / 256)) * 2 / Math.PI;
    ++t;
    if (t == 32768) return undefined;
    return s * .9998 ** t;
  };
}

function Sine(pitch: number) {
  let t = 0;
  const p = 2 ** (pitch / 12) * 1.24;
  return function render() {
    let s = Math.sin(t * p * Math.PI / 256) / 2;
    ++t;
    if (t == 32768) return undefined;
    return s * .9999 ** t;
  };
}

const Tacet = (ticks: number) => Array(ticks);

type Voice = {
  gen: (pitch: number) => () => number | undefined;
  notes: (number[] | undefined)[];
};

const lowNotes: Voice = {
	gen: Square,
	notes: [
		[11],,[18,23],,[10],,[13,18,25],,
		[8],,[11,15,20],,[6],,[10,15,22],,
		[4],,[11,16],,[3],,[6,11,18],,
		[5],,[11,13,20],,[6],,[16,18,22],,
		[11],,[15,23],,[10],,[13,18,25],,
		[8],,[11,15,20],,[6],,[10,15,22],,
		[4],,[11,16],,[3],,[6,11,18],,
		[5,11,20],,[6,16,22],,[11,15],,[-1],,
	]
};

const highNotes: Voice = {
	gen: Tri,
	notes: [
		[27],[35,39],[28,40],[29,41],[30],[37,42],[32,44],[30,42],
		[23],[32,35],[25,37],[26,38],[27],[34,39],[28,40],[27,39],
		[20],[28,32],[21,33],[22,34],[23],[30,35],[22,34],[23,35],
		[25],[32,37],[27,39],[25,37],[25],[34,37],[27,39],[28,40],
		[35,39],[27],[28,40],[29,41],[30],[37,42],[32,44],[30,42],
		[32,35],[23],[25,37],[26,38],[27],[34,39],[28,40],[27,39],
		[28,32],[20],[21,33],[22,34],[23],[30,35],[22,34],[23,35],
		[25],[35,37],[27,34,39],[25,37],[23],[30,35],,
	]
};

const bellNotes: Voice = {
	gen: Sine,
	notes: [
		...Tacet(32),
		[39,51],,[40,52],[41,53],[42,54],,,,
		[35,47],,[37,49],[38,50],[39,51],,,,
		[32,44],,[33,45],[34,46],[35,47],,,,
		[37,49],,[39,51],[37,49],[35,47],,[47,51,54,59],,
	]
};

const voices: Voice[] = [lowNotes, highNotes, bellNotes];

const playNote = (t: number, sampleRate = 40000)=>{
	t *= sampleRate*0.8;
	t |= 0;
	if (t%4096 == 0) {
		for (let voice of voices)
			if (voice.notes[t/4096] !== undefined)
        // @ts-ignore
				for (let note of voice.notes[t/4096])
					queue.push(voice.gen(note));
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

const SAMPLE_RATE = 32000;
class MusicPlayer {
  audioContext: AudioContext;
  buffer: AudioBuffer;
  source: AudioBufferSourceNode;
  sampleRate: number;
  queue: (() => number | undefined)[];

  constructor(sampleRate = SAMPLE_RATE) {
    this.sampleRate = sampleRate;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.queue = [];
    const totalDuration = this.calculateTotalDuration();
    this.buffer = this.audioContext.createBuffer(1, totalDuration * this.sampleRate, this.sampleRate);
    this.source = this.audioContext.createBufferSource();
  }

  calculateTotalDuration(): number {
    let maxDuration = 0;
    for (const voice of voices) {
      const voiceDuration = (voice.notes.length + 20) * 4096 / this.sampleRate;
      if (voiceDuration > maxDuration) {
        maxDuration = voiceDuration;
      }
    }
    return maxDuration;
  }

  startPlayback() {
    const bufferData = this.buffer.getChannelData(0);
    for (let i = 0; i < bufferData.length; i++) {
      bufferData[i] = playNote(i / this.sampleRate);
    }
    this.source.buffer = this.buffer;
    this.source.connect(this.audioContext.destination);
    this.source.start();
  }
}

export const musicPlayer = new MusicPlayer();