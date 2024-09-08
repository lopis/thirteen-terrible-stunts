const queue = Array();
const SAMPLE_RATE = 55000;

function Square(pitch, duration) {
  let t = 0;
  const p = 2 ** (pitch / 12) * 1.24;
  const totalSamples = duration * SAMPLE_RATE;
  return function render() {
    let s = (((t * p) / 2) & 128) / 96 - 0.75;
    ++t;
    if (t >= totalSamples * 0.2) return undefined;
    return 0.2 * s * Math.pow(0.99985, t);
  };
}

function Tri(pitch, duration = 1) {
  let t = 0;
  const p = 2 ** (pitch / 12) / 1.24;
  const totalSamples = duration * SAMPLE_RATE;
  return function render() {
    let s = Math.tan(Math.cbrt(Math.sin((t * p) / 30)));
    ++t;
    if (t >= totalSamples) return undefined;
    return s * Math.pow(0.9999, 2 * t) * 0.2;
  };
}

const genNotes = (str, noteDuration, offset = 0) => {
  return str.split(",").flatMap(value => {
    let duration = noteDuration;
    if (value.includes("!")) {
      duration = 4;
    }
    if (value.includes("_")) {
      duration = 2;
    }
    const values = value
      .replace(/!_/g, "")
      .split(" ")
      .flatMap(n => (isNaN(parseInt(n)) ? [] : [parseInt(n) + offset]));

    const note = [values, duration];

    const emptyNote = [[], 4];
    const notes = [note];
    for (let i = 0; i < duration - 1; i++) {
      notes.push(emptyNote);
    }
    return notes;
  });
};

const lowPart1 =
  "11 -1 11,,11 15 18,,-9 3,,11 15 18,,-2 10,,18 13 10 10,,3 -9,,18 13 10 10,,";
const lowPart2 =
  "10 -2 10,,13 9 4,,3 -9,,9 13 4,,3 -9,,10 13 6,,4 -8,,-6 6 10 13,";
const lowNotes = {
  gen: Square,
  notes: genNotes(
    `${lowPart1}${lowPart1}${lowPart1}${lowPart2},11 -1,,11 15 18,,-9 3,,11 15 18,,-2 10,,18 13 10 10,,3 -9,,18 13 10 10,,${lowPart1}${lowPart1}${lowPart2}`.repeat(
      2
    ),
    1,
    0
  )
};

const highPart1 =
  "27,28 16,29 17,30 18,31 19,,32 20,,33 21,,34 22,,35 23,,36 24,,37 25 36,,37 25 36,,37 25 36,,";
const highPart2 = "37 25 36,,37 25 36,,36 24,,35 23,,34 22,,15";
const highPart3 =
  "15 27 32 39,,15 27 30 39,,,,15 27 31 39,,10 22 31 39,,14 31 26 38,,13 31 25 37,,12 31 24 36,,14 22 34,,12 24 36,,11 23 35,,10 22 34,,13 9 21 33,,10 22 34,,8 20 32,,8 20 32,,39 34 31 29 24,,39 31 29 24 34,,,,39 31 29 24,,39 24 29 31,,38 31 27 22,,37 31 26 21,,36 31 24,,4 28,39 27,26 38,37 25,36 24,35 23,34 22,33 21,32 20,31 19,30 18,29 17,28 16,27 15,26 14,25 13,27 38 39,,27 39,,27 39,,27 39,,27 39,,38 25,,37 24,,36 23,,35 22,,34 21,,33 20,,32 19,,31 18,,32 20,,33 21,,34 22,,22 27 38 39 15,,38 27 22 15 39 34,,38 36 27 22 15 39,,38 27 22 15 39,,38 27 22 15 39,,14 26 38,,37 25,,36 24,,35 23,,,,29 18,,16,,15 27,,,,24";
const highNotes = {
  gen: Tri,
  notes: genNotes(
    `15 19 ${highPart1} ${highPart2} ${highPart1} 36 25,,37 36 25,,37 36 25,,38 26,,38 26,,15 ${highPart1} ${highPart2} 27,28 16,29 17,30 18,31 19,,32 20,32 20,33 21,,34 22,,35 23,,36 24,,37 25 36,,37 25 36,,37 25 36,,37 36 25,,38 26,,38 26,,38 26,,38 26,${highPart3}`,
    1,
    -10
  )
};

const voices = [highNotes, lowNotes];

const noteLength = SAMPLE_RATE / 8;
const processNote = t => {
  t = t * SAMPLE_RATE;
  t |= 0;
  if (t % noteLength == 0) {
    for (let voice of voices) {
      if (voice.notes[t / noteLength] !== undefined) {
        const [values, duration] = voice.notes[t / noteLength];
        for (let value of values) queue.push(voice.gen(value, duration));
      }
    }
  }
  let out = 0;
  for (let i = 0; i < queue.length; ++i) {
    let result = queue[i]();
    if (result !== undefined) out += result;
    else queue.splice(i, 1);
  }
  return out / 8;
};

class MusicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.currentIndex = 0;
    this.chunkSize = 128; // Adjust chunk size as needed
    this.sampleCount = highNotes.notes.length * SAMPLE_RATE / 8;
  }

  process(_inputs, outputs, _parameters) {
    const outputBuffer = outputs[0][0]; // Assuming mono output
    const startIndex = this.currentIndex;
    const endIndex = Math.min(this.currentIndex + this.chunkSize, this.sampleCount);

    for (let i = startIndex; i < endIndex; i++) {
      outputBuffer[i - startIndex] = processNote(i / SAMPLE_RATE);
    }

    this.currentIndex = endIndex;

    // Send a message to the main thread with the current progress
    this.port.postMessage({
      type: 'progress',
      currentIndex: this.currentIndex,
      sampleCount: this.sampleCount
    });

    // Check if processing is complete
    if (this.currentIndex >= this.sampleCount) {
      this.port.postMessage({ type: 'done' });
      return false; // Stop processing
    }

    return true; // Continue processing
  }
}

registerProcessor("music-processor", MusicProcessor);