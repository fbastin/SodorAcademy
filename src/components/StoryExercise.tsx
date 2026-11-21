import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, Check, RotateCcw, Shuffle, Volume2, X } from 'lucide-react';
import { Story, Grade } from '../types';
import { STORIES } from '../services/storyData';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import { TrainTrack } from '../views/QuizView';
import { Engine } from './ui';
import { answerClass, pickRight } from './ExerciseFrame';

// The story adventures of the English station: read a story, then answer questions
// about it. With at least 80 % right answers the story goes to the Library: the
// exercise then calls onComplete with the story's id ('story-<n>'), which App
// stores in completedStories. The stories and their questions are English reading
// practice and stay in English (lang="en"); only the interface around them follows
// the chosen language.

interface Props {
  grade: Grade;
  completedStories: string[];
  questionsCount?: number;
  onComplete: (storyId: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

// A story not read yet, if any is left; never the one just shown.
function pickStory(completed: string[], not?: string): Story {
  const fresh = STORIES.filter(s => !completed.includes(s.id) && s.id !== not);
  const pool = fresh.length ? fresh : STORIES.filter(s => s.id !== not);
  return pool[Math.floor(Math.random() * pool.length)] || STORIES[0];
}

export default function StoryExercise({ completedStories, questionsCount = 10, onComplete, onCancel, color = '#e23b2e', place }: Props) {
  const { lang, t, tr } = useLang();
  const [story, setStory] = useState<Story>(() => pickStory(completedStories));
  const [view, setView] = useState<'reading' | 'questions' | 'retry'>('reading');
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [cheer, setCheer] = useState('');
  const [score, setScore] = useState(0);

  const count = Math.min(questionsCount, story.questions.length);
  const passMark = Math.ceil(count * 0.8);
  const q = story.questions[idx];
  const ok = picked !== null && picked === q.correctAnswer;
  const last = idx >= count - 1;
  const already = completedStories.includes(story.id);
  const from = place || tr({ fr: 'Dépôt de Tidmouth', en: 'Tidmouth Sheds' });

  // "1 bonne réponse", "3 bonnes réponses"; "1 right answer", "3 right answers".
  const rightAnswers = (n: number) => lang === 'fr'
    ? `${n} bonne${n > 1 ? 's' : ''} réponse${n > 1 ? 's' : ''}`
    : `${n} right answer${n === 1 ? '' : 's'}`;

  const reset = (s: Story = story) => {
    window.speechSynthesis?.cancel();
    setStory(s);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setView('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answer = (o: string) => {
    if (picked) return;
    setPicked(o);
    setCheer(pickRight(lang));
    if (o === q.correctAnswer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    window.speechSynthesis?.cancel();
    if (!last) {
      setIdx(i => i + 1);
      setPicked(null);
      return;
    }
    if (score >= passMark) onComplete(story.id);
    else setView('retry');
  };

  const progress = view === 'reading' ? 0 : view === 'retry' ? 100 : ((idx + (picked ? 1 : 0)) / count) * 100;

  return (
    <div className="max-w-3xl mx-auto" lang={lang}>
      <TrainTrack progress={progress} from={from} to={t('library')} color={color} />

      <AnimatePresence mode="wait">
        {view === 'reading' && (
          <motion.section key={`read-${story.id}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            className="card-ink p-5 sm:p-7" style={{ borderTopWidth: 10, borderTopColor: color }}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="label-caps flex items-center gap-1.5"><BookOpen size={15} aria-hidden="true" /> {tr({ fr: 'Une histoire à lire en anglais', en: 'A story to read' })}</span>
              <span className="flex items-center gap-2">
                {already && <span className="chip bg-mint!">{tr({ fr: 'Déjà dans ta bibliothèque', en: 'Already in your Library' })}</span>}
                <button onClick={() => speak(`${story.title}. ${story.content}`, 'en')} className="chunky p-0! w-10 h-10"
                  title={t('read_aloud')} aria-label={t('read_aloud')}>
                  <Volume2 size={18} />
                </button>
              </span>
            </div>

            <h2 className="text-2xl sm:text-[1.9rem] font-extrabold leading-tight mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="w-11 h-11 shrink-0 grid place-items-center rounded-xl border-[2.5px] border-ink bg-sky text-2xl">{story.thumbnail}</span>
              <span lang="en">{story.title}</span>
            </h2>

            <div lang="en" className="rounded-2xl border-[3px] border-ink bg-sky/60 p-4 sm:p-5 text-[1.15rem] sm:text-[1.25rem] leading-relaxed whitespace-pre-wrap">
              {story.content}
            </div>

            <p className="mt-5 mb-0 text-[1.05rem]">
              {tr({
                fr: `Lis l’histoire, puis réponds à ${count} questions. Avec au moins ${passMark} bonnes réponses, elle rejoint ta bibliothèque.`,
                en: `Read the story, then answer ${count} questions. Get at least ${passMark} right and it goes into your Library.`,
              })}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => reset(pickStory(completedStories, story.id))} className="chunky">
                <Shuffle size={16} /> {tr({ fr: 'Une autre histoire', en: 'Another story' })}
              </button>
              <button onClick={() => { window.speechSynthesis?.cancel(); setView('questions'); }} className="chunky go big">
                {tr({ fr: 'J’ai lu l’histoire : aux questions !', en: 'I’ve read it: on to the questions!' })} <ArrowRight size={20} />
              </button>
            </div>
          </motion.section>
        )}

        {view === 'questions' && (
          <motion.section key={`q-${story.id}-${idx}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            className="card-ink p-5 sm:p-7" style={{ borderTopWidth: 10, borderTopColor: color }}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="label-caps">{t('question_of', idx + 1, count)}</span>
              <span className="flex items-center gap-2">
                <span className="chip bg-mint! tabular-nums">{rightAnswers(score)}</span>
                <button onClick={() => speak(q.question, 'en')} className="chunky p-0! w-10 h-10" title={t('listen')} aria-label={t('listen')}>
                  <Volume2 size={18} />
                </button>
              </span>
            </div>

            <h2 lang="en" className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">{q.question}</h2>

            <div lang="en" className={`grid gap-3 ${q.options.every(o => o.length <= 28) ? 'sm:grid-cols-2' : ''}`}>
              {q.options.map(o => {
                const state = !picked ? 'idle' : o === q.correctAnswer ? 'right' : o === picked ? 'picked-wrong' : 'other';
                return (
                  <button key={o} onClick={() => answer(o)} disabled={!!picked} className={`${answerClass(state)} justify-between! text-left!`}>
                    <span>{o}</span>
                    {state === 'right' && <Check size={20} strokeWidth={3} aria-hidden="true" />}
                    {state === 'picked-wrong' && <X size={20} strokeWidth={3} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite">
              {picked && ok && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 font-extrabold text-2xl text-good">{cheer}</p>
                  <button onClick={nextQuestion} className="chunky go big" autoFocus>
                    {last ? tr({ fr: 'Terminer l’aventure', en: 'Finish the adventure' }) : tr({ fr: 'Question suivante', en: 'Next question' })} <ArrowRight size={20} />
                  </button>
                </div>
              )}
              {picked && !ok && (
                <div className="note-paper mt-6">
                  <p className="font-extrabold text-bad text-xl mb-1">{t('wrong_title')}</p>
                  <p className="m-0 text-[1.05rem]">
                    {tr({ fr: 'La bonne réponse était :', en: 'The right answer was:' })} <b lang="en">{q.correctAnswer}</b>
                  </p>
                  <button onClick={nextQuestion} className="chunky mt-4" autoFocus>
                    {last ? tr({ fr: 'Terminer l’aventure', en: 'Finish the adventure' }) : tr({ fr: 'Question suivante', en: 'Next question' })} <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>

            <details className="mt-6 group">
              <summary className="cursor-pointer font-bold text-ink/75 hover:text-ink w-fit">{tr({ fr: 'Relire l’histoire', en: 'Read the story again' })}</summary>
              <div lang="en" className="mt-3 rounded-2xl border-[3px] border-ink bg-sky/60 p-4 text-[1.08rem] leading-relaxed whitespace-pre-wrap">
                {story.content}
              </div>
            </details>
          </motion.section>
        )}

        {view === 'retry' && (
          <motion.section key="retry" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            className="card-ink p-6 sm:p-8 text-center" style={{ borderTopWidth: 10, borderTopColor: color }}>
            <Engine size={96} color={color} number="1" className="block mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{tr({ fr: 'Presque !', en: 'Nearly there!' })}</h2>
            <p className="text-[1.1rem] max-w-lg mx-auto mb-6">
              {tr({
                fr: `Tu as ${rightAnswers(score)} sur ${count}. Il en faut au moins ${passMark} pour ranger l’histoire dans ta bibliothèque. Relis-la, puis réessaie !`,
                en: `You got ${rightAnswers(score)} out of ${count}. You need at least ${passMark} to put the story in your Library. Read it again, then have another go!`,
              })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => reset()} className="chunky go big" autoFocus><RotateCcw size={18} /> {tr({ fr: 'Relire l’histoire', en: 'Read the story again' })}</button>
              <button onClick={() => reset(pickStory(completedStories, story.id))} className="chunky"><Shuffle size={16} /> {tr({ fr: 'Une autre histoire', en: 'Another story' })}</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button onClick={onCancel} className="mt-8 mx-auto block font-bold text-ink/65 hover:text-ink">{t('back_station')}</button>
    </div>
  );
}
