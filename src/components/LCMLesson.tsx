import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, X, List, Search, Trophy, Volume2 } from 'lucide-react';
import { speak } from '../services/speechService';

interface LCMLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "What is a Multiple?",
    content: "A multiple is what you get when you multiply a number by 1, 2, 3, and so on. It's like counting by that number!",
    image: "🚂",
    list: { number: 3, values: [3, 6, 9, 12, 15] }
  },
  {
    title: "Listing Multiples",
    content: "To find the Smallest Common Multiplier (LCM), start by listing the multiples for BOTH numbers.",
    image: "🗒️",
    dualList: { 
      n1: 4, v1: [4, 8, 12, 16, 20],
      n2: 6, v2: [6, 12, 18, 24, 30]
    }
  },
  {
    title: "Finding Common Multiples",
    content: "Now, look for numbers that appear in BOTH lists. These are called Common Multiples. They are stations where both engines stop!",
    image: "🔍",
    comparison: {
      n1: 4, v1: [4, 8, 12, 16, 20, 24],
      n2: 6, v2: [6, 12, 18, 24, 30],
      common: [12, 24]
    }
  },
  {
    title: "The Smallest One (LCM)",
    content: "The Smallest Common Multiplier is simply the SMALLEST number that is in both lists. In our example, 12 is the LCM of 4 and 6!",
    image: "🏆",
    result: { n1: 4, n2: 6, lcm: 12 }
  }
];

export default function LCMLesson({ onCancel, onStartExercise }: LCMLessonProps) {
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
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <List size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Academy Lesson</h2>
              <p className="text-indigo-100 text-sm font-bold">Topic: Finding the LCM</p>
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
              className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-indigo-500' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="text-6xl bg-slate-50 w-24 h-24 rounded-[32px] flex items-center justify-center shadow-inner shrink-0">
                  {step.image}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-widest block">Step {currentStep + 1} of {STEPS.length}</span>
                    <button 
                      onClick={() => speak(step.title + ". " + step.content)}
                      className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-full transition-colors"
                      title="Listen to lesson"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{step.title}</h3>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xl leading-relaxed text-slate-700 font-medium mb-12">
                  {step.content}
                </p>

                {/* Visualization */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[180px]">
                  {step.list && (
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-sm font-black text-slate-400 uppercase">Multiples of {step.list.number}</span>
                      <div className="flex gap-3">
                        {step.list.values.map(v => (
                          <div key={v} className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm">
                            {v}
                          </div>
                        ))}
                        <span className="text-slate-400 font-black flex items-end">...</span>
                      </div>
                    </div>
                  )}

                  {step.dualList && (
                    <div className="flex flex-col gap-6 w-full max-w-md">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase">Engine {step.dualList.n1} stops at:</span>
                        <div className="flex gap-2 flex-wrap">
                          {step.dualList.v1.map(v => (
                            <div key={v} className="px-3 py-2 bg-white rounded-lg border border-slate-200 font-bold text-slate-700">{v}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase">Engine {step.dualList.n2} stops at:</span>
                        <div className="flex gap-2 flex-wrap">
                          {step.dualList.v2.map(v => (
                            <div key={v} className="px-3 py-2 bg-white rounded-lg border border-slate-200 font-bold text-slate-700">{v}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step.comparison && (
                    <div className="flex flex-col gap-6 w-full max-w-md">
                      {[1, 2].map(i => {
                        const n = i === 1 ? step.comparison?.n1 : step.comparison?.n2;
                        const v = i === 1 ? step.comparison?.v1 : step.comparison?.v2;
                        return (
                          <div key={i} className="flex flex-col gap-2">
                            <div className="flex gap-2 flex-wrap">
                              {v?.map(val => {
                                const isCommon = step.comparison?.common.includes(val);
                                return (
                                  <div key={val} className={`px-3 py-2 rounded-lg border-2 font-black transition-all ${isCommon ? 'bg-indigo-600 border-indigo-400 text-white scale-110 shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                                    {val}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {step.result && (
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex items-center gap-8">
                         <div className="flex flex-col items-center">
                            <span className="text-4xl">🚂</span>
                            <span className="font-black text-slate-400">Number {step.result.n1}</span>
                         </div>
                         <Search className="text-indigo-600" size={32} />
                         <div className="flex flex-col items-center">
                            <span className="text-4xl">🚋</span>
                            <span className="font-black text-slate-400">Number {step.result.n2}</span>
                         </div>
                      </div>
                      <div className="bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-4">
                         <Trophy className="text-yellow-400" />
                         <span className="text-2xl font-black uppercase tracking-widest">LCM = {step.result.lcm}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-12 flex justify-between items-center">
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
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={onStartExercise || onCancel}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 text-lg"
                  >
                    Start Practicing! <CheckCircle size={24} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <button 
        onClick={onCancel}
        className="mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Station
      </button>
    </div>
  );
}
