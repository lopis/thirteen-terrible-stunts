const t = (i: number, n: number)=>(n-i)/n;

// Sound player
export const playSound = (f: (i: number) => number) => {
  const A = new AudioContext();
  const m = A.createBuffer(1,96e3,48e3);
  const b = m.getChannelData(0);
  for(let i = 96e3; i--;) b[i] = f(i);
  const s = A.createBufferSource();
  s.buffer=m;
  s.connect(A.destination);
  s.start();
};

// Sound
export const ooof = () => playSound((i: number) => {
  var n=2e4;
  if (i > n) return 0;
  var q = t(i,n);
  return 0.1 * Math.sin(-i*0.03*Math.sin(0.09*i+Math.sin(i/200))+Math.sin(i/100))*q*q;
});


// Voice Effects
export const voiceFn = function(i: number, syllables: number, pitchShift: number): number {
  const n = syllables * 3e3;
  if (i > n) return 0;
  return Math.sin(pitchShift * i/25 - Math.sin(i/5)* 0.5) * Math.sin(i / (n/syllables) * Math.PI) * 0.2;
};

// Sound Effect player
export const startVoiceEffect = (syllables: number, pitchShift: number, onEnded: () => void) => {
  const A = new AudioContext(),
  bufferSize = (syllables + 0.25) * 3e3,
  m = A.createBuffer(1,bufferSize,48e3),
  b = m.getChannelData(0);
  for(let i = bufferSize; i--;) {
    b[i] = voiceFn(i, syllables, pitchShift);
  }
  const s = A.createBufferSource();
  s.buffer = m;
  s.connect(A.destination);
  s.start();
  s.onended = onEnded;
};

export const playWord = (syllables: number, onEnded: () => void) => {
  const pitchShift = 1 + (Math.random() - 0.5) * 0.5;
  startVoiceEffect(syllables, pitchShift, onEnded);
};

let isPlayingVoice = false;
export const playSentence = (sentence: string) => {
  isPlayingVoice = true;
  const words = sentence.replace(/[^a-zA-Z\s]/g, '').split(" ");
  let index = 0;
  let interval = 60;
  let time = 0;

  const playNextWord = () => {
    if (isPlayingVoice && index < words.length) {  
      time = performance.now();
      const syllables = Math.floor(words[index].replace(/[^a-zA-Z\s]/g, '').length/2) || 1;
      playWord(syllables, () => {
        const duration = performance.now() - time;
        time = performance.now();
        const remainingDelay = Math.max((syllables + 1) * interval - duration, 0);
        setTimeout(playNextWord, remainingDelay);
      });
      index++;
    } else {
      isPlayingVoice = false;
    }
  };

  playNextWord();
};

export const stopPlayingSentence = () => {
  isPlayingVoice = false;
};

// const text = "Hello i am lopis how are you?".replace(/[^a-zA-Z\s]/g, '');;
// const words = text.split(" ").map(w => w.length);

// let cumulativeDelay = 0;

// words.forEach((w, i) => {
//   const r = Math.floor(w/2) || 1;
//   cumulativeDelay += i == 0 ? 0 : (1000 * (r + 1) * 4e3 / 48e3);  // Increase the cumulative delay based on the word length
//   const pitchShift = 1 + (Math.random() - 0.5) * 0.5;
//   setTimeout(() => {
//     play(r, pitchShift);
//   }, cumulativeDelay);  // Add an initial delay of 500ms
// });

