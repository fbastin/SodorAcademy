import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, BookOpen, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Story, StoryQuestion, Grade } from '../types';
import { STORIES } from '../services/storyData';

interface StoryExerciseProps {
  grade: Grade;
  completedStories: string[];
  questionsCount?: number;
  onComplete: (storyId: string) => void;
  onCancel: () => void;
}

export default function StoryExercise({ grade, completedStories, questionsCount = 10, onComplete, onCancel }: StoryExerciseProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [view, setView] = useState<'reading' | 'questions'>('reading');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  // Determine actual number of questions to ask
  const actualQuestionsCount = Math.min(questionsCount, story?.questions.length || 10);

  useEffect(() => {
    // Pick a random story that hasn't been completed yet
    const availableStories = STORIES.filter(s => !completedStories.includes(s.id));
    if (availableStories.length > 0) {
      const randomStory = availableStories[Math.floor(Math.random() * availableStories.length)];
      setStory(randomStory);
    } else {
      // If all stories are done, pick any for practice or show a message
      const randomStory = STORIES[Math.floor(Math.random() * STORIES.length)];
      setStory(randomStory);
    }
  }, [completedStories]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = answer === story?.questions[currentQuestionIdx].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < actualQuestionsCount - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Completed all requested questions
      const passMark = Math.ceil(actualQuestionsCount * 0.8);
      if (score >= passMark && story) { // Require 80% to pass
        onComplete(story.id);
      } else {
        // Reset or show failure
        setCurrentQuestionIdx(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setView('reading');
      }
    }
  };

  if (!story) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <AnimatePresence mode="wait">
        {view === 'reading' ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-4xl">
                {story.thumbnail}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">{story.title}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Tidmouth Story Adventure</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-xl leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                {story.content}
              </p>
            </div>

            <button
              onClick={() => setView('questions')}
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-3"
            >
              I'm Ready for Questions! <ArrowRight size={24} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="questions"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestionIdx / actualQuestionsCount) * 100}%` }}
                className="h-full bg-red-600"
              />
            </div>

            <div className="mb-10 flex justify-between items-center">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Question {currentQuestionIdx + 1} of {actualQuestionsCount}
              </span>
              <span className="text-sm font-black text-green-600 uppercase tracking-widest">
                Score: {score}
              </span>
            </div>

            <h3 className={`text-2xl font-black mb-8 ${grade === 'Primary' ? 'text-sodor-blue' : 'text-indigo-700'}`}>
              {story.questions[currentQuestionIdx].question}
            </h3>

            <div className="grid gap-4 mb-10">
              {story.questions[currentQuestionIdx].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`
                    p-6 rounded-2xl text-left font-bold text-lg border-2 transition-all flex items-center justify-between
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : (selectedAnswer && option === story.questions[currentQuestionIdx].correctAnswer ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-200')
                    }
                  `}
                >
                  {option}
                  {(selectedAnswer === option || (selectedAnswer && option === story.questions[currentQuestionIdx].correctAnswer)) && (
                    <span>{option === story.questions[currentQuestionIdx].correctAnswer ? '🚂' : '❌'}</span>
                  )}
                </button>
              ))}
            </div>

            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {!isCorrect && (
                   <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 text-red-700 font-bold text-sm">
                     Cinders and ashes! The correct answer was: {story.questions[currentQuestionIdx].correctAnswer}
                   </div>
                )}
                <button
                  onClick={nextQuestion}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  {currentQuestionIdx < actualQuestionsCount - 1 ? 'Next Question' : 'Finish Adventure'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onCancel}
        className="mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors"
      >
        Return to Roundhouse
      </button>
    </div>
  );
}
