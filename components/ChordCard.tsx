
import React from 'react';
import { ChordFingering, Note } from '../types.ts';

interface ChordCardProps {
  fingering: ChordFingering;
  tuning: Note[];
}

const ChordCard: React.FC<ChordCardProps> = ({ fingering, tuning }) => {
  const strings = 6;
  const fretRange = 5;
  
  // Find the lowest fret being played (excluding open strings)
  const playedFrets = fingering.frets.filter((f): f is number => typeof f === 'number' && f > 0);
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 0;
  const baseFret = minFret > 1 ? minFret : 1;

  // 弦序标识
  const stringLabels = ['6', '5', '4', '3', '2', '1'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <h4 className="text-center font-black text-slate-900 mb-6 group-hover:text-orange-500 transition-colors tracking-tight">
        {fingering.name}
      </h4>
      
      <div className="relative w-36 mx-auto mb-4">
        <div className="relative aspect-[3/4.5] bg-stone-50/50 border border-stone-100 rounded-sm p-3">
          {/* Base Fret Indicator */}
          {baseFret > 1 && (
            <div className="absolute -left-8 top-6 text-[10px] font-black text-orange-500">
              {baseFret} fr.
            </div>
          )}

          <div className="h-full flex flex-col">
            {/* Nut (枕) */}
            <div className={`h-1.5 bg-slate-800 rounded-t-sm mb-0 ${baseFret > 1 ? 'opacity-20' : ''}`} />
            
            <div className="flex-1 relative">
              {/* Vertical Strings (6 to 1) */}
              <div className="absolute inset-0 flex justify-between px-[1px]">
                {Array.from({ length: strings }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-full bg-slate-300 relative" 
                    style={{ width: `${1 + i * 0.2}px` }} 
                  />
                ))}
              </div>

              {/* Horizontal Frets */}
              <div className="absolute inset-0 flex flex-col">
                {Array.from({ length: fretRange }).map((_, i) => (
                  <div key={i} className="flex-1 border-b border-slate-200" />
                ))}
              </div>

              {/* Fingering Overlay - Dots pressed exactly on strings */}
              <div className="absolute inset-0">
                {fingering.frets.map((fret, stringIdx) => {
                  const leftPos = (stringIdx / (strings - 1)) * 100;

                  if (fret === 'x') {
                    return (
                      <div 
                        key={stringIdx} 
                        className="absolute -top-6 text-[10px] font-black text-red-500" 
                        style={{ left: `${leftPos}%`, transform: 'translateX(-50%)' }}
                      >
                        ×
                      </div>
                    );
                  }
                  if (fret === 0) {
                    return (
                      <div 
                        key={stringIdx} 
                        className="absolute -top-6 text-[10px] font-black text-green-500" 
                        style={{ left: `${leftPos}%`, transform: 'translateX(-50%)' }}
                      >
                        ○
                      </div>
                    );
                  }
                  
                  // Relative fret position inside the 5-fret window
                  const relFret = (fret as number) - baseFret + 1;
                  if (relFret < 1 || relFret > fretRange) return null;

                  return (
                    <div 
                      key={stringIdx}
                      className="absolute w-5 h-5 rounded-full bg-slate-900 shadow-lg border-2 border-white z-10 flex items-center justify-center text-[8px] text-white font-bold"
                      style={{ 
                        left: `${leftPos}%`, 
                        top: `${((relFret - 0.5) / fretRange) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* String Numbers at Bottom */}
        <div className="flex justify-between mt-2 px-1">
          {stringLabels.map(label => (
            <span key={label} className="text-[9px] font-black text-slate-300 w-4 text-center">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChordCard;
