import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Music, X, Play, RotateCcw } from 'lucide-react';
import { MusicScore } from '../types';

interface PianoProps {
  autoPlayScore?: MusicScore;
  onCancel: () => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function Piano({ autoPlayScore, onCancel }: PianoProps) {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (autoPlayScore) {
      // Small delay to ensure user interaction (resuming audio context)
      const timer = setTimeout(() => {
        handleAutoPlay(autoPlayScore);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlayScore]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getFrequency = (keyIndex: number) => {
    // A0 is keyIndex 0, frequency is 27.5 Hz
    return 27.5 * Math.pow(2, keyIndex / 12);
  };

  const playNote = useCallback((keyIndex: number, duration = 1.2) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(getFrequency(keyIndex), audioContextRef.current.currentTime);

      gain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      osc.start();
      osc.stop(audioContextRef.current.currentTime + duration);

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
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, []);

  const handleAutoPlay = async (score: MusicScore) => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    
    // We need to resume audio context on a user-initiated event if possible, 
    // but here we try our best.
    
    for (const note of score.notes) {
      playNote(note.keyIndex, note.duration || 0.8);
      // Wait for the next note
      const nextNote = score.notes[score.notes.indexOf(note) + 1];
      if (nextNote) {
        await new Promise(resolve => setTimeout(resolve, (nextNote.time - note.time) * 1000));
      }
    }
    
    setIsAutoPlaying(false);
  };

  const pianoKeys = [];
  // 88 keys: A0 to C8
  for (let i = 0; i < 88; i++) {
    const noteIndex = (i + 9) % 12; // A is index 9 in NOTES
    const noteName = NOTES[noteIndex];
    const octave = Math.floor((i + 9) / 12);
    const isBlack = noteName.includes('#');
    pianoKeys.push({ index: i, noteName, octave, isBlack });
  }

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
              {isAutoPlaying ? `PLAYING: ${autoPlayScore?.title}` : 'SODOR CONCERT GRAND'}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              {isAutoPlaying ? 'Automated Performance System' : '88-Key Integrated System'}
            </p>
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
        <div className="relative w-full aspect-[21/9] md:aspect-[32/9] bg-slate-800 rounded-xl p-1 shadow-inner flex overflow-hidden">
          {pianoKeys.map((key) => (
            <div 
              key={key.index}
              onMouseDown={() => playNote(key.index)}
              onTouchStart={(e) => {
                e.preventDefault();
                playNote(key.index);
              }}
              className={`
                flex-1 relative transition-all cursor-pointer select-none
                ${key.isBlack 
                  ? 'bg-slate-950 z-20 -mx-[0.6%] h-[60%] rounded-b-md border-x border-slate-800 shadow-xl' 
                  : 'bg-white z-10 h-full rounded-b-lg border-x border-slate-200'
                }
                ${activeKeys.has(key.index) 
                  ? (key.isBlack ? '!bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]' : '!bg-pink-100') 
                  : ''
                }
              `}
            >
              {/* Note indicators for every C and key intervals to help navigation */}
              {!key.isBlack && (key.noteName === 'C' || key.index === 0 || key.index === 87) && (
                <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none opacity-40">
                  <span className="text-[7px] font-black text-slate-900 uppercase">
                    {key.noteName}{key.octave}
                  </span>
                </div>
              )}
            </div>
          ))}
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
