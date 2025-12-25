
import { Note, ScaleType, Tuning, Language } from './types';

export const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TUNINGS: Tuning[] = [
  { name: 'Standard', notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
  { name: 'Drop D', notes: ['D', 'A', 'D', 'G', 'B', 'E'] },
  { name: 'DADGAD', notes: ['D', 'A', 'D', 'G', 'A', 'D'] },
  { name: 'Open G', notes: ['D', 'G', 'D', 'G', 'B', 'D'] },
  { name: 'Half-Step Down', notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'] },
];

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  [ScaleType.Major]: [0, 2, 4, 5, 7, 9, 11],
  [ScaleType.Minor]: [0, 2, 3, 5, 7, 8, 10],
  [ScaleType.PentatonicMajor]: [0, 2, 4, 7, 9],
  [ScaleType.PentatonicMinor]: [0, 3, 5, 7, 10],
  [ScaleType.Dorian]: [0, 2, 3, 5, 7, 9, 10],
  [ScaleType.Phrygian]: [0, 1, 3, 5, 7, 8, 10],
  [ScaleType.Lydian]: [0, 2, 4, 6, 7, 9, 11],
  [ScaleType.Mixolydian]: [0, 2, 4, 5, 7, 9, 10],
  [ScaleType.Locrian]: [0, 1, 3, 5, 6, 8, 10],
};

export const DEGREES = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    title: 'GuitarHero',
    subtitle: 'Fretboard & Chords Library.',
    scales: 'Scales',
    chords: 'Chords',
    tuning: 'Tuning',
    customTuning: 'Custom',
    key: 'Key',
    scaleType: 'Scale',
    notes: 'Notes',
    solfege: 'Solfege',
    metronome: 'Metronome',
    chordQuality: 'Quality',
    voicings: 'Voicings:',
    results: 'Results',
    custom: 'Custom',
    string: 'Str',
    engineReady: 'READY',
    rockHero: "Hey mama, I don't want to be a coder anymore, I'm gonna be a rock hero!",
    chordWarning: "Note: Chord shapes currently show for standard tuning (EADGBE) only."
  },
  zh: {
    title: '摇滚英雄',
    subtitle: '指板与和弦库。',
    scales: '音阶探索',
    chords: '和弦库',
    tuning: '调弦',
    customTuning: '自定义',
    key: '调性',
    scaleType: '音阶类型',
    notes: '音名',
    solfege: '唱名',
    metronome: '节拍器',
    chordQuality: '和弦性质',
    voicings: '按法：',
    results: '个按法',
    custom: '自定义',
    string: '弦',
    engineReady: '就绪',
    rockHero: '嘿妈妈，我不想再当个码农，我要做摇滚英雄！',
    chordWarning: "温馨提示：和弦库目前仅支持展示标准调弦 (EADGBE) 下的按法。"
  },
  ja: {
    title: 'ロックヒーロー',
    subtitle: '指板とコード。',
    scales: 'スケール',
    chords: 'コード',
    tuning: '調律',
    customTuning: 'カスタム',
    key: 'キー',
    scaleType: 'スケール',
    notes: '音名',
    solfege: '階名',
    metronome: 'メトロノーム',
    chordQuality: '種類',
    voicings: '押さえ方：',
    results: 'パターン',
    custom: 'カスタム',
    string: '弦',
    engineReady: '完了',
    rockHero: 'ねえ、お母さん。もうプログラマーにはなりたくない。僕はロックヒーローになるんだ！',
    chordWarning: "ヒント：コードライブラリは現在、標準チューニング（EADGBE）のパターンのみを表示します。"
  }
};
