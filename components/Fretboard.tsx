
import React from 'react';
import { Note, DisplayMode, Tuning } from '../types.ts';
import { getNoteAtFret, getDegree } from '../services/guitarEngine.ts';

interface FretboardProps {
  tuning: Tuning;
  highlightNotes: Note[];
  rootNote: Note;
  displayMode: DisplayMode;
}

const Fretboard: React.FC<FretboardProps> = ({ tuning, highlightNotes, rootNote, displayMode }) => {
  const fretCount = 15;
  const strings = [...tuning.notes].reverse(); // High E to Low E

  const isNoteHighlighted = (note: Note) => highlightNotes.includes(note);

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-[1000px] relative bg-stone-100 rounded-lg p-8 shadow-inner border border-stone-200">
        {/* Fret Markers */}
        <div className="flex ml-10 mb-2">
          {Array.from({ length: fretCount + 1 }).map((_, i) => (
            <div key={i} className="flex-1 text-center text-xs font-bold text-slate-400">
              {i === 0 ? 'Open' : i}
            </div>
          ))}
        </div>

        {/* Strings */}
        <div className="relative">
          {strings.map((openNote, stringIdx) => (
            <div key={stringIdx} className="flex items-center h-12 relative">
              {/* String Label */}
              <div className="w-10 font-bold text-slate-600 flex justify-center items-center h-full border-r-4 border-slate-300">
                {openNote}
              </div>

              {/* Frets for this string */}
              <div className="flex-1 flex relative">
                {Array.from({ length: fretCount + 1 }).map((_, fretIdx) => {
                  const currentNote = getNoteAtFret(openNote, fretIdx);
                  const isHighlighted = isNoteHighlighted(currentNote);
                  const isRoot = currentNote === rootNote;

                  return (
                    <div 
                      key={fretIdx} 
                      className="flex-1 border-r border-slate-300 relative flex justify-center items-center h-12"
                    >
                      {/* String Line */}
                      <div 
                        className="absolute w-full bg-slate-400" 
                        style={{ height: `${1 + (stringIdx * 0.4)}px`, top: '50%', transform: 'translateY(-50%)' }}
                      />
                      
                      {/* Note Dot */}
                      {isHighlighted && (
                        <div 
                          className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all duration-300 transform hover:scale-110
                            ${isRoot ? 'bg-orange-500 text-white' : 'bg-white text-slate-800 border-2 border-slate-800'}
                          `}
                        >
                          {displayMode === DisplayMode.NoteNames ? currentNote : getDegree(rootNote, currentNote)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Fretboard markers (dots) */}
          <div className="absolute inset-0 pointer-events-none flex ml-10 mt-1">
             {[3, 5, 7, 9, 12, 15].map(pos => (
               <div 
                 key={pos} 
                 className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-200 rounded-full"
                 style={{ left: `${(pos / (fretCount + 1)) * 100}%` }}
               />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fretboard;
