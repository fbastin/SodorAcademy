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
    title: "What is a Force?",
    content: "A force is a push or a pull! When Thomas pulls his coaches, or Gordon pushes his trucks, they are using force to move them. Forces can make things speed up, slow down, or even change direction!",
    image: "🚂",
    type: "intro"
  },
  {
    title: "Newton's Second Law",
    content: "Force (F) = Mass (m) × Acceleration (a). This is the 'Big Idea' of motion! It means the harder you push, the faster you go. But if the load is heavier (more mass), you need even more force to get it moving!",
    image: "https://www.slashbin.net/Physics-for-kids/2nd%20Newton%20Law/2nd%20Newton%20Law%20Thomas.png",
    type: "image"
  },
  {
    title: "Understanding Gravity",
    content: "Gravity is a special pulling force! Every object pulls on every other object. The Earth is so big that its gravity pulls everything toward its center. That's what keeps the engines' wheels firmly on the tracks!",
    image: "🌍",
    type: "gravity"
  },
  {
    title: "The Great Discovery",
    content: "Did you know? On Earth, heavy things and light things fall at the same speed! Even though gravity pulls harder on heavy things, they are also harder to move. These two things cancel out perfectly!",
    image: "⚖️",
    type: "discovery"
  },
  {
    title: "Gravity on Other Worlds",
    content: "Gravity depends on mass. On the Moon, which is smaller than Earth, you would feel very light and fall slowly. On Jupiter, the biggest planet, you would feel very heavy and fall very fast!",
    image: "🌕",
    type: "planets"
  },
  {
    title: "Extra Exploration",
    content: "Ready to see gravity in action? Check out these amazing resources from the Science Station to learn even more about forces!",
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
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[650px]">
        {/* Header */}
        <div className="bg-green-600 p-8 text-white flex items-center justify-between">
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
                <div className="bg-slate-50 w-24 h-24 rounded-[32px] flex items-center justify-center shadow-inner shrink-0 overflow-hidden text-6xl">
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
                <p className="text-xl leading-relaxed text-slate-700 font-medium mb-12">
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
        className="mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Station
      </button>
    </div>
  );
}
