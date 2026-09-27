import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, Volume2, X, Play, Pause, Activity } from 'lucide-react';
import { speak } from '../services/speechService';

interface SoundWavesLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "Acoustic Wave Propagation",
    content: "Sound is a mechanical longitudinal wave that propagates through a compressible medium (such as air, water, or solids) via periodic compression and rarefaction of particles.",
    image: "🔊",
    type: "propagation"
  },
  {
    title: "Frequency and Perceived Pitch",
    content: "Frequency represents the rate of wave cycles per unit time, quantified in Hertz (Hz). Higher frequencies correspond to shorter wavelengths and higher perceived pitch.",
    image: "📊",
    type: "frequency"
  },
  {
    title: "Amplitude and Volume Dynamics",
    content: "Amplitude defines the maximum displacement of particles from their static equilibrium position. Increased amplitude scales sound pressure levels, causing greater perceived loudness.",
    image: "📈",
    type: "amplitude"
  },
  {
    title: "Waveforms and Harmonic Profiles",
    content: "The shape of a sound wave determines its spectral composition and harmonic content, defining the timbre of a sound. Common periodic profiles include sine, square, triangle, and sawtooth waves.",
    image: "🎵",
    type: "waveforms"
  }
];

export default function SoundWavesLesson({ onCancel, onStartExercise }: SoundWavesLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440); // Default A4
  const [amplitude, setAmplitude] = useState(0.5); // Default 50%
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine');
  const [phase, setPhase] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update oscillator frequency
  useEffect(() => {
    if (oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    }
  }, [frequency]);

  // Update oscillator volume (amplitude)
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      // Scale down to safe volume level (max 0.05)
      gainNodeRef.current.gain.setValueAtTime(amplitude * 0.05, audioContextRef.current.currentTime);
    }
  }, [amplitude]);

  // Update oscillator type
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.type = waveform;
    }
  }, [waveform]);

  // Animate the wave when playing
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const update = () => {
        setPhase(prev => (prev + 0.12) % (Math.PI * 2));
        animId = requestAnimationFrame(update);
      };
      animId = requestAnimationFrame(update);
    } else {
      setPhase(0);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const toggleSound = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(amplitude * 0.05, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    }
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Generate SVG path for the wave visualizer
  const generateWavePath = () => {
    const width = 500;
    const height = 120;
    const points: string[] = [];
    const baseAmp = 40;
    const cycles = (frequency / 250) + 1; // Map frequency range to wave cycles

    for (let x = 0; x <= width; x += 2) {
      const t = x / width;
      const angle = t * cycles * Math.PI * 2 - phase;
      let y = 0;

      if (waveform === 'sine') {
        y = Math.sin(angle);
      } else if (waveform === 'square') {
        y = Math.sin(angle) >= 0 ? 1 : -1;
      } else if (waveform === 'triangle') {
        y = (2 / Math.PI) * Math.asin(Math.sin(angle));
      } else if (waveform === 'sawtooth') {
        y = -2 * (t * cycles - Math.floor(t * cycles + 0.5));
      }

      const screenY = (height / 2) + y * baseAmp * amplitude;
      points.push(`${x},${screenY}`);
    }

    return `M ${points.join(' L ')}`;
  };

  const step = STEPS[currentStep];

  return (
    <div className="max-w-4xl mx-auto py-3 md:py-5 xl:py-12 px-6">
      <div className="bg-white rounded-[28px] xl:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col xl:min-h-[700px]">
        {/* Header */}
        <div className="bg-pink-600 p-5 md:p-6 xl:p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Activity size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Music Laboratory</h2>
              <p className="text-pink-100 text-sm font-bold">Topic: Sound Waves & Frequencies</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-3 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full flex">
          {STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-pink-500' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-7 xl:p-12 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col flex-1"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="text-4xl xl:text-6xl bg-slate-50 w-16 h-16 xl:w-24 xl:h-24 rounded-[32px] flex items-center justify-center shadow-inner shrink-0">
                  {step.image}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-pink-600 font-black text-xs uppercase tracking-widest block">Step {currentStep + 1} of {STEPS.length}</span>
                    <button 
                      onClick={() => speak(step.title + ". " + step.content)}
                      className="p-2 bg-slate-100 hover:bg-pink-100 text-slate-400 hover:text-pink-600 rounded-full transition-colors"
                      title="Listen to lesson text"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{step.title}</h3>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <p className="text-lg leading-relaxed text-slate-700 font-medium mb-6">
                  {step.content}
                </p>

                {/* Wave Lab Interactive Simulator */}
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center">
                  <div className="w-full flex justify-between items-center mb-4 border-b border-slate-200/60 pb-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Waveform Oscillator Lab</span>
                    <button
                      onClick={toggleSound}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${
                        isPlaying 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-pink-600 text-white hover:bg-pink-700'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={16} /> Mute Tone
                        </>
                      ) : (
                        <>
                          <Play size={16} /> Play Tone
                        </>
                      )}
                    </button>
                  </div>

                  {/* SVG Wave Visualizer */}
                  <div className="w-full h-32 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner mb-6">
                    <svg className="w-full h-full">
                      {/* Grid Lines */}
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="4 4" className="w-full" strokeWidth="1" />
                      <path
                        d={generateWavePath()}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-75"
                      />
                    </svg>
                  </div>

                  {/* Controls */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {/* Column 1: Waveform Selector */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Select Waveform (Timbre)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['sine', 'square', 'triangle', 'sawtooth'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => setWaveform(type)}
                            className={`py-2 rounded-lg font-bold capitalize border transition-all ${
                              waveform === type
                                ? 'bg-pink-100 text-pink-700 border-pink-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Sliders */}
                    <div className="flex flex-col justify-between gap-4">
                      {/* Frequency Slider */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                          <span>Frequency (Pitch)</span>
                          <span className="text-pink-600 font-bold">{frequency} Hz</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="1000"
                          step="1"
                          value={frequency}
                          onChange={(e) => setFrequency(Number(e.target.value))}
                          className="w-full accent-pink-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Amplitude Slider */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                          <span>Amplitude (Volume)</span>
                          <span className="text-pink-600 font-bold">{Math.round(amplitude * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={amplitude}
                          onChange={(e) => setAmplitude(Number(e.target.value))}
                          className="w-full accent-pink-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm transition-all ${
                      currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <ArrowLeft size={18} /> Previous
                  </button>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      onClick={next}
                      className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all hover:scale-105 active:scale-95"
                    >
                      Next Step <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={onStartExercise || onCancel}
                      className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 text-lg"
                    >
                      Start Ear Training <CheckCircle size={24} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <button 
        onClick={onCancel}
        className="mt-6 xl:mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Station
      </button>
    </div>
  );
}
