import React, { useEffect, useRef } from 'react';
import { SodorPiano } from '../../piano-lib/src/ui/piano-vanilla';
import { MusicScore } from '../types';

interface PianoProps {
  autoPlayScore?: MusicScore | null;
  onCancel: () => void;
}

export default function Piano({ autoPlayScore, onCancel }: PianoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pianoRef = useRef<SodorPiano | null>(null);

  useEffect(() => {
    if (containerRef.current && !pianoRef.current) {
      pianoRef.current = new SodorPiano(containerRef.current);
      pianoRef.current.onExit = onCancel;
    }

    if (pianoRef.current && autoPlayScore) {
      pianoRef.current.playScore(autoPlayScore);
    }

    return () => {
      if (pianoRef.current) {
        pianoRef.current.stopScore();
      }
    };
  }, [autoPlayScore, onCancel]);

  return (
    <div className="w-full h-[600px] relative sp-academy-wrapper">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-10 left-6 z-[100] flex gap-2">
        <a 
          href="/SodorAcademy/piano/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-800/80 hover:bg-sodor-blue text-white font-bold rounded-lg text-[10px] uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all shadow-lg backdrop-blur-sm"
        >
          <span className="text-sm">↗</span>
          Standalone Version
        </a>
      </div>
    </div>
  );
}
