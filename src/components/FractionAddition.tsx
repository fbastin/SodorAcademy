import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, XCircle, Volume2 } from 'lucide-react';
import { Grade } from '../types';
import { speak } from '../services/speechService';

interface FractionAdditionProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

interface FractionProblem {
  n1: number;
  d1: number;
  n2: number;
  d2: number;
  correctN: number;
  correctD: number;
  options: string[];
}

export default function FractionAddition({ grade, questionsCount = 10, onComplete, onCancel }: FractionAdditionProps) {
  const [problem, setProblem] = useState<FractionProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const getGCD = (a: number, b: number): number => {
    return b === 0 ? a : getGCD(b, a % b);
  };

  const generateProblem = () => {
    const maxVal = grade === 'Primary' ? 5 : 8;
    let n1, d1, n2, d2;

    if (grade === 'Primary' && Math.random() > 0.4) {
      // Same denominators for primary school sometimes
      d1 = Math.floor(Math.random() * maxVal) + 2;
      d2 = d1;
      n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    } else {
      n1 = Math.floor(Math.random() * maxVal) + 1;
      d1 = Math.floor(Math.random() * maxVal) + 2;
      n2 = Math.floor(Math.random() * maxVal) + 1;
      d2 = Math.floor(Math.random() * maxVal) + 2;
    }

    const finalN = (n1 * d2) + (n2 * d1);
    const finalD = d1 * d2;
    const common = getGCD(finalN, finalD);
    const simplifiedN = finalN / common;
    const simplifiedD = finalD / common;

    const correctAns = `${simplifiedN}/${simplifiedD}`;
    
    // Generate some distractor answers
    const options = new Set<string>();
    options.add(correctAns);
    
    while (options.size < 4) {
      const dn = Math.max(1, simplifiedN + Math.floor(Math.random() * 5) - 2);
      const dd = Math.max(2, simplifiedD + Math.floor(Math.random() * 5) - 2);
      const distractor = `${dn}/${dd}`;
      if (distractor !== correctAns) options.add(distractor);
    }

    setProblem({
      n1, d1, n2, d2,
      correctN: simplifiedN,
      correctD: simplifiedD,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = answer === `${problem?.correctN}/${problem?.correctD}`;
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
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Progress Track */}
      <div className="mb-8 relative">
        <div className="h-3 w-full bg-slate-200 rounded-full train-track overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-sodor-blue"
          />
        </div>
        <motion.div 
          animate={{ left: `${progress}%` }}
          className="absolute -top-5 -ml-3 text-sodor-blue transition-all"
        >
          <Train size={24} />
        </motion.div>
        <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>Tidmouth Sheds</span>
          <span>Knapford Station</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={progress}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="engine-glass rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/20"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-sodor-blue" />
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-sodor-blue/10 text-sodor-blue text-[10px] font-bold uppercase tracking-wider">
              Mathematics • Fraction Addition
            </span>
            <button 
              onClick={() => speak("Percy is collecting mail loads. Help him add these fractions: " + problem.n1 + " over " + problem.d1 + " plus " + problem.n2 + " over " + problem.d2)}
              className="p-2 bg-slate-100 hover:bg-sodor-blue/10 text-slate-400 hover:text-sodor-blue rounded-full transition-colors"
              title="Listen to question"
            >
              <Volume2 size={16} />
            </button>
          </div>
          
          <h2 className="text-xl font-extrabold mb-6 leading-tight text-slate-900">
            Percy is collecting mail loads. Help him add these fractions:
          </h2>

          <div className={`flex items-center justify-center gap-4 md:gap-6 mb-8 text-3xl font-black ${grade === 'Primary' ? 'text-sodor-blue' : 'text-indigo-700'}`}>
            <div className="flex flex-col items-center">
              <span className="border-b-4 border-slate-800 px-1.5">{problem.n1}</span>
              <span>{problem.d1}</span>
            </div>
            <span className="text-sodor-blue">+</span>
            <div className="flex flex-col items-center">
              <span className="border-b-4 border-slate-800 px-1.5">{problem.n2}</span>
              <span>{problem.d2}</span>
            </div>
            <span className="text-slate-400">=</span>
            <div className="w-14 h-16 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-slate-300 text-2xl">?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {problem.options.map((option, idx) => {
              const [on, od] = option.split('/');
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`
                    p-4 md:p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-1 relative
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : (selectedAnswer && option === `${problem?.correctN}/${problem?.correctD}` ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-700 hover:border-sodor-blue hover:shadow-lg')
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-xl md:text-2xl font-black">
                    <span className="border-b-2 border-current px-2">{on}</span>
                    <span>{od}</span>
                  </div>
                  {(selectedAnswer === option || (selectedAnswer && option === `${problem?.correctN}/${problem?.correctD}`)) && (
                    <span className="text-lg absolute top-1 right-1">
                      {option === `${problem?.correctN}/${problem?.correctD}` ? '🚂' : '❌'}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {isCorrect === false && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <XCircle size={18} />
                <span>Cinders and Ashes!</span>
              </div>
              <p className="text-slate-600 text-xs">
                To add fractions, find a common denominator (bottom number). Then add the numerators (top numbers) together. Finally, simplify your answer!
              </p>
              <button 
                onClick={generateProblem}
                className="mt-2 w-full py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Try another load
              </button>
            </motion.div>
          )}

          {isCorrect === true && progress < 100 && (
             <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={generateProblem}
              className="mt-6 w-full py-3 bg-sodor-blue text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
             >
               Next Station <ArrowRight size={18} />
             </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={onCancel}
        className="mt-6 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
      >
        Return to Roundhouse
      </button>
    </div>
  );
}
