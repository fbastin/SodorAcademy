import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, Volume2, X, Globe } from 'lucide-react';
import { speak } from '../services/speechService';

interface ContinentsLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "Concept of Continents",
    content: "A continent is one of Earth's primary continuous landmasses. There are seven continents on Earth. The Island of Sodor is geographically situated in Europe.",
    image: "🌍",
    type: "intro"
  },
  {
    title: "Asia",
    content: "Asia is the largest continent by both area and population. It contains Earth's highest elevation, Mount Everest, and features diverse climatic regions.",
    image: "🏮",
    type: "info"
  },
  {
    title: "Africa",
    content: "Africa is the second-largest continent, characterized by vast deserts, tropical rainforests, and diverse wildlife including megafauna.",
    image: "🦁",
    type: "info"
  },
  {
    title: "North America",
    content: "North America contains nations such as Canada and the United States. It features extensive metropolitan areas, vast plains, and major mountain ranges.",
    image: "🗽",
    type: "info"
  },
  {
    title: "South America",
    content: "South America features the Amazon Basin, containing the world's largest rainforest, and the Andean mountain range along its western coast.",
    image: "🦜",
    type: "info"
  },
  {
    title: "Antarctica",
    content: "Antarctica is the southernmost continent. It is the coldest, windiest, and driest landmass, almost entirely covered by ice, and lacks permanent human habitation.",
    image: "🐧",
    type: "info"
  },
  {
    title: "Europe",
    content: "Europe features a high density of sovereign states, rich history, major urban centers, and extensive rail infrastructure.",
    image: "🏰",
    type: "info"
  },
  {
    title: "Australia",
    content: "Australia is a unique continent and country, colloquially termed the 'Land Down Under', known for endemic species such as marsupials.",
    image: "🦘",
    type: "info"
  }
];

export default function ContinentsLesson({ onCancel, onStartExercise }: ContinentsLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);

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

  const step = STEPS[currentStep];

  return (
    <div className="max-w-4xl mx-auto py-3 md:py-5 xl:py-12 px-6">
      <div className="bg-white rounded-[28px] xl:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col xl:min-h-[650px]">
        {/* Header */}
        <div className="bg-orange-600 p-5 md:p-6 xl:p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Globe size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Geography Station</h2>
              <p className="text-orange-100 text-sm font-bold">Topic: The 7 Continents of the World</p>
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
              className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-orange-500' : 'bg-transparent'}`}
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
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="bg-slate-50 w-16 h-16 xl:w-24 xl:h-24 rounded-[32px] flex items-center justify-center shadow-inner shrink-0 overflow-hidden text-4xl xl:text-6xl">
                  <span>{step.image}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-orange-600 font-black text-xs uppercase tracking-widest block">Step {currentStep + 1} of {STEPS.length}</span>
                    <button 
                      onClick={() => speak(step.title + ". " + step.content)}
                      className="p-2 bg-slate-100 hover:bg-orange-100 text-slate-400 hover:text-orange-600 rounded-full transition-colors"
                      title="Listen to lesson"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{step.title}</h3>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-lg xl:text-xl leading-relaxed text-slate-700 font-medium mb-6 xl:mb-12">
                  {step.content}
                </p>
              </div>

              {/* Navigation */}
              <div className="mt-6 xl:mt-12 flex justify-between items-center">
                <button
                  onClick={prev}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm transition-all ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ArrowLeft size={18} /> Previous
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
                  >
                    Next Continent <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={onStartExercise || onCancel}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 text-lg"
                  >
                    Start the World Tour! <CheckCircle size={24} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <button 
        onClick={onCancel}
        className="mt-6 xl:mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        ← Back to the station
      </button>
    </div>
  );
}
