import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, X, Calculator, Plus, Divide, Trophy, Volume2 } from 'lucide-react';
import { speak } from '../services/speechService';

interface ArithmeticMeanLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "Definition of Arithmetic Mean",
    content: "The arithmetic mean, or average, represents the central value of a set of numbers, calculated by distributing the total sum equally among all elements.",
    image: "🚂",
    example: { label: "Engine Loads", values: [4, 6, 8] }
  },
  {
    title: "Step 1: Summation of Values",
    content: "First, calculate the sum of all elements in the dataset by adding them together.",
    image: "➕",
    calculation: { label: "4 + 6 + 8", result: 18 }
  },
  {
    title: "Step 2: Division by Count",
    content: "Next, divide the sum by the total count of values in the set (in this case, 3 elements).",
    image: "➗",
    calculation: { label: "18 ÷ 3", result: 6 }
  },
  {
    title: "Final Mean Calculation",
    content: "The arithmetic mean is 6, indicating that equal distribution of the total load across the 3 entities yields 6 units each.",
    image: "🏆",
    result: { value: 6, unit: "units" }
  }
];

export default function ArithmeticMeanLesson({ onCancel, onStartExercise }: ArithmeticMeanLessonProps) {
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
      <div className="bg-white rounded-[28px] xl:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col xl:min-h-[600px]">
        {/* Header */}
        <div className="bg-blue-600 p-5 md:p-6 xl:p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calculator size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Academy Lesson</h2>
              <p className="text-blue-100 text-sm font-bold">Topic: Arithmetic Mean (Average)</p>
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
              className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-blue-500' : 'bg-transparent'}`}
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
                <div className="text-4xl xl:text-6xl bg-slate-50 w-16 h-16 xl:w-24 xl:h-24 rounded-[32px] flex items-center justify-center shadow-inner shrink-0">
                  {step.image}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest block">Step {currentStep + 1} of {STEPS.length}</span>
                    <button 
                      onClick={() => speak(step.title + ". " + step.content)}
                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-400 hover:text-blue-600 rounded-full transition-colors"
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

                {/* Visualization */}
                <div className="bg-slate-50 rounded-3xl p-5 md:p-6 xl:p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[180px]">
                  {step.example && (
                    <div className="flex flex-col items-center gap-6">
                      <span className="text-sm font-black text-slate-400 uppercase">{step.example.label}</span>
                      <div className="flex gap-6 items-end">
                        {step.example.values.map((v, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                             <div 
                                className="w-12 bg-blue-500 rounded-t-lg shadow-lg transition-all duration-1000"
                                style={{ height: `${v * 15}px` }}
                             />
                             <span className="font-black text-blue-600">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.calculation && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-4xl font-black text-slate-400 mb-2">
                        {step.calculation.label}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-slate-200" />
                        <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl font-black text-3xl">
                          {step.calculation.result}
                        </div>
                        <div className="h-[2px] w-12 bg-slate-200" />
                      </div>
                    </div>
                  )}

                  {step.result && (
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4 bg-white p-5 md:p-6 xl:p-8 rounded-[32px] border-2 border-blue-100 shadow-xl">
                        <Trophy className="text-yellow-400" size={48} />
                        <div className="text-center">
                          <span className="block text-4xl font-black text-blue-600">{step.result.value}</span>
                          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{step.result.unit}</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-400 italic text-center max-w-xs">
                        The calculated average value for each entity.
                      </p>
                    </div>
                  )}
                </div>
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
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
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
        className="mt-6 xl:mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Station
      </button>
    </div>
  );
}
