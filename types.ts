
export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export enum ScaleType {
  Major = 'Major',
  Minor = 'Minor',
  PentatonicMajor = 'Pentatonic Major',
  PentatonicMinor = 'Pentatonic Minor',
  Dorian = 'Dorian',
  Phrygian = 'Phrygian',
  Lydian = 'Lydian',
  Mixolydian = 'Mixolydian',
  Locrian = 'Locrian',
}

export type Language = 'en' | 'zh' | 'ja';

export interface Tuning {
  name: string;
  notes: Note[]; // From string 6 (low) to 1 (high)
}

export enum DisplayMode {
  NoteNames = 'Notes',
  Degrees = 'Solfège',
}

export type ChordType = 
  | 'Major' | 'Minor' | '7' | 'maj7' | 'm7' 
  | 'dim' | 'dim7' | 'aug' 
  | '6' | 'm6' | 'add9' | 'madd9' 
  | 'sus2' | 'sus4' | '9' | 'm9' | 'maj9';

export interface ChordFingering {
  name: string;
  frets: (number | 'x')[]; // 6 values (low to high)
  fingers?: (number | null)[];
}
