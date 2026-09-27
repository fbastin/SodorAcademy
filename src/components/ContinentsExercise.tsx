import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Train, RotateCcw, ArrowRight, XCircle, Volume2, Trophy } from 'lucide-react';
import { Grade } from '../types';
import { speak } from '../services/speechService';

interface ContinentsExerciseProps {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}

interface ContinentQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

const ALL_QUESTIONS: ContinentQuestion[] = [
  {
    id: 1,
    text: "Which continent is the largest in the world?",
    options: ["Africa", "Asia", "Europe", "North America"],
    correctAnswer: "Asia",
    hint: "It has the highest mountains, like Mount Everest!"
  },
  {
    id: 2,
    text: "In which continent is the Amazon Rainforest located?",
    options: ["Africa", "South America", "Australia", "Asia"],
    correctAnswer: "South America",
    hint: "This continent also has the long Andes mountains."
  },
  {
    id: 3,
    text: "Which continent is also a country?",
    options: ["Antarctica", "Australia", "Europe", "Africa"],
    correctAnswer: "Australia",
    hint: "It's often called 'The Land Down Under'."
  },
  {
    id: 4,
    text: "Which is the coldest continent, covered in ice?",
    options: ["Europe", "North America", "Antarctica", "Asia"],
    correctAnswer: "Antarctica",
    hint: "You'll find more penguins than people there!"
  },
  {
    id: 5,
    text: "Which continent is famous for lions, elephants, and giraffes?",
    options: ["Africa", "South America", "Australia", "Europe"],
    correctAnswer: "Africa",
    hint: "It is the second-largest continent in the world."
  },
  {
    id: 6,
    text: "The Island of Sodor and Great Britain are part of which continent?",
    options: ["North America", "Europe", "Asia", "Africa"],
    correctAnswer: "Europe",
    hint: "It's known for its many countries and great history."
  },
  {
    id: 7,
    text: "Which continent are Canada and the USA located in?",
    options: ["South America", "Europe", "North America", "Australia"],
    correctAnswer: "North America",
    hint: "It's where many of Thomas's friends work on big railways!"
  },
  {
    id: 8,
    text: "How many continents are there in total?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    hint: "Count them: Asia, Africa, North America, South America, Antarctica, Europe, Australia."
  },
  {
    id: 9,
    text: "Which continent is the smallest by land area?",
    options: ["Europe", "Australia", "Antarctica", "South America"],
    correctAnswer: "Australia",
    hint: "It's the island continent!"
  },
  {
    id: 10,
    text: "Which continent has the Sahara Desert?",
    options: ["Asia", "Africa", "Australia", "North America"],
    correctAnswer: "Africa",
    hint: "It's a very big, hot continent!"
  }
];

export default function ContinentsExercise({ grade, questionsCount = 5, onComplete, onCancel }: ContinentsExerciseProps) {
  const [currentQuestions, setCurrentQuestions] = useState<ContinentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled.slice(0, questionsCount));
  }, [questionsCount]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = answer === currentQuestions[currentIndex].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < currentQuestions.length) {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setProgress((nextIdx / currentQuestions.length) * 100);
    } else {
      setProgress(100);
      setTimeout(() => onComplete('engine'), 1000);
    }
  };

  if (currentQuestions.length === 0) return null;

  const currentQuestion = currentQuestions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Progress Track */}
      <div className="mb-8 relative">
        <div className="h-3 w-full bg-slate-200 rounded-full train-track overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-orange-500"
          />
        </div>
        <motion.div 
          animate={{ left: `${progress}%` }}
          className="absolute -top-5 -ml-3 text-orange-600 transition-all"
        >
          <Train size={24} />
        </motion.div>
        <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>Start Voyage</span>
          <span>World Explorer</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="engine-glass rounded-2xl p-5 md:p-6 xl:p-8 shadow-2xl relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/20"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-wider">
              Geography • Continents Challenge
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => speak(currentQuestion.text)}
                className="p-2 bg-slate-100 hover:bg-orange-500/10 text-slate-400 hover:text-orange-600 rounded-full transition-colors"
                title="Listen to question"
              >
                <Volume2 size={16} />
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                <Trophy size={14} className="text-orange-600" />
                <span className="text-[10px] font-black text-orange-600 uppercase">Score: {score}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-extrabold mb-6 leading-tight text-slate-900">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`
                  p-4 md:p-6 rounded-xl border-2 transition-all flex items-center justify-between text-left
                  ${selectedAnswer === option 
                    ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                    : (selectedAnswer && option === currentQuestion.correctAnswer ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-700 hover:border-orange-500 hover:shadow-lg')
                  }
                `}
              >
                <span className="font-bold text-lg">{option}</span>
                {(selectedAnswer === option || (selectedAnswer && option === currentQuestion.correctAnswer)) && (
                  <span className="text-lg">
                    {option === currentQuestion.correctAnswer ? '🌍' : '❌'}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {selectedAnswer && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              {!isCorrect && (
                <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    <XCircle size={18} />
                    <span>Cinders and Ashes!</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    {currentQuestion.hint}
                  </p>
                </div>
              )}
              
              <button 
                onClick={nextQuestion}
                className={`w-full py-4 rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2 ${isCorrect ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {currentIndex < currentQuestions.length - 1 ? 'Next Stop' : 'Finish Journey'} <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={onCancel}
        className="mt-8 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm uppercase tracking-widest"
      >
        ← Back to the station
      </button>
    </div>
  );
}
