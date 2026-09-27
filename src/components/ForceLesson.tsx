import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, PlayCircle, ExternalLink, FileText, Volume2, X } from 'lucide-react';
import { speak } from '../services/speechService';

interface ForceLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "Definition of Force",
    content: "A force is an interaction that, when unopposed, alters the motion of an object. It can cause an object with mass to change its velocity, acceleration, or direction.",
    image: "🚂",
    type: "intro"
  },
  {
    title: "Newton's Second Law",
    content: "Newton's Second Law of Motion states that force (F) equals mass (m) multiplied by acceleration (a) ($F = ma$). Consequently, greater mass requires proportional force to achieve the same acceleration.",
    image: "https://www.slashbin.net/Physics-for-kids/2nd%20Newton%20Law/2nd%20Newton%20Law%20Thomas.png",
    type: "image"
  },
  {
    title: "Gravitational Interaction",
    content: "Gravity is a fundamental attractive force acting between all bodies with mass. Earth's gravity accelerates objects toward its center, stabilizing structures and objects on its surface.",
    image: "🌍",
    type: "gravity"
  },
  {
    title: "Equivalence Principle",
    content: "In a vacuum, all objects undergo identical gravitational acceleration regardless of mass. The greater gravitational force on a more massive object is offset by its greater inertia.",
    image: "⚖️",
    type: "discovery"
  },
  {
    title: "Varying Gravitational Fields",
    content: "Gravitational force depends on the mass and radius of the celestial body. Gravitational acceleration is weaker on the Moon and significantly stronger on Jupiter compared to Earth.",
    image: "🌕",
    type: "planets"
  },
  {
    title: "Reference Resources",
    content: "Consult these scientific resources to further examine the physical properties of force and gravity.",
    links: [
      { name: "Gravity Lab", url: "https://www.slashbin.net/Physics-for-kids/2nd%20Newton%20Law/ground-gravity-lab.html", icon: PlayCircle },
      { name: "Gravity Lesson", url: "https://www.slashbin.net/Physics-for-kids/2nd%20Newton%20Law/gravity-lesson.html", icon: BookOpen },
      { name: "Lesson PDF", url: "https://www.slashbin.net/Physics-for-kids/2nd%20Newton%20Law/gravity-lesson.pdf", icon: FileText }
    ],
    type: "links"
  }
];

export default function ForceLesson({ onCancel, onStartExercise }: ForceLessonProps) {
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
        <div className="bg-green-600 p-5 md:p-6 xl:p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Science Station</h2>
              <p className="text-green-100 text-sm font-bold">Topic: Forces & Gravity with Thomas</p>
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
              className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-green-500' : 'bg-transparent'}`}
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
                  {step.image && step.image.startsWith('http') ? (
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>{step.image}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-green-600 font-black text-xs uppercase tracking-widest block">Step {currentStep + 1} of {STEPS.length}</span>
                    <button 
                      onClick={() => speak(step.title + ". " + step.content)}
                      className="p-2 bg-slate-100 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded-full transition-colors"
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

                {step.type === 'links' && (
                  <div className="grid gap-4 max-w-md">
                    {step.links?.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-green-50 hover:border-green-200 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-green-600 transition-colors">
                            <link.icon size={20} />
                          </div>
                          <span className="font-bold text-slate-700">{link.name}</span>
                        </div>
                        <ExternalLink size={18} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
                
                {step.type === 'image' && step.image && step.image.startsWith('http') && (
                    <div className="rounded-3xl overflow-hidden border-4 border-slate-100 shadow-lg mb-8 bg-white">
                        <img src={step.image} alt="Newton's Law" className="w-full h-auto max-h-[300px] object-contain" />
                    </div>
                )}
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
                    className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-green-200 hover:bg-green-700 transition-all hover:scale-105 active:scale-95"
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
