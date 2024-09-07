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

'0 C6 1 41;0 C7 1 41;2 C6 1 41;2 C7 1 41;2 D#7 1 41;6 C6 1 41;6 C7 1 41;6 E7 1 41;8 G5 1 41;10 B5 1 41;12 A#5 1 41;14 A5 1 41;8 G6 1 41;8 E7 1 41;10 E7 1 41;12 E7 1 41;14 E7 1 41;10 B6 1 41;12 A#6 1 41;14 A6 1 41;16 B5 1 41;18 A5 1 41;20 G#5 1 41;22 G5 1 41;16 G6 1 41;18 A6 1 41;20 G#6 1 41;22 G6 1 41;24 A#5 1 41;24 F#5 1 41;24 F#6 1 41;26 G5 1 41;26 G6 1 41;28 F5 1 41;30 F5 1 41;28 F6 1 41;30 F6 1 41;0 F7 1 41;0 C8 1 41;2 C8 1 41;6 C8 1 41;8 C8 1 41;10 B7 1 41;14 A7 1 41;12 A#7 1 41;16 G7 1 41;18 A7 1 41;20 G#7 1 41;22 G7 1 41;24 F#7 1 41;26 G7 1 41;28 F7 1 41;30 F7 1 41;32 C8 1 41;34 C8 1 41;32 G7 1 41;32 E7 1 41;34 E7 1 41;32 D7 1 41;34 D7 1 41;32 A6 1 41;34 A6 1 41;38 C8 1 41;38 E7 1 41;38 D7 1 41;38 A6 1 41;40 C8 1 41;40 A6 1 41;40 D7 1 41;40 E7 1 41;42 B7 1 41;42 E7 1 41;42 C7 1 41;42 G6 1 41;44 A#7 1 41;44 E7 1 41;44 B6 1 41;44 F#6 1 41;46 A7 1 41;46 E7 1 41;46 A6 1 41;34 G7 1 41;48 C#5 1 41;48 C#7 1 41;49 C8 1 41;49 C7 1 41;50 B6 1 41;50 B7 1 41;51 A#7 1 41;51 A#6 1 41;52 A7 1 41;52 A6 1 41;53 G#7 1 41;53 G#6 1 41;54 G7 1 41;54 G6 1 41;55 F#7 1 41;55 F#6 1 41;56 F7 1 41;56 F6 1 41;57 E7 1 41;57 E6 1 41;58 D#7 1 41;58 D#6 1 41;59 D7 1 41;59 D6 1 41;60 C#7 1 41;60 C#6 1 41;61 C7 1 41;61 C6 1 41;62 B6 1 41;62 B5 1 41;63 A#6 1 41;63 A#5 1 41;64 C7 1 41;64 B7 1 41;64 C8 1 41;66 C7 1 41;68 C7 1 41;70 C7 1 41;72 C7 1 41;74 B7 1 41;74 A#6 1 41;76 A#7 1 41;76 A6 1 41;78 A7 1 41;78 G#6 1 41;80 G#7 1 41;80 G6 1 41;82 G7 1 41;82 F#6 1 41;84 F#7 1 41;84 F6 1 41;86 F7 1 41;86 E6 1 41;88 E7 1 41;88 D#6 1 41;90 F7 1 41;90 F6 1 41;92 F#7 1 41;92 F#6 1 41;94 G7 1 41;94 G6 1 41;66 C8 1 41;68 C8 1 41;70 C8 1 41;72 C8 1 41;96 G6 1 41;96 C7 1 41;96 B7 1 41;96 C8 1 41;96 C6 1 41;98 B7 1 41;98 C7 1 41;98 G6 1 41;98 C6 1 41;98 C8 1 41;98 G7 1 41;100 B7 1 41;100 A7 1 41;100 C7 1 41;100 G6 1 41;100 C6 1 41;100 C8 1 41;102 B7 1 41;102 C7 1 41;102 G6 1 41;102 C6 1 41;102 C8 1 41;104 B7 1 41;104 C7 1 41;104 G6 1 41;104 C6 1 41;104 C8 1 41;106 B5 1 41;106 B6 1 41;106 B7 1 41;108 A#7 1 41;108 A#6 1 41;110 A7 1 41;110 A6 1 41;112 G#7 1 41;112 G#6 1 41;116 D7 1 41;116 D#6 1 41;118 C#6 1 41;120 C6 1 41;120 C7 1 41;124 A6 1 41'
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
