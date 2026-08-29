import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, RotateCcw, ArrowRight, CheckCircle2, XCircle, BookOpen, Trophy, Volume2, MessageSquareText } from 'lucide-react';
import { Grade } from '../types';
import { speak } from '../services/speechService';

interface ArithmeticMeanWordProblemsProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

interface WordProblem {
  text: string;
  mean: number;
  options: number[];
  explanation: string;
}

const TEMPLATES = [
  {
    template: (v: number[]) => `Gordon pulled ${v[0]} trucks on Monday, ${v[1]} on Tuesday, and ${v[2]} on Wednesday. What was the average number of trucks he pulled per day?`,
    explanation: (v: number[], sum: number, mean: number) => `We add the trucks: ${v[0]} + ${v[1]} + ${v[2]} = ${sum}. Then divide by 3 days: ${sum} ÷ 3 = ${mean}.`
  },
  {
    template: (v: number[]) => `Sir Topham Hatt bought 4 new engines. They cost ${v[0]} gold coins, ${v[1]} gold coins, ${v[2]} gold coins, and ${v[3]} gold coins. What was the average cost of an engine?`,
    explanation: (v: number[], sum: number, mean: number) => `Total cost: ${v[0]} + ${v[1]} + ${v[2]} + ${v[3]} = ${sum}. Average for 4 engines: ${sum} ÷ 4 = ${mean}.`
  },
  {
    template: (v: number[]) => `Thomas traveled ${v[0]} miles in the first hour, ${v[1]} miles in the second, and ${v[2]} miles in the third. What was his average speed in miles per hour?`,
    explanation: (v: number[], sum: number, mean: number) => `Total distance: ${v[0]} + ${v[1]} + ${v[2]} = ${sum}. Average over 3 hours: ${sum} ÷ 3 = ${mean}.`
  },
  {
    template: (v: number[]) => `Five coal trucks have weights of ${v[0]}, ${v[1]}, ${v[2]}, ${v[3]}, and ${v[4]} tons. What is the average weight of a coal truck?`,
    explanation: (v: number[], sum: number, mean: number) => `Total weight: ${v.join(' + ')} = ${sum}. Average for 5 trucks: ${sum} ÷ 5 = ${mean}.`
  },
  {
    template: (v: number[]) => `Percy delivered ${v[0]} letters to Ffarquhar, ${v[1]} letters to Elsbridge, and ${v[2]} letters to Knapford. What is the average number of letters per station?`,
    explanation: (v: number[], sum: number, mean: number) => `Total letters: ${v[0]} + ${v[1]} + ${v[2]} = ${sum}. Average for 3 stations: ${sum} ÷ 3 = ${mean}.`
  }
];

export default function ArithmeticMeanWordProblems({ grade, questionsCount = 10, onComplete, onCancel }: ArithmeticMeanWordProblemsProps) {
  const [problem, setProblem] = useState<WordProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateProblem = () => {
    const templateIdx = Math.floor(Math.random() * TEMPLATES.length);
    const template = TEMPLATES[templateIdx];
    
    // Determine number of values based on template
    // Template 0: 3, Template 1: 4, Template 2: 3, Template 3: 5, Template 4: 3
    const counts = [3, 4, 3, 5, 3];
    const count = counts[templateIdx];
    
    const targetMean = grade === 'Primary' 
      ? Math.floor(Math.random() * 8) + 5   // 5-12
      : Math.floor(Math.random() * 20) + 10; // 10-29
      
    let values: number[] = [];
    let sum = 0;
    for (let i = 0; i < count - 1; i++) {
      const v = Math.floor(Math.random() * (targetMean * 1.4)) + 1;
      values.push(v);
      sum += v;
    }
    let lastVal = (targetMean * count) - sum;
    if (lastVal <= 0) {
      generateProblem();
      return;
    }
    values.push(lastVal);
    
    const options = new Set<number>();
    options.add(targetMean);
    while (options.size < 4) {
      const dist = targetMean + (Math.floor(Math.random() * 11) - 5);
      if (dist > 0 && dist !== targetMean) options.add(dist);
    }
    
    setProblem({
      text: template.template(values),
      mean: targetMean,
      options: Array.from(options).sort((a, b) => a - b),
      explanation: template.explanation(values, targetMean * count, targetMean)
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
        setTimeout(() => onComplete('video'), 1500);
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
            className="h-full bg-orange-600"
          />
        </div>

        <div className="mb-10 flex justify-between items-center">
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Average Adventure {questionsAnswered + 1} of {questionsCount}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => speak(problem.text)}
              className="p-2 bg-slate-100 hover:bg-orange-600/10 text-slate-400 hover:text-orange-600 rounded-full transition-colors mr-2"
              title="Listen to problem"
            >
              <Volume2 size={18} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100">
              <MessageSquareText size={16} className="text-orange-600" />
              <span className="text-xs font-black text-orange-600 uppercase">Advanced Logic</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 shadow-lg shadow-orange-100">
            <BookOpen size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-6">
            {problem.text}
          </h2>
          <div className="h-[2px] w-20 bg-orange-200" />
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          {problem.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                p-6 rounded-2xl text-2xl font-black border-4 transition-all text-center
                ${selectedAnswer === option 
                  ? (option === problem.mean ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                  : (selectedAnswer !== null && option === problem.mean ? 'border-green-500 bg-green-50' : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100')
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
              className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-200"
            >
              {isCorrect ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600 font-black text-xl">
                    <CheckCircle2 size={24} /> Brilliant deduction!
                  </div>
                  <p className="text-slate-600 font-medium text-center">
                    {problem.explanation}
                  </p>
                  {questionsAnswered < questionsCount && (
                    <button
                      onClick={generateProblem}
                      className="mt-4 px-10 py-4 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all flex items-center gap-2"
                    >
                      Next Problem <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-red-600 font-black text-xl">
                    <XCircle size={24} /> Cinders and ashes!
                  </div>
                  <p className="text-slate-600 font-medium text-center">
                    {problem.explanation}
                  </p>
                  <button 
                    onClick={generateProblem}
                    className="mt-4 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2"
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
