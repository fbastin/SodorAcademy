import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, XCircle } from 'lucide-react';
import { Grade } from '../types';

interface SimpleFractionAdditionProps {
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

export default function SimpleFractionAddition({ grade, questionsCount = 10, onComplete, onCancel }: SimpleFractionAdditionProps) {
  const [problem, setProblem] = useState<FractionProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const getGCD = (a: number, b: number): number => {
    return b === 0 ? a : getGCD(b, a % b);
  };

  const generateProblem = () => {
    const maxVal = grade === 'Primary' ? 6 : 10;
    
    // Forced same denominators
    const commonD = Math.floor(Math.random() * maxVal) + 2;
    const n1 = Math.floor(Math.random() * (commonD - 1)) + 1;
    const n2 = Math.floor(Math.random() * (commonD - 1)) + 1;

    const finalN = n1 + n2;
    const finalD = commonD;
    
    const common = getGCD(finalN, finalD);
    const simplifiedN = finalN / common;
    const simplifiedD = finalD / common;

    const correctAns = `${simplifiedN}/${simplifiedD}`;
    
    const options = new Set<string>();
    options.add(correctAns);
    
    while (options.size < 4) {
      const dn = Math.max(1, simplifiedN + Math.floor(Math.random() * 10) - 5);
      const dd = Math.max(1, simplifiedD + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0)); 
      const distractor = `${dn}/${dd}`;
      if (distractor !== correctAns) options.add(distractor);
    }

    setProblem({
      n1, d1: commonD, n2, d2: commonD,
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
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-8 relative h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-sodor-blue shadow-[0_0_10px_rgba(30,64,175,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          animate={{ left: `${progress}%` }}
          className="absolute -top-6 -ml-4 text-sodor-blue transition-all"
        >
          <Train size={32} />
        </motion.div>
        <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>Tidmouth Sheds</span>
          <span>Knapford Station</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${problem.n1}/${problem.d1}+${problem.n2}/${problem.d2}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="engine-glass rounded-3xl p-8 shadow-2xl relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/20"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-sodor-blue" />
          <span className="inline-block px-3 py-1 rounded-full bg-sodor-blue/10 text-sodor-blue text-xs font-bold mb-4 uppercase tracking-wider">
            Mathematics • Simple Addition
          </span>
          
          <h2 className="text-2xl font-extrabold mb-8 leading-tight text-slate-900">
            The parts are already the same size! Help Percy add these:
          </h2>

          <div className={`flex items-center justify-center gap-6 mb-12 text-4xl font-black ${grade === 'Primary' ? 'text-sodor-blue' : 'text-indigo-700'}`}>
            <div className="flex flex-col items-center">
              <span className="border-b-4 border-slate-800 px-2">{problem.n1}</span>
              <span>{problem.d1}</span>
            </div>
            <span className="text-sodor-blue">+</span>
            <div className="flex flex-col items-center">
              <span className="border-b-4 border-slate-800 px-2">{problem.n2}</span>
              <span>{problem.d2}</span>
            </div>
            <span className="text-slate-400">=</span>
            <div className="w-16 h-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-slate-300">?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {problem.options.map((option, idx) => {
              const [on, od] = option.split('/');
              const isCorrectOption = option === `${problem.correctN}/${problem.correctD}`;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`
                    p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 relative
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : (selectedAnswer && isCorrectOption ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-700 hover:border-sodor-blue hover:shadow-lg')
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-2xl font-black">
                    <span className="border-b-2 border-current px-2">{on}</span>
                    <span>{od}</span>
                  </div>
                  {(selectedAnswer === option || (selectedAnswer && isCorrectOption)) && (
                    <span className="text-xl absolute top-2 right-2">
                      {isCorrectOption ? '🚂' : '❌'}
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
              className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <XCircle size={20} />
                <span>Cinders and Ashes!</span>
              </div>
              <p className="text-slate-600 text-sm">
                When denominators are the same, just add the top numbers! The bottom number stays as {problem.d1}.
              </p>
              <button 
                onClick={generateProblem}
                className="mt-4 bg-white text-red-600 border-2 border-red-200 px-6 py-2 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center gap-2 self-start"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
            </motion.div>
          )}

          {isCorrect === true && questionsAnswered < questionsCount && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex justify-center"
            >
              <button 
                onClick={generateProblem}
                className="bg-sodor-blue text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-3"
              >
                Next Load! <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={onCancel}
        className="mt-8 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors"
      >
        Return to Roundhouse
      </button>
    </div>
  );
}
