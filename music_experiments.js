frequencies = {
  'C': -9,
  'C#': -8,
  'D': -7,
  'D#': -6,
  'E': -5,
  'F': -4,
  'F#': -3,
  'G': -2,
  'G#': -1,
  'A': 0,
  'A#': 1,
  'B': 2,
};

'0 D6 1 8;0 D7 1 8;1 D#7 1 8;1 D#6 1 8;2 E7 1 8;2 E6 1 8;3 F7 1 8;3 F6 1 8;4 F#7 1 8;4 F#6 1 8;5 G7 1 41;5 G6 1 41;7 A7 1 41;7 A6 1 41;6 G#6 1 41;6 G#7 1 41'
.split(';')
.reduce(({notes, prevIndex, indexOffset}, current) => {
  let [index, note, _, duration] = current.split(' ')
  index = parseInt(index)
  if (prevIndex - index > 30) {
    if (prevIndex - (index + indexOffset) > 30) {
      indexOffset = prevIndex;
    }
    index += indexOffset;
  }

  if (!notes[index]) {
    notes[index] = [[], duration]
  }

  const regex = /^([A-G]#?)(\d)$/;
  const match = note.match(regex);
  const noteName = match[1];
  const octave = parseInt(match[2]) - 4;
  const toneOffset = frequencies[noteName] + octave * 12

  notes[index][0].push(toneOffset)
  return {notes, prevIndex: index, indexOffset};
}, {notes:[], prevIndex: 0, indexOffset: 0})
.notes
.map(v => v || [[], duration])
.map(([notes, duration]) => notes.join(' ')).join(',')


frequencies = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2,};
`E5 E6 A7 E7
E5 E6 G6 E7

E5 E6 G6 E7
B5 B6 G6 E7
D5 D6 G6 D7
D5 D6 G6 D7
C5 C6 G6 C7
D5 B6 G6 B7
C5 C6 C7`.split('\n')
.map(line => line.split(' ').map(note => {
  const regex = /^([A-G]#?)(\d)$/;
  if (note == '') return ''
  const match = note.match(regex);
  const noteName = match[1];  const octave = parseInt(match[2]) - 4;
  const toneOffset = frequencies[noteName] + octave * 12
  return toneOffset
}))
.map(notes => notes.join(' ')).join(',')
