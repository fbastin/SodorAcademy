import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, CheckCircle2, XCircle, Search, Trophy, Volume2 } from 'lucide-react';
import { Grade } from '../types';
import { speak } from '../services/speechService';

interface LCMExerciseProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

interface LCMProblem {
  n1: number;
  n2: number;
  lcm: number;
  options: number[];
}

export default function LCMExercise({ grade, questionsCount = 10, onComplete, onCancel }: LCMExerciseProps) {
  const [problem, setProblem] = useState<LCMProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const getGCD = (a: number, b: number): number => {
    return b === 0 ? a : getGCD(b, a % b);
  };

  const getLCM = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / getGCD(a, b);
  };

  const generateProblem = () => {
    // Range based on grade
    const minVal = 2;
    const maxVal = grade === 'Primary' ? 8 : 12;
    
    let n1 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    let n2 = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    
    // Ensure they aren't always the same or too simple
    if (n1 === n2 && Math.random() > 0.3) {
       n2 = n1 + 1;
    }

    const correctLCM = getLCM(n1, n2);
    
    // Generate distractors
    const options = new Set<number>();
    options.add(correctLCM);
    
    while (options.size < 4) {
      const distType = Math.floor(Math.random() * 3);
      let distractor = 0;
      
      if (distType === 0) {
        distractor = n1 * n2; // Common multiple but not necessarily least
      } else if (distType === 1) {
        distractor = correctLCM + Math.min(n1, n2);
      } else {
        distractor = Math.max(n1, n2) * (Math.floor(Math.random() * 3) + 2);
      }
      
      if (distractor > 0 && distractor !== correctLCM) {
        options.add(distractor);
      }
    }

    setProblem({
      n1, n2,
      lcm: correctLCM,
      options: Array.from(options).sort((a, b) => a - b)
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    const correct = answer === problem?.lcm;
    setIsCorrect(correct);
    
    if (correct) {
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);
      const newProgress = Math.min((newQuestionsAnswered / questionsCount) * 100, 100);
      setProgress(newProgress);
      
      if (newQuestionsAnswered >= questionsCount) {
        setTimeout(() => onComplete('engine'), 1500);
      }
    }
  };

  if (!problem) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-indigo-600"
          />
        </div>

        <div className="mb-10 flex justify-between items-center">
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
            LCM Challenge {questionsAnswered + 1} of {questionsCount}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => speak("Thomas stops every " + problem.n1 + " stations, and Percy stops every " + problem.n2 + " stations. At which station will they both stop first?")}
              className="p-2 bg-slate-100 hover:bg-indigo-600/10 text-slate-400 hover:text-indigo-600 rounded-full transition-colors mr-2"
              title="Listen to question"
            >
              <Volume2 size={18} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              <Trophy size={16} className="text-indigo-600" />
              <span className="text-xs font-black text-indigo-600 uppercase">Mastery in Progress</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-lg shadow-indigo-100">
            <Search size={40} />
          </div>
          <h2 className={`text-3xl font-black mb-4 ${grade === 'Primary' ? 'text-sodor-blue' : 'text-indigo-700'}`}>
            Find the Smallest Common Multiplier
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Thomas stops every <span className="font-black text-slate-900">{problem.n1}</span> stations, 
            and Percy stops every <span className="font-black text-slate-900">{problem.n2}</span> stations. 
            At which station will they both stop first?
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] border-2 border-slate-100 flex items-center justify-center text-5xl font-black text-slate-800 shadow-inner">
              {problem.n1}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Number 1</span>
          </div>
          
          <div className="text-4xl font-black text-indigo-200">&</div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] border-2 border-slate-100 flex items-center justify-center text-5xl font-black text-slate-800 shadow-inner">
              {problem.n2}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Number 2</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {problem.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                p-6 rounded-2xl text-2xl font-black border-4 transition-all
                ${selectedAnswer === option 
                  ? (option === problem.lcm ? 'bg-green-50 border-green-500 text-green-700 scale-105' : 'bg-red-50 border-red-500 text-red-700')
                  : (selectedAnswer !== null && option === problem.lcm ? 'border-green-500 bg-green-50' : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-200')
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              {isCorrect ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600 font-black text-xl">
                    <CheckCircle2 size={24} /> Really Useful Work!
                  </div>
                  {questionsAnswered < questionsCount && (
                    <button
                      onClick={generateProblem}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                    >
                      Next Challenge <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-red-600 font-black text-xl">
                    <XCircle size={24} /> Cinders and ashes!
                  </div>
                  <p className="text-slate-500 font-medium">The Smallest Common Multiplier is {problem.lcm}.</p>
                  <button 
                    onClick={generateProblem}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                  >
                    Try Another One <RotateCcw size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={onCancel}
        className="mt-8 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Roundhouse
      </button>
    </div>
  );
}
