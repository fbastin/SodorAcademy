import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';
import { Grade } from '../types';

interface FractionIntegerAdditionProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

interface Prob {
  integer: number;
  n: number;
  d: number;
  correctAns: string;
  options: string[];
}

export default function FractionIntegerAddition({ grade, questionsCount = 10, onComplete, onCancel }: FractionIntegerAdditionProps) {
  const [problem, setProblem] = useState<Prob | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateProblem = () => {
    const maxInt = grade === 'Primary' ? 5 : 10;
    const maxDenom = grade === 'Primary' ? 6 : 12;

    const integer = Math.floor(Math.random() * maxInt) + 1;
    const d = Math.floor(Math.random() * (maxDenom - 1)) + 2;
    const n = Math.floor(Math.random() * (d - 1)) + 1;

    // Result is (integer * d + n) / d
    const resN = (integer * d) + n;
    const correctAns = `${resN}/${d}`;

    const options = new Set<string>();
    options.add(correctAns);

    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2;
      const dn = Math.max(1, resN + offset);
      const dist = `${dn}/${d}`;
      if (dist !== correctAns) options.add(dist);
    }

    setProblem({
      integer, n, d,
      correctAns,
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
    const correct = answer === problem?.correctAns;
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
      <div className="mb-6 relative h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-sodor-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
        <motion.div 
          animate={{ left: `${progress}%` }}
          className="absolute -top-5 -ml-3 text-sodor-blue transition-all"
        >
          <Train size={24} />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${problem.integer}+${problem.n}/${problem.d}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="engine-glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden bg-white/90 backdrop-blur-xl border-2 border-white/50"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-sodor-blue" />
          <span className="inline-block px-3 py-1 rounded-full bg-sodor-blue/10 text-sodor-blue text-[10px] font-black mb-4 uppercase tracking-widest">
            Special Assignment • Mixed Loads
          </span>

          <h2 className="text-xl font-black mb-8 text-slate-900 leading-tight">
            Gordon has <span className="text-sodor-blue">{problem.integer}</span> full coal cars and <span className="text-sodor-blue">{problem.n}/{problem.d}</span> of another. How many parts does he have in total?
          </h2>

          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="text-5xl font-black text-slate-800 bg-slate-50 w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100">
              {problem.integer}
            </div>
            <span className="text-3xl font-black text-sodor-blue">+</span>
            <div className={`flex flex-col items-center text-4xl font-black ${grade === 'Primary' ? 'text-sodor-blue' : 'text-indigo-700'}`}>
              <span className="border-b-4 border-slate-800 px-3">{problem.n}</span>
              <span>{problem.d}</span>
            </div>
            <span className="text-2xl font-black text-slate-300">=</span>
            <div className="w-20 h-24 bg-slate-100 rounded-2xl border-4 border-dashed border-slate-200 flex items-center justify-center">
              <span className="text-slate-300 text-3xl">?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {problem.options.map((option, idx) => {
              const [on, od] = option.split('/');
              const isCorrectOption = option === problem.correctAns;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`
                    p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-1 relative
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : (selectedAnswer && isCorrectOption ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-700 hover:border-sodor-blue hover:shadow-xl')
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
              className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-red-100 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-red-700 font-black text-lg">
                <XCircle size={20} />
                <span>Oh, the Indignity!</span>
              </div>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Remember: To add an integer to a fraction, turn the integer into a fraction first! 
                <br/>
                <span className="font-black text-slate-800">{problem.integer}</span> is the same as <span className="font-black text-slate-800">({problem.integer} × {problem.d}) / {problem.d}</span> = <span className="font-black text-slate-800">{(problem.integer * problem.d)} / {problem.d}</span>.
              </p>
              <button 
                onClick={generateProblem}
                className="mt-4 bg-white text-red-600 border-2 border-red-200 px-6 py-2 rounded-xl font-black hover:bg-red-50 transition-all flex items-center gap-2 self-start text-sm"
              >
                <RotateCcw size={18} />
                Try Next Express
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
                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 text-lg"
              >
                Next Station! <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={onCancel}
        className="mt-8 mx-auto block text-slate-400 font-black hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Roundhouse
      </button>
    </div>
  );
}
