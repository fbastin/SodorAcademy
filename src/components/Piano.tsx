import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Music, X, Play, RotateCcw, Upload, FileText } from 'lucide-react';
import { MusicScore } from '../types';
import { playNote, SoundType, SOUND_PRESETS } from '../services/audioSynthesis';
import { parseMusicXml } from '../services/musicXmlParser';

interface PianoProps {
  autoPlayScore?: MusicScore | null;
  onCancel: () => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function Piano({ autoPlayScore, onCancel }: PianoProps) {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>('grand');
  const [currentScore, setCurrentScore] = useState<MusicScore | null>(autoPlayScore || null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopAutoPlayRef = useRef(false);

  useEffect(() => {
    setCurrentScore(autoPlayScore || null);
  }, [autoPlayScore]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      stopAutoPlayRef.current = true;
    };
  }, []);

  const handleImportXml = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlString = event.target?.result as string;
      try {
        const parsedScore = parseMusicXml(xmlString);
        setCurrentScore(parsedScore);
      } catch (err) {
        console.error('Failed to parse MusicXML:', err);
        alert('Cinders and ashes! That MusicXML file seems to have a problem.');
      }
    };
    reader.readAsText(file);
  };

  const playNoteInternal = useCallback((keyIndex: number, duration = 2.5) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    playNote(audioContextRef.current, keyIndex, soundType, duration);

    setActiveKeys(prev => {
      const next = new Set(prev);
      next.add(keyIndex);
      return next;
    });

    setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(keyIndex);
        return next;
      });
    }, 250);
  }, [soundType]);

  const handleAutoPlay = async () => {
    if (isAutoPlaying || !currentScore) return;
    setIsAutoPlaying(true);
    stopAutoPlayRef.current = false;

    for (let i = 0; i < currentScore.notes.length; i++) {
      if (stopAutoPlayRef.current) break;
      const note = currentScore.notes[i];
      playNoteInternal(note.keyIndex, note.duration || 0.8);
      const nextNote = currentScore.notes[i + 1];
      if (nextNote) {
        const delay = (nextNote.time - note.time) * 1000;
        await new Promise<void>(resolve => {
          let done = false;
          const finish = () => { if (!done) { done = true; resolve(); } };
          const timer = setTimeout(finish, delay);
          const poll = setInterval(() => {
            if (stopAutoPlayRef.current) {
              clearTimeout(timer);
              clearInterval(poll);
              finish();
            }
          }, 50);
          setTimeout(() => clearInterval(poll), delay + 50);
        });
      }
    }

    setIsAutoPlaying(false);
  };

  const stopAutoPlay = () => {
    stopAutoPlayRef.current = true;
    setIsAutoPlaying(false);
  };

  const whiteKeys: {index: number, noteName: string, octave: number}[] = [];
  const blackKeys: {index: number, noteName: string, octave: number, leftPercent: number}[] = [];

  let whiteCount = 0;
  for (let i = 0; i < 88; i++) {
    const noteIndex = (i + 9) % 12;
    const noteName = NOTES[noteIndex];
    const octave = Math.floor((i + 9) / 12);
    if (noteName.includes('#')) {
      const centerPercent = (whiteCount / 52) * 100;
      blackKeys.push({ index: i, noteName, octave, leftPercent: centerPercent });
    } else {
      whiteKeys.push({ index: i, noteName, octave });
      whiteCount++;
    }
  }
  const blackKeyWidth = (1 / 52) * 100 * 0.60;

  return (
    <div className="w-full min-h-[600px] flex flex-col bg-slate-950 rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-800">
      {/* Top Console */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 ${isAutoPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-pink-600'} rounded-xl flex items-center justify-center text-white shadow-lg transition-colors`}>
            <Music size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">
              {isAutoPlaying ? `PLAYING: ${currentScore?.title}` : (currentScore ? `SCORE: ${currentScore.title}` : 'SODOR PIANO STUDIO')}
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                {isAutoPlaying ? 'Automated Performance System' : 'Integrated Synthesis System'}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(SOUND_PRESETS) as SoundType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSoundType(type)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        soundType === type 
                          ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
                          : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {SOUND_PRESETS[type].name}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <label className="cursor-pointer px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest border border-white/5">
                    <Upload size={12} />
                    Import XML
                    <input 
                      type="file" 
                      accept=".musicxml,.xml" 
                      onChange={handleImportXml} 
                      className="hidden" 
                    />
                  </label>

                  {currentScore && (
                    <>
                      {!isAutoPlaying ? (
                        <button 
                          onClick={handleAutoPlay}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                        >
                          <Play size={12} fill="currentColor" />
                          Play Song
                        </button>
                      ) : (
                        <button 
                          onClick={stopAutoPlay}
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-red-900/20"
                        >
                          <X size={12} />
                          Stop
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onCancel}
          className="px-6 py-2 bg-slate-800 hover:bg-red-900 text-white font-black rounded-lg transition-all flex items-center gap-2 text-xs uppercase tracking-widest border border-white/10 active:scale-95"
        >
          <X size={16} />
          Exit Studio
        </button>
      </div>

      {/* Main Piano Bed */}
      <div className="flex-1 bg-slate-900 p-2 md:p-6 flex flex-col justify-center">
        <div className="w-full aspect-[52/9] bg-slate-800 rounded-xl p-1 shadow-inner overflow-hidden">
          <div className="relative w-full h-full">
            {/* White keys */}
            <div className="flex h-full">
              {whiteKeys.map((key) => (
                <div
                  key={key.index}
                  onMouseDown={() => playNoteInternal(key.index)}
                  onTouchStart={(e) => { e.preventDefault(); playNoteInternal(key.index); }}
                  style={{
                    boxShadow: activeKeys.has(key.index)
                      ? 'inset 0 -2px 3px rgba(219,39,119,0.15), 0 2px 4px rgba(0,0,0,0.1)'
                      : 'inset 0 -3px 4px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  className={`
                    flex-1 relative rounded-b-lg border-x border-slate-300/60 cursor-pointer select-none transition-colors
                    ${activeKeys.has(key.index) ? 'bg-pink-100' : 'bg-[#f8f8f2] hover:bg-[#f0f0ea] active:bg-[#e8e8e0]'}
                  `}
                >
                  {(key.noteName === 'C' || key.index === 0 || key.index === 87) && (
                    <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none opacity-40">
                      <span className="text-[7px] font-black text-slate-900 uppercase">
                        {key.noteName}{key.octave}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Black keys */}
            {blackKeys.map((key) => (
              <div
                key={key.index}
                onMouseDown={() => playNoteInternal(key.index)}
                onTouchStart={(e) => { e.preventDefault(); playNoteInternal(key.index); }}
                style={{
                  left: `${key.leftPercent - blackKeyWidth / 2}%`,
                  width: `${blackKeyWidth}%`,
                  boxShadow: activeKeys.has(key.index)
                    ? '0 2px 4px rgba(0,0,0,0.4), 0 0 15px rgba(236,72,153,0.8)'
                    : '2px 5px 8px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)'
                }}
                className={`
                  absolute top-0 h-[62%] rounded-b-md cursor-pointer select-none transition-colors
                  ${activeKeys.has(key.index)
                    ? 'bg-gradient-to-b from-pink-400 via-pink-500 to-pink-700'
                    : 'bg-gradient-to-b from-[#333] via-[#222] to-[#111] hover:from-[#3a3a3a] hover:via-[#2a2a2a] hover:to-[#1a1a1a] active:from-[#2a2a2a] active:via-[#1a1a1a] active:to-[#0a0a0a]'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel / Instructions */}
      <div className="p-6 bg-slate-950/80 border-t border-white/5 flex flex-wrap justify-center gap-12">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A0 Range Limit</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-Touch Ready</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">C8 Range Limit</span>
        </div>
      </div>
    </div>
  );
}
