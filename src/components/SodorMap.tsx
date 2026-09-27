import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { Subject, SUBJECTS } from '../types';

interface SodorMapProps {
  onSelectSubject: (subject: Subject) => void;
  onOpenPreferences: () => void;
}

const SodorMap: React.FC<SodorMapProps> = ({ onSelectSubject, onOpenPreferences }) => {
  return (
    <div className="relative w-full aspect-[16/9] bg-[#0c1a2b] rounded-[40px] overflow-hidden border-[8px] lg:border-[12px] border-[#1e293b] shadow-[0_20px_60px_rgba(0,0,0,0.35)] group/map font-sans">
      {/* Official Map Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/SodorAcademy/media/Sodor Island.png" 
          alt="Island of Sodor" 
          className="w-full h-full object-cover opacity-90 brightness-75 contrast-125"
        />
        {/* Subtle Overlay to match the app aesthetic */}
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Interactive HUD Layer */}
      <div className="absolute inset-4">
        {/* COMPASS TRIGGER (TOP LEFT) */}
        <div className="absolute top-4 left-4 z-20">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenPreferences}
            className="w-12 h-12 bg-slate-900/90 backdrop-blur-xl rounded-full border-2 border-white/20 flex items-center justify-center text-white shadow-2xl hover:border-sodor-gold/50 hover:text-sodor-gold transition-all group"
            title="Lesson length"
            aria-label="Lesson length"
          >
            <Compass size={28} className="transition-transform group-hover:animate-pulse" />
          </motion.button>
        </div>

        {/* FIXED STATION MARKERS (ALIGNED TO IMAGE LANDMARKS) */}
        {SUBJECTS.map((subject) => {
          const Icon = subject.icon;
          return (
            <div 
              key={subject.id}
              className="absolute pointer-events-none"
              style={{ left: `${subject.x}%`, top: `${subject.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex flex-col items-center">
                 {/* High-Precision Interactive Hub */}
                 <motion.button
                   whileHover={{ scale: 1.1, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => onSelectSubject(subject)}
                   aria-label={`${subject.name} – ${subject.station}`}
                   title={`${subject.name} – ${subject.station}`}
                   className={`
                     w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white shadow-2xl 
                     border-2 border-white/40 transition-all pointer-events-auto relative overflow-hidden group/btn
                     bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm
                   `}
                 >
                   {/* Subject Theme Highlight */}
                   <div className={`absolute inset-0 ${subject.color} opacity-70 group-hover/btn:opacity-100 transition-opacity`} />
                   
                   <Icon size={24} className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                   
                 </motion.button>

                 {/* Subject and station label */}
                 <div className="mt-1.5 text-center bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 shadow-lg">
                    <span className="block text-[11px] lg:text-xs font-black text-white leading-tight whitespace-nowrap">
                       {subject.name}
                    </span>
                    <span className="block text-[9px] lg:text-[10px] font-bold text-white/60 leading-tight whitespace-nowrap">
                       {subject.station}
                    </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default SodorMap;
