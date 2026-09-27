import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, CheckCircle2, XCircle, Calculator, Trophy, Volume2, ListPlus } from 'lucide-react';
import { Grade } from '../types';
import { speak } from '../services/speechService';

interface ArithmeticMeanMasteryProps {
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

export default function ArithmeticMeanMastery({ grade, questionsCount = 10, onComplete, onCancel }: ArithmeticMeanMasteryProps) {
  const [problem, setProblem] = useState<MeanProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateProblem = () => {
    // Variable number of numbers: 4 to 8
    const count = Math.floor(Math.random() * 5) + 4; 
    
    // Choose a target mean that is an integer for simplicity in this exercise
    const targetMean = grade === 'Primary' 
      ? Math.floor(Math.random() * 6) + 4  // Mean 4-9
      : Math.floor(Math.random() * 12) + 8; // Mean 8-19
    
    let values: number[] = [];
    let currentSum = 0;
    
    // Generate count-1 values
    for (let i = 0; i < count - 1; i++) {
      // Keep values somewhat distributed around the mean
      const variation = Math.floor(Math.random() * (targetMean * 1.5));
      const val = Math.max(1, variation);
      values.push(val);
      currentSum += val;
    }
    
    // Ensure the last value makes the sum perfectly divisible by count
    let lastVal = (targetMean * count) - currentSum;
    
    // If lastVal is non-positive, adjust one of the other values
    if (lastVal <= 0) {
       // Simple fix: just restart generation
       generateProblem();
       return;
    }
    
    values.push(lastVal);
    
    // Generate options
    const options = new Set<number>();
    options.add(targetMean);
    while (options.size < 4) {
      const dist = targetMean + (Math.floor(Math.random() * 9) - 4);
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

  const questionText = `Calculate the arithmetic mean of these ${problem.values.length} numbers: ${problem.values.join(', ')}.`;

  return (
    <div className="max-w-4xl mx-auto py-3 md:py-5 xl:py-12 px-6">
      <div className="bg-white rounded-[28px] xl:rounded-[40px] p-5 md:p-7 xl:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-blue-600"
          />
        </div>

        <div className="mb-5 xl:mb-10 flex justify-between items-center">
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Mastery Challenge {questionsAnswered + 1} of {questionsCount}
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
              <ListPlus size={16} className="text-blue-600" />
              <span className="text-xs font-black text-blue-600 uppercase">Mastery Level</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6 xl:mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-lg shadow-blue-100">
            <Calculator size={40} />
          </div>
          <h2 className={`text-3xl font-black mb-4 ${grade === 'Primary' ? 'text-sodor-blue' : 'text-blue-800'}`}>
            The Big Average Challenge
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Calculate the average of this long list of truck loads. Remember: Sum them all up, then divide by <span className="font-black text-blue-600">{problem.values.length}</span>!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 xl:mb-12">
          {problem.values.map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-xl border-2 border-slate-100 flex items-center justify-center text-2xl font-black text-slate-800 shadow-inner group hover:border-blue-400 transition-colors">
                {v}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {problem.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                p-5 rounded-2xl text-xl font-black border-4 transition-all
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
              className="mt-6 xl:mt-12 text-center"
            >
              {isCorrect ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600 font-black text-xl">
                    <CheckCircle2 size={24} /> Incredible! You found the fair share!
                  </div>
                  {questionsAnswered < questionsCount && (
                    <button
                      onClick={generateProblem}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                    >
                      Next List <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-red-600 font-black text-xl">
                    <XCircle size={24} /> Check your calculations!
                  </div>
                  <p className="text-slate-500 font-medium">
                    The sum was {problem.values.reduce((a,b)=>a+b,0)}. 
                    Divided by {problem.values.length}, the average is {problem.mean}.
                  </p>
                  <button 
                    onClick={generateProblem}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                  >
                    Try Another List <RotateCcw size={20} />
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
        ← Back to the station
      </button>
    </div>
  );
}
