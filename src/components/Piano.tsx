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
    }

    if (pianoRef.current && autoPlayScore) {
      pianoRef.current.playScore(autoPlayScore);
    }

    return () => {
      if (pianoRef.current) {
        pianoRef.current.stopScore();
      }
    };
  }, [autoPlayScore]);

  return (
    <div className="w-full sp-academy-wrapper">
      <div className="flex items-center justify-between gap-3 mb-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-full bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white font-bold text-sm transition-colors"
        >
          ← Back to Music Station
        </button>
        <a
          href="/SodorPiano/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-slate-800 hover:bg-sodor-blue text-white font-bold text-sm transition-colors flex items-center gap-2"
        >
          <span aria-hidden="true">↗</span>
          Full-screen piano
        </a>
      </div>
      <div ref={containerRef} className="w-full h-[min(640px,calc(100vh-10rem))] min-h-[420px] rounded-2xl overflow-hidden" />
    </div>
  );
}
