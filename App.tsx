
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Tuning, Note, ScaleType, DisplayMode, ChordType, Language } from './types.ts';
import { TUNINGS, NOTES, TRANSLATIONS } from './constants.ts';
import { getScaleNotes, generateChordShapes } from './services/guitarEngine.ts';
import Fretboard from './components/Fretboard.tsx';
import ChordCard from './components/ChordCard.tsx';
import Metronome from './components/Metronome.tsx';
import ChipCalculator from './components/ChipCalculator.tsx';
import { Music, Layers, Layout, ChevronDown, Globe, Edit3, AlertCircle, Check, Zap } from 'lucide-react';

/**
 * A custom styled note selector component for tuning strings
 */
const StringNoteSelector: React.FC<{
  note: Note;
  index: number;
  onSelect: (note: Note) => void;
  lang: Language;
}> = ({ note, index, onSelect, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 group" ref={dropdownRef}>
      <span className="text-[10px] font-black text-slate-400 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
        {t.string} {6 - index}
      </span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 w-14 rounded-xl border-2 font-black text-sm transition-all flex items-center justify-center gap-1 shadow-sm active:scale-90
            ${isOpen ? 'border-orange-500 text-orange-600 bg-orange-50/30 ring-4 ring-orange-50' : 'border-slate-100 text-slate-900 bg-white hover:border-slate-300'}
          `}
        >
          {note}
          <ChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : 'text-slate-300'}`} />
        </button>

        {/* Note Picker Menu */}
        <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-16 bg-white border-2 border-slate-100 rounded-xl shadow-2xl z-[70] overflow-hidden transition-all duration-200 transform
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}>
          <div className="max-h-48 overflow-y-auto no-scrollbar p-1">
            {NOTES.map(n => (
              <button
                key={n}
                onClick={() => {
                  onSelect(n);
                  setIsOpen(false);
                }}
                className={`w-full py-2 rounded-lg text-xs font-black transition-all
                  ${note === n ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scales' | 'chords'>('scales');
  const [lang, setLang] = useState<Language>('zh');
  const [currentTuning, setCurrentTuning] = useState<Tuning>(TUNINGS[0]);
  const [isCustomTuning, setIsCustomTuning] = useState(false);
  const [rootNote, setRootNote] = useState<Note>('C');
  const [scaleType, setScaleType] = useState<ScaleType>(ScaleType.Major);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.NoteNames);
  const [chordType, setChordType] = useState<ChordType>('Major');
  const [isTuningMenuOpen, setIsTuningMenuOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  
  const tuningMenuRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];

  const scaleNotes = useMemo(() => getScaleNotes(rootNote, scaleType), [rootNote, scaleType]);
  const chords = useMemo(() => generateChordShapes(rootNote, chordType, currentTuning.notes), [rootNote, chordType, currentTuning]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tuningMenuRef.current && !tuningMenuRef.current.contains(event.target as Node)) {
        setIsTuningMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectTuning = (tuningName: string) => {
    if (tuningName === 'custom') {
      setIsCustomTuning(true);
    } else {
      setIsCustomTuning(false);
      setCurrentTuning(TUNINGS.find(t_cfg => t_cfg.name === tuningName) || TUNINGS[0]);
    }
    setIsTuningMenuOpen(false);
  };

  const updateStringNote = (index: number, note: Note) => {
    const newNotes = [...currentTuning.notes];
    newNotes[index] = note;
    setCurrentTuning({ name: t.custom, notes: newNotes });
  };

  const isStandardTuning = currentTuning.name === 'Standard' && !isCustomTuning;
  const isAAAAAA = currentTuning.notes.every(n => n === 'A');

  const CHORD_TYPES: ChordType[] = [
    'Major', 'Minor', '7', 'maj7', 'm7', 
    'dim', 'dim7', 'aug', 
    '6', 'm6', 'add9', 'madd9', 
    'sus2', 'sus4', '9', 'm9', 'maj9'
  ];

  if (showCalculator) {
    return <ChipCalculator onBack={() => setShowCalculator(false)} lang={lang} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white selection:bg-orange-100 selection:text-orange-900">
      {/* Sidebar - Compact & Scrollable */}
      <nav className="w-full md:w-24 lg:w-64 bg-white border-r border-slate-100 flex md:flex-col sticky top-0 md:h-screen z-50 overflow-y-auto no-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="p-4 md:p-6 flex flex-col items-center lg:items-stretch gap-4 w-full h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Music size={22} />
            </div>
            <span className="hidden lg:block font-black text-xl tracking-tighter text-slate-900">{t.title}</span>
          </div>

          {/* Nav Tabs */}
          <div className="flex flex-row md:flex-col gap-1 w-full">
            {[
              { id: 'scales', icon: Layers, label: t.scales },
              { id: 'chords', icon: Layout, label: t.chords },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-xl transition-all duration-300 transform active:scale-95 ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-y-[-2px]' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon size={20} />
                <span className="hidden lg:block font-bold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Persistent Metronome */}
          <div className="hidden md:block w-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <Metronome compact />
          </div>

          {/* Rock Hero Card & Lang Switcher Section */}
          <div className="hidden md:flex flex-col gap-2 w-full mt-auto">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 shadow-sm">
               <p className="text-[11px] font-black text-orange-600 leading-relaxed italic">
                 "{t.rockHero}"
               </p>
            </div>
            
            {/* Language Selection Buttons - Prominent */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full">
               {(['zh', 'en', 'ja'] as Language[]).map(l => (
                 <button
                   key={l}
                   onClick={() => setLang(l)}
                   className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${lang === l ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {l.toUpperCase()}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter transition-all">
                {activeTab === 'scales' ? t.scales : t.chords}
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
               {/* Custom Tuning Dropdown */}
               <div className="relative" ref={tuningMenuRef}>
                 <button 
                  onClick={() => setIsTuningMenuOpen(!isTuningMenuOpen)}
                  className={`flex items-center gap-4 bg-white border-2 px-6 py-3 rounded-2xl font-black transition-all shadow-sm min-w-[200px] justify-between group active:scale-95
                    ${isCustomTuning 
                      ? 'border-orange-500 text-orange-600 ring-4 ring-orange-50' 
                      : 'border-slate-100 text-slate-900 hover:border-slate-900'}
                  `}
                 >
                   <span className="truncate">
                    {isCustomTuning ? `✨ ${t.customTuning}` : `${currentTuning.name} ${t.tuning}`}
                   </span>
                   <ChevronDown size={18} className={`transition-transform duration-300 ${isTuningMenuOpen ? 'rotate-180' : ''} text-slate-400 group-hover:text-slate-900`} />
                 </button>

                 {/* Dropdown Menu */}
                 <div className={`absolute right-0 mt-3 w-64 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden transition-all duration-300 origin-top-right transform
                    ${isTuningMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                 `}>
                    <div className="p-2 space-y-1">
                      {TUNINGS.map(tn => (
                        <button
                          key={tn.name}
                          onClick={() => selectTuning(tn.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all
                            ${currentTuning.name === tn.name && !isCustomTuning 
                              ? 'bg-slate-900 text-white' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                          `}
                        >
                          {tn.name} {t.tuning}
                          {currentTuning.name === tn.name && !isCustomTuning && <Check size={16} />}
                        </button>
                      ))}
                      <div className="h-px bg-slate-100 my-1 mx-2" />
                      <button
                        onClick={() => selectTuning('custom')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all
                          ${isCustomTuning 
                            ? 'bg-orange-500 text-white' 
                            : 'text-orange-600 hover:bg-orange-50'}
                        `}
                      >
                        ✨ {t.customTuning}
                        {isCustomTuning && <Check size={16} />}
                      </button>
                    </div>
                 </div>
               </div>

               {/* View Mode Toggle */}
               <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                 <button 
                  onClick={() => setDisplayMode(DisplayMode.NoteNames)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${displayMode === DisplayMode.NoteNames ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {t.notes}
                 </button>
                 <button 
                  onClick={() => setDisplayMode(DisplayMode.Degrees)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${displayMode === DisplayMode.Degrees ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {t.solfege}
                 </button>
               </div>
            </div>
          </div>

          {/* Custom Tuning - Dynamic Form with Updated Selectors */}
          {isCustomTuning && (
            <div className="mt-8 p-6 bg-slate-50/50 rounded-3xl border-2 border-dashed border-orange-200 flex flex-col md:flex-row md:items-center gap-6 animate-in slide-in-from-top-4 shadow-[inset_0_2px_10px_rgba(249,115,22,0.02)]">
              <div className="flex items-center gap-3 text-orange-600 font-black text-xs uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-100 shrink-0">
                <Edit3 size={16} className="text-orange-500" /> {t.customTuning}
                {isAAAAAA && (
                  <button 
                    onClick={() => setShowCalculator(true)}
                    className="ml-4 bg-slate-900 text-white p-2 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2 animate-bounce"
                  >
                    <Zap size={14} className="fill-current" />
                    <span className="text-[10px]">{lang === 'zh' ? '开启筹码计算器' : 'Open Chip Calculator'}</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3 md:gap-5">
                {currentTuning.notes.map((note, idx) => (
                  <StringNoteSelector
                    key={idx}
                    index={idx}
                    note={note}
                    lang={lang}
                    onSelect={(newNote) => updateStringNote(idx, newNote)}
                  />
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Tab Content Rendering */}
        <div className="animate-in fade-in duration-1000">
          {activeTab === 'scales' && (
            <section className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
                <div className="lg:col-span-2 space-y-4">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.key}</label>
                   <div className="grid grid-cols-6 gap-2">
                     {NOTES.map(note => (
                       <button
                        key={note}
                        onClick={() => setRootNote(note)}
                        className={`w-full h-11 rounded-xl font-black text-sm transition-all border-2 active:scale-95 ${
                          rootNote === note 
                            ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-100 scale-105' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 shadow-sm'
                        }`}
                       >
                         {note}
                       </button>
                     ))}
                   </div>
                </div>
                <div className="lg:col-span-4 space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.scaleType}</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(ScaleType).map(type => (
                      <button
                        key={type}
                        onClick={() => setScaleType(type)}
                        className={`px-6 h-11 rounded-xl font-black text-sm transition-all border-2 active:scale-95 ${
                          scaleType === type 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-100' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Fretboard 
                tuning={currentTuning}
                highlightNotes={scaleNotes}
                rootNote={rootNote}
                displayMode={displayMode}
              />
            </section>
          )}

          {activeTab === 'chords' && (
            <section className="space-y-10">
              {/* Tuning Warning for Chords */}
              {!isStandardTuning && (
                <div className="flex items-center gap-3 p-5 bg-orange-50 border-2 border-orange-100 rounded-3xl text-orange-700 animate-in fade-in slide-in-from-top-2 shadow-sm">
                   <AlertCircle size={22} className="shrink-0" />
                   <p className="text-sm font-black leading-snug">{t.chordWarning}</p>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <aside className="lg:w-72 shrink-0 space-y-8 lg:sticky lg:top-8 self-start max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pr-2">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.key}</label>
                    <div className="grid grid-cols-4 gap-2">
                       {NOTES.map(note => (
                        <button
                          key={note}
                          onClick={() => setRootNote(note)}
                          className={`h-11 rounded-xl font-black text-sm transition-all border-2 active:scale-95 ${
                            rootNote === note 
                              ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.chordQuality}</label>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                      {CHORD_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => setChordType(type)}
                          className={`text-left px-4 py-3 rounded-xl font-black text-xs transition-all border-2 ${
                            chordType === type 
                              ? 'bg-slate-900 text-white border-slate-900 lg:translate-x-2 shadow-lg shadow-slate-100' 
                              : 'text-slate-400 bg-white border-transparent hover:bg-slate-50 hover:text-slate-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                <div className="flex-1 space-y-8 min-w-0">
                  <div className="flex items-center justify-between border-b-4 border-slate-900 pb-4">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {t.voicings} {rootNote}{chordType === 'Major' ? '' : chordType === 'Minor' ? 'm' : chordType}
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{chords.length} {t.results}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {chords.map((chord, i) => (
                      <div key={i} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 50}ms` }}>
                        <ChordCard fingering={chord} tuning={currentTuning.notes} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Mobile Sticky Language Switcher */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 flex justify-center gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         {(['zh', 'en', 'ja'] as Language[]).map(l => (
           <button
             key={l}
             onClick={() => setLang(l)}
             className={`px-6 py-2 rounded-xl text-xs font-black ${lang === l ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
           >
             {l.toUpperCase()}
           </button>
         ))}
      </div>

      <footer className="hidden md:flex fixed bottom-6 right-10 flex-col items-end gap-1 pointer-events-none z-40 opacity-30 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t.engineReady}</span>
        <div className="flex items-center gap-3">
           <Globe size={14} className="text-slate-200" />
           <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">V4.5-ULTIMATE</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
