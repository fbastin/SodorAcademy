import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, X, Play, RotateCcw, Volume2, Trophy, Train } from 'lucide-react';
import { Grade } from '../types';

interface PianoSequenceProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function PianoSequence({ grade, questionsCount = 10, onComplete, onCancel }: PianoSequenceProps) {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState<string>('Press "Listen" to hear the sequence!');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    generateNewSequence();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getFrequency = (keyIndex: number) => {
    return 27.5 * Math.pow(2, keyIndex / 12);
  };

  const playNote = useCallback((keyIndex: number, duration = 0.8) => {
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
      }, 300);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, []);

  const generateNewSequence = () => {
    // Generate 3 random notes within a 2-octave range for primary, or wider for secondary
    const rangeStart = grade === 'Primary' ? 39 : 27; // C4 (Middle C) or C3
    const rangeEnd = grade === 'Primary' ? 63 : 75;   // C6 or C7
    
    const newSeq = [];
    for (let i = 0; i < 3; i++) {
      const randomKey = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
      newSeq.push(randomKey);
    }
    setSequence(newSeq);
    setUserInput([]);
    setIsCorrect(null);
    setMessage('Listen carefully!');
  };

  const playSequence = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setUserInput([]);
    setIsCorrect(null);
    
    for (let i = 0; i < sequence.length; i++) {
      playNote(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsPlaying(false);
    setMessage('Now your turn! Click the 3 notes you heard.');
  };

  const handleKeyClick = (keyIndex: number) => {
    if (isPlaying || questionsAnswered >= questionsCount) return;
    
    playNote(keyIndex);
    
    const nextInput = [...userInput, keyIndex];
    setUserInput(nextInput);
    
    if (nextInput.length === 3) {
      const correct = nextInput.every((val, index) => val === sequence[index]);
      setIsCorrect(correct);
      
      if (correct) {
        setMessage('Brilliant! You heard those notes perfectly! 🚂');
        const nextAnswered = questionsAnswered + 1;
        setQuestionsAnswered(nextAnswered);
        
        if (nextAnswered >= questionsCount) {
          setTimeout(() => onComplete('engine'), 2000);
        } else {
          setTimeout(generateNewSequence, 2000);
        }
      } else {
        setMessage('Cinders and ashes! Let\'s listen again.');
        setTimeout(() => {
          setUserInput([]);
          setIsCorrect(null);
        }, 2000);
      }
    }
  };

  const pianoKeys = [];
  for (let i = 0; i < 88; i++) {
    const noteIndex = (i + 9) % 12;
    const noteName = NOTES[noteIndex];
    const octave = Math.floor((i + 9) / 12);
    const isBlack = noteName.includes('#');
    pianoKeys.push({ index: i, noteName, octave, isBlack });
  }

  const progress = (questionsAnswered / questionsCount) * 100;

  return (
    <div className="w-full flex flex-col bg-slate-950 rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-800">
      {/* Top Console */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Music size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight uppercase">Music::Ear Training</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Crovan's Gate Academy</p>
          </div>
        </div>
        
        <button 
          onClick={onCancel}
          className="px-6 py-2 bg-slate-800 hover:bg-red-900 text-white font-black rounded-lg transition-all flex items-center gap-2 text-xs uppercase tracking-widest border border-white/10 active:scale-95"
        >
          <X size={16} />
          Exit
        </button>
      </div>

      <div className="p-8 flex flex-col items-center">
        {/* Progress Tracker */}
        <div className="w-full max-w-2xl mb-8">
           <div className="flex justify-between items-end mb-2">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Trophy size={14} className="text-sodor-gold" />
               Sequence {questionsAnswered + 1} / {questionsCount}
             </span>
             <span className="text-xs font-black text-pink-500 uppercase tracking-widest">
               {Math.round(progress)}% Complete
             </span>
           </div>
           <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="h-full bg-pink-600 shadow-[0_0_10px_rgba(219,39,119,0.5)]"
             />
           </div>
        </div>

        <div className="bg-slate-900 w-full max-w-4xl p-8 rounded-3xl border border-white/5 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-50" />
          
          <p className={`text-xl font-bold mb-8 transition-colors ${isCorrect === true ? 'text-emerald-400' : isCorrect === false ? 'text-red-400' : 'text-white'}`}>
            {message}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={playSequence}
              disabled={isPlaying}
              className={`
                px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95
                ${isPlaying ? 'bg-slate-800 text-slate-600' : 'bg-pink-600 text-white shadow-lg shadow-pink-900/20 hover:bg-pink-500'}
              `}
            >
              <Volume2 size={24} />
              {isPlaying ? 'PLAYING...' : 'LISTEN'}
            </button>

            <button
              onClick={generateNewSequence}
              disabled={isPlaying}
              className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-700 transition-all active:scale-95"
            >
              <RotateCcw size={20} />
              SKIP
            </button>
          </div>

          {/* User Input Visualizer */}
          <div className="mt-8 flex justify-center gap-3">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xs font-black
                  ${userInput[i] !== undefined 
                    ? (isCorrect === null ? 'bg-pink-600 border-pink-400 text-white' : isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-red-600 border-red-400 text-white')
                    : 'bg-slate-800 border-slate-700 text-slate-600 border-dashed'
                  }
                `}
              >
                {userInput[i] !== undefined ? '♪' : '?'}
              </div>
            ))}
          </div>
        </div>

        {/* The Piano Bed */}
        <div className="w-full relative aspect-[21/9] md:aspect-[32/9] bg-slate-800 rounded-xl p-1 shadow-inner flex overflow-hidden">
          {pianoKeys.map((key) => (
            <div 
              key={key.index}
              onMouseDown={() => handleKeyClick(key.index)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyClick(key.index);
              }}
              className={`
                flex-1 relative transition-all cursor-pointer select-none
                ${key.isBlack 
                  ? 'bg-slate-950 z-20 -mx-[0.6%] h-[60%] rounded-b-md border-x border-slate-800 shadow-xl' 
                  : 'bg-white z-10 h-full rounded-b-lg border-x border-slate-200'
                }
                ${activeKeys.has(key.index) 
                  ? (key.isBlack ? '!bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]' : '!bg-pink-100') 
                  : (isCorrect === false && sequence.includes(key.index) 
                      ? (key.isBlack ? '!bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]' : '!bg-green-100') 
                      : '')
                }
              `}
            >
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
    </div>
  );
}
