
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Minus } from 'lucide-react';

interface MetronomeProps {
  compact?: boolean;
}

const Metronome: React.FC<MetronomeProps> = ({ compact = false }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const audioCtx = useRef<AudioContext | null>(null);
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerId.current) window.clearInterval(timerId.current);
    };
  }, []);

  const playClick = (isStrong: boolean) => {
    if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }

    const osc = audioCtx.current.createOscillator();
    const envelope = audioCtx.current.createGain();

    osc.frequency.value = isStrong ? 1200 : 800;
    envelope.gain.value = 0.5;
    envelope.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);

    osc.connect(envelope);
    envelope.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (timerId.current) window.clearInterval(timerId.current);
      setIsPlaying(false);
      setBeat(0);
    } else {
      const interval = (60 / bpm) * 1000;
      let currentBeat = 0;
      playClick(true);
      timerId.current = window.setInterval(() => {
        currentBeat = (currentBeat + 1) % 4;
        setBeat(currentBeat);
        playClick(currentBeat === 0);
      }, interval);
      setIsPlaying(true);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full">
           <button onClick={() => setBpm(Math.max(40, bpm - 1))} className="p-1 hover:bg-slate-200 rounded transition-colors"><Minus size={12}/></button>
           <span className="font-black text-slate-800 text-base tabular-nums">{bpm}</span>
           <button onClick={() => setBpm(Math.min(280, bpm + 1))} className="p-1 hover:bg-slate-200 rounded transition-colors"><Plus size={12}/></button>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-100 ${isPlaying && beat === i ? 'bg-orange-500 scale-125 shadow-sm' : 'bg-slate-300'}`} />
          ))}
        </div>
        <button 
          onClick={togglePlay}
          className={`w-full py-2 rounded-xl flex items-center justify-center transition-all text-xs font-black uppercase tracking-widest ${
            isPlaying ? 'bg-slate-800 text-white' : 'bg-orange-500 text-white shadow-md hover:scale-105 active:scale-95'
          }`}
        >
          {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setBpm(Math.max(40, bpm - 1))} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><Minus size={20} /></button>
        <div className="text-center">
          <div className="text-4xl font-black text-slate-800 tabular-nums">{bpm}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BPM</div>
        </div>
        <button onClick={() => setBpm(Math.min(280, bpm + 1))} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><Plus size={20} /></button>
      </div>
      <div className="flex gap-2 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-100 ${isPlaying && beat === i ? 'bg-orange-500 scale-125 shadow-lg' : 'bg-slate-200'}`} />
        ))}
      </div>
      <button onClick={togglePlay} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-slate-800 text-white shadow-inner' : 'bg-orange-50 text-orange-500 border-2 border-orange-500 shadow-xl shadow-orange-100 hover:scale-105 active:scale-95'}`}>
        {isPlaying ? <Square fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
      </button>
    </div>
  );
};

export default Metronome;
