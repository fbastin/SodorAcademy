import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, CheckCircle2, XCircle, Calculator, Trophy, Volume2 } from 'lucide-react';
import { Grade } from '../types';
import { speak } from '../services/speechService';

interface ArithmeticMeanExerciseProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

interface MeanProblem {
  values: number[];
  mean: number;
  options: number[];
}

export default function ArithmeticMeanExercise({ grade, questionsCount = 10, onComplete, onCancel }: ArithmeticMeanExerciseProps) {
  const [problem, setProblem] = useState<MeanProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateProblem = () => {
    const count = grade === 'Primary' ? 3 : Math.floor(Math.random() * 3) + 3; // 3 for Primary, 3-5 for Secondary
    const targetMean = grade === 'Primary' 
      ? Math.floor(Math.random() * 6) + 3  // Mean between 3 and 8
      : Math.floor(Math.random() * 12) + 6; // Mean between 6 and 17
    
    let values: number[] = [];
    let currentSum = 0;
    
    // Generate c-1 values that are somewhat close to the mean but allow variation
    for (let i = 0; i < count - 1; i++) {
      // Pick a value between 1 and targetMean * 1.2 to keep the sum manageable
      const val = Math.floor(Math.random() * (targetMean - 1)) + 1;
      values.push(val);
      currentSum += val;
    }
    
    let lastVal = (targetMean * count) - currentSum;
    values.push(lastVal);
    
    const options = new Set<number>();
    options.add(targetMean);
    while (options.size < 4) {
      const dist = targetMean + (Math.floor(Math.random() * 7) - 3);
      if (dist > 0 && dist !== targetMean) options.add(dist);
    }
    
    setProblem({
      values: values.sort(() => Math.random() - 0.5),
      mean: targetMean,
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
    const correct = answer === problem?.mean;
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

  const questionText = `Find the arithmetic mean (average) of these ${problem.values.length} engine loads: ${problem.values.join(', ')}.`;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-blue-600"
          />
        </div>

        <div className="mb-10 flex justify-between items-center">
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Mean Challenge {questionsAnswered + 1} of {questionsCount}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => speak(questionText)}
              className="p-2 bg-slate-100 hover:bg-blue-600/10 text-slate-400 hover:text-blue-600 rounded-full transition-colors mr-2"
              title="Listen to question"
            >
              <Volume2 size={18} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
              <Trophy size={16} className="text-blue-600" />
              <span className="text-xs font-black text-blue-600 uppercase">Average Expert</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-lg shadow-blue-100">
            <Calculator size={40} />
          </div>
          <h2 className={`text-3xl font-black mb-4 ${grade === 'Primary' ? 'text-sodor-blue' : 'text-blue-800'}`}>
            Calculate the Average
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Several engines are pulling different numbers of trucks. If they shared them equally, how many would each have?
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          {problem.values.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-3xl font-black text-slate-800 shadow-inner">
                {v}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Load {i + 1}</span>
            </div>
          ))}
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
                  ? (option === problem.mean ? 'bg-green-50 border-green-500 text-green-700 scale-105' : 'bg-red-50 border-red-500 text-red-700')
                  : (selectedAnswer !== null && option === problem.mean ? 'border-green-500 bg-green-50' : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-200')
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
                    <CheckCircle2 size={24} /> Really Useful Calculation!
                  </div>
                  {questionsAnswered < questionsCount && (
                    <button
                      onClick={generateProblem}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                    >
                      Next Station <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-red-600 font-black text-xl">
                    <XCircle size={24} /> Cinders and ashes!
                  </div>
                  <p className="text-slate-500 font-medium">The average is {problem.mean}. (Sum: {problem.values.reduce((a,b)=>a+b,0)} ÷ {problem.values.length})</p>
                  <button 
                    onClick={generateProblem}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                  >
                    Try Another Track <RotateCcw size={20} />
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
