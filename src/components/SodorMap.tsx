import React from 'react';
import { motion } from 'motion/react';
import { Train, Activity, Globe, Compass } from 'lucide-react';
import { Subject, SUBJECTS } from '../types';

interface SodorMapProps {
  onSelectSubject: (subject: Subject) => void;
  onOpenPreferences: () => void;
}

const SodorMap: React.FC<SodorMapProps> = ({ onSelectSubject, onOpenPreferences }) => {
  return (
    <div className="relative w-full aspect-[16/9] bg-[#0c1a2b] rounded-[40px] overflow-hidden border-[12px] border-[#1e293b] shadow-[0_0_100px_rgba(0,0,0,0.6)] group/map font-sans">
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
            title="Lesson Preferences"
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
                 {/* Hub Identification Tag */}
                 <div className="mb-2 bg-[#0c1a2b]/90 border border-white/20 px-3 py-1 rounded shadow-2xl backdrop-blur-md flex flex-col items-center">
                    <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest leading-none mb-0.5">
                       NWR::STATION
                    </span>
                    <span className="text-[9px] font-black text-white whitespace-nowrap tracking-tight">
                       {subject.station.toUpperCase()}
                    </span>
                 </div>

                 {/* High-Precision Interactive Hub */}
                 <motion.button
                   whileHover={{ scale: 1.1, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => onSelectSubject(subject)}
                   className={`
                     w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-2xl 
                     border-2 border-white/40 transition-all pointer-events-auto relative overflow-hidden group/btn
                     bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm
                   `}
                 >
                   {/* Subject Theme Highlight */}
                   <div className={`absolute inset-0 ${subject.color} opacity-30 group-hover/btn:opacity-60 transition-opacity`} />
                   
                   <Icon size={24} className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                   
                   {/* Pulse Signal */}
                   <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse" />
                 </motion.button>

                 {/* Subject Label */}
                 <div className="mt-2 text-center bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/5">
                    <span className="text-[9px] font-black text-white/90 uppercase tracking-tighter">
                       {subject.name}
                    </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* HUD HEADER */}
      <div className="absolute top-10 left-10 flex items-center gap-6">
        <div className="relative group/logo">
          <div className="absolute -inset-3 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
          <div className="w-14 h-14 bg-slate-900/90 backdrop-blur-2xl rounded-2xl border-2 border-white/20 flex items-center justify-center text-white shadow-2xl relative">
            <Train size={28} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight flex items-center gap-3">
            ISLAND OF SODOR
            <span className="text-[8px] bg-emerald-600 text-white px-2 py-0.5 rounded-sm tracking-widest font-bold">LIVE FEED</span>
          </h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">Integrated Academy Navigation</p>
        </div>
      </div>

      {/* METRICS PANEL */}
      <div className="absolute bottom-10 right-10 bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 flex flex-col gap-2 shadow-2xl">
         <div className="flex items-center justify-between gap-6">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Signal Status</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-2">
               <Activity size={12} /> CLEAR
            </span>
         </div>
         <div className="h-[1px] w-full bg-white/5" />
         <div className="flex items-center gap-2">
            <Globe size={12} className="text-blue-400" />
            <span className="text-[9px] font-mono font-bold text-white/60">IRISH SEA :: SECTOR_7G</span>
         </div>
      </div>

      {/* FOOTER COORDS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/20 tracking-[0.5em] font-bold uppercase">
         Position Validated // 54.13°N 3.50°W
      </div>
    </div>
  );
};

export default SodorMap;
