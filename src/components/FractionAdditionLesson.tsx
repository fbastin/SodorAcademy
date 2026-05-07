import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, Plus, X, Search, Settings } from 'lucide-react';

interface FractionAdditionLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "What is a Fraction?",
    content: "A fraction tells us how many parts of a whole we have. Imagine a mail truck that can hold 4 crates. If Percy is carrying 1 crate, he has 1/4 of a full load!",
    image: "📦",
    example: { n: 1, d: 4 }
  },
  {
    title: "The Numerator & Denominator",
    content: "The top number (Numerator) is how many parts we HAVE. The bottom number (Denominator) is how many parts make a WHOLE.",
    image: "🚂",
    example: { n: 3, d: 8 }
  },
  {
    title: "Case 1: Same Denominators",
    content: "When denominators are the same, the parts are already the same size! Just add the Numerators together. The Denominator stays the same because the size of the parts hasn't changed.",
    image: "✉️",
    equation: { n1: 1, d1: 4, n2: 2, d2: 4, rn: 3, rd: 4 }
  },
  {
    title: "Case 2: Different Denominators",
    content: "If the parts are different sizes (like 1/2 and 1/4), we can't add them directly. We must find a way to make the parts the same size first!",
    image: "🛤️",
    equation: { n1: 1, d1: 2, n2: 1, d2: 4, rn: '?', rd: '?' }
  },
  {
    title: "Smallest Common Multiplier",
    content: "To make the denominators the same, we find the Smallest Common Multiplier (LCM). This is the smallest number that both denominators can divide into perfectly.",
    image: "🔍",
    equation: { n1: '1', d1: 2, n2: '1', d2: 4, hint: "For 2 and 4, the smallest multiplier is 4!" }
  },
  {
    title: "Making Parts the Same Size",
    content: "Once we have the LCM, we convert the fractions. Since 4 is our LCM, we turn 1/2 into 2/4. Now both fractions have 4 as the denominator!",
    image: "⚙️",
    equation: { n1: 2, d1: 4, n2: 1, d2: 4, rn: 3, rd: 4, hint: "Now we can just add the numerators!" }
  }
];

export default function FractionAdditionLesson({ onCancel, onStartExercise }: FractionAdditionLessonProps) {
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
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[650px]">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Academy Lesson</h2>
              <p className="text-blue-100 text-sm font-bold">Topic: Adding Fractions with Percy</p>
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
                  <span className="text-blue-600 font-black text-xs uppercase tracking-widest block mb-1">Step {currentStep + 1} of {STEPS.length}</span>
                  <h3 className="text-3xl font-black text-slate-900">{step.title}</h3>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xl leading-relaxed text-slate-700 font-medium mb-12">
                  {step.content}
                </p>

                {/* Example Visualization */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex items-center justify-center min-h-[160px]">
                  {step.example && (
                    <div className="flex flex-col items-center text-5xl font-black text-slate-800">
                      <span className="border-b-4 border-slate-800 px-4">{step.example.n}</span>
                      <span>{step.example.d}</span>
                    </div>
                  )}

                  {step.equation && (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-6 text-5xl font-black text-slate-800">
                        <div className="flex flex-col items-center">
                          <span className="border-b-4 border-slate-800 px-4">{step.equation.n1}</span>
                          <span>{step.equation.d1}</span>
                        </div>
                        <Plus className="text-blue-600" size={40} />
                        <div className="flex flex-col items-center">
                          <span className="border-b-4 border-slate-800 px-4">{step.equation.n2}</span>
                          <span>{step.equation.d2}</span>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div className="flex flex-col items-center text-blue-600">
                          <span className="border-b-4 border-blue-600 px-4">{step.equation.rn}</span>
                          <span>{step.equation.rd}</span>
                        </div>
                      </div>
                      {step.equation.hint && (
                        <p className="mt-6 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                          Hint: {step.equation.hint}
                        </p>
                      )}
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
        className="mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Station
      </button>
    </div>
  );
}
