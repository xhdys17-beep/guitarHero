
import { Note, ScaleType, ChordType, ChordFingering } from '../types.ts';
import { NOTES, SCALE_INTERVALS } from '../constants.ts';

export const getNoteIndex = (note: Note): number => NOTES.indexOf(note);

export const getNoteAtFret = (openNote: Note, fret: number): Note => {
  const index = getNoteIndex(openNote);
  return NOTES[(index + fret) % 12];
};

export const getScaleNotes = (root: Note, type: ScaleType): Note[] => {
  const rootIndex = getNoteIndex(root);
  const intervals = SCALE_INTERVALS[type];
  return intervals.map(i => NOTES[(rootIndex + i) % 12]);
};

export const getDegree = (root: Note, note: Note): string => {
  const rootIndex = getNoteIndex(root);
  const noteIndex = getNoteIndex(note);
  const diff = (noteIndex - rootIndex + 12) % 12;
  const degreeMap: Record<number, string> = {
    0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 
    6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
  };
  return degreeMap[diff];
};

interface CagedPattern {
  name: string;
  frets: (number | 'x')[];
  baseRootNote: Note; 
}

export const generateChordShapes = (root: Note, type: ChordType, tuning: Note[]): ChordFingering[] => {
  const shapes: Record<string, CagedPattern[]> = {
    'Major': [
      { name: 'E Shape', frets: [0, 2, 2, 1, 0, 0], baseRootNote: 'E' },
      { name: 'A Shape', frets: ['x', 0, 2, 2, 2, 0], baseRootNote: 'A' },
      { name: 'D Shape', frets: ['x', 'x', 0, 2, 3, 2], baseRootNote: 'D' },
      { name: 'C Shape', frets: ['x', 3, 2, 0, 1, 0], baseRootNote: 'C' },
    ],
    'Minor': [
      { name: 'Em Shape', frets: [0, 2, 2, 0, 0, 0], baseRootNote: 'E' },
      { name: 'Am Shape', frets: ['x', 0, 2, 2, 1, 0], baseRootNote: 'A' },
      { name: 'Dm Shape', frets: ['x', 'x', 0, 2, 3, 1], baseRootNote: 'D' },
    ],
    '7': [
      { name: 'E7 Shape', frets: [0, 2, 0, 1, 0, 0], baseRootNote: 'E' },
      { name: 'A7 Shape', frets: ['x', 0, 2, 0, 2, 0], baseRootNote: 'A' },
      { name: 'D7 Shape', frets: ['x', 'x', 0, 2, 1, 2], baseRootNote: 'D' },
    ],
    'maj7': [
      { name: 'Emaj7', frets: [0, 'x', 1, 1, 0, 'x'], baseRootNote: 'E' },
      { name: 'Amaj7', frets: ['x', 0, 2, 1, 2, 0], baseRootNote: 'A' },
      { name: 'Dmaj7', frets: ['x', 'x', 0, 2, 2, 2], baseRootNote: 'D' },
      { name: 'Cmaj7', frets: ['x', 3, 2, 0, 0, 0], baseRootNote: 'C' },
    ],
    'm7': [
      { name: 'Em7', frets: [0, 2, 0, 0, 0, 0], baseRootNote: 'E' },
      { name: 'Am7', frets: ['x', 0, 2, 0, 1, 0], baseRootNote: 'A' },
      { name: 'Dm7', frets: ['x', 'x', 0, 2, 1, 1], baseRootNote: 'D' },
    ],
    'dim': [
      { name: 'dim Triad', frets: ['x', 'x', 0, 1, 3, 1], baseRootNote: 'D' },
      { name: 'dim Triad (A)', frets: ['x', 0, 1, 2, 1, 'x'], baseRootNote: 'A' },
    ],
    'dim7': [
      { name: 'dim7 (E)', frets: [0, 'x', 2, 3, 2, 'x'], baseRootNote: 'E' },
      { name: 'dim7 (A)', frets: ['x', 0, 1, 2, 1, 'x'], baseRootNote: 'A' },
    ],
    'aug': [
      { name: 'aug (E)', frets: [0, 'x', 2, 1, 1, 0], baseRootNote: 'E' },
      { name: 'aug (A)', frets: ['x', 0, 3, 2, 2, 1], baseRootNote: 'A' },
    ],
    '6': [
      { name: 'E6', frets: [0, 2, 2, 1, 2, 0], baseRootNote: 'E' },
      { name: 'A6', frets: ['x', 0, 2, 2, 2, 2], baseRootNote: 'A' },
    ],
    'm6': [
      { name: 'Em6', frets: [0, 2, 2, 0, 2, 0], baseRootNote: 'E' },
      { name: 'Am6', frets: ['x', 0, 2, 2, 1, 2], baseRootNote: 'A' },
    ],
    'add9': [
      { name: 'add9 (E)', frets: [0, 2, 4, 1, 0, 0], baseRootNote: 'E' },
      { name: 'add9 (A)', frets: ['x', 0, 2, 4, 2, 0], baseRootNote: 'A' },
    ],
    'madd9': [
      { name: 'madd9 (E)', frets: [0, 2, 4, 0, 0, 0], baseRootNote: 'E' },
      { name: 'madd9 (A)', frets: ['x', 0, 2, 4, 1, 0], baseRootNote: 'A' },
    ],
    'sus2': [
      { name: 'sus2 (A)', frets: ['x', 0, 2, 2, 0, 0], baseRootNote: 'A' },
      { name: 'sus2 (E)', frets: [0, 2, 2, 'x', 'x', 'x'], baseRootNote: 'E' },
      { name: 'sus2 (D)', frets: ['x', 'x', 0, 2, 3, 0], baseRootNote: 'D' },
    ],
    'sus4': [
      { name: 'sus4 (E)', frets: [0, 2, 2, 2, 0, 0], baseRootNote: 'E' },
      { name: 'sus4 (A)', frets: ['x', 0, 2, 2, 3, 0], baseRootNote: 'A' },
      { name: 'sus4 (D)', frets: ['x', 'x', 0, 2, 3, 3], baseRootNote: 'D' },
    ],
    '9': [
      { name: '9 (A)', frets: ['x', 0, 2, 0, 0, 0], baseRootNote: 'A' },
      { name: '9 (E)', frets: [0, 'x', 0, 1, 0, 2], baseRootNote: 'E' },
    ],
    'm9': [
      { name: 'm9 (A)', frets: ['x', 0, 2, 0, 0, 3], baseRootNote: 'A' },
      { name: 'm9 (E)', frets: [0, 2, 0, 0, 0, 2], baseRootNote: 'E' },
    ],
    'maj9': [
      { name: 'maj9 (A)', frets: ['x', 0, 2, 1, 0, 0], baseRootNote: 'A' },
    ]
  };

  const baseShapes = shapes[type] || shapes['Major'];
  const targetRootIdx = getNoteIndex(root);

  return baseShapes.map(s => {
    const baseRootIdx = getNoteIndex(s.baseRootNote);
    const transposeSteps = (targetRootIdx - baseRootIdx + 12) % 12;
    
    const newFrets = s.frets.map(f => {
      if (f === 'x') return 'x';
      return (f as number) + transposeSteps;
    });

    return {
      name: `${root}${type === 'Major' ? '' : type === 'Minor' ? 'm' : type} (${s.name})`,
      frets: newFrets
    };
  }).filter(s => s.frets.every(f => f === 'x' || (f >= 0 && f <= 19)));
};
