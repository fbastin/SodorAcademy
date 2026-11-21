import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw, Volume2 } from 'lucide-react';
import { useLang } from '../i18n';
import { TrainTrack } from '../views/QuizView';

// The frame shared by the exercises of Sodor Academy: the train on its rails, one
// right answer per step; the card of the question; then "well done" or, after a
// mistake, the explanation on a yellow note. An exercise only draws its question
// and its answers (see FractionMultiplication.tsx).

export type Feedback = null | { ok: true; text?: string } | { ok: false; title?: string; explain: React.ReactNode };

const S = {
  en: { listen: 'Listen', next: 'Next station', another: 'Try another one', right: ['Well done!', 'Spot on!', 'Brilliant!', 'Full steam ahead!'], wrong: 'Cinders and ashes!', back: '← Back to the station', from: 'Sheds' },
  fr: { listen: 'Écouter', next: 'Gare suivante', another: 'Une autre question', right: ['Bravo !', 'Tout juste !', 'Excellent !', 'En avant toute !'], wrong: 'Escarbilles et cendres !', back: '← Retour à la gare', from: 'Dépôt' },
};

export const pickRight = (lang: 'fr' | 'en') => S[lang].right[Math.floor(Math.random() * S[lang].right.length)];

export default function ExerciseFrame({ color = '#2464d6', place, label, answered, total, questionKey, onListen, feedback, onNext, onBack, children }: {
  color?: string;
  place: string;                  // the station the train is heading for
  label: string;                  // a short line above the question
  answered: number;
  total: number;
  questionKey: string | number;   // changes with each question, for the animation
  onListen?: () => void;
  feedback: Feedback;
  onNext: () => void;             // the next question (after a right or a wrong answer)
  onBack: () => void;
  children: React.ReactNode;
}) {
  const { lang, t } = useLang();
  const s = S[lang];
  const finished = answered >= total;

  return (
    <div className="max-w-3xl mx-auto">
      <TrainTrack progress={(answered / total) * 100} from={s.from} to={place} color={color} />

      <AnimatePresence mode="wait">
        <motion.section key={questionKey} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
          className="card-ink p-5 sm:p-7" style={{ borderTopWidth: 10, borderTopColor: color }}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="label-caps">{label}</span>
            <span className="flex items-center gap-2">
              <span className="label-caps">{t('question_of', Math.min(answered + (feedback?.ok ? 0 : 1), total), total)}</span>
              {onListen && (
                <button onClick={onListen} className="chunky p-0! w-10 h-10" title={s.listen} aria-label={s.listen}><Volume2 size={18} /></button>
              )}
            </span>
          </div>

          {children}

          <div aria-live="polite">
            {feedback?.ok === true && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 font-extrabold text-2xl text-good">{feedback.text || pickRight(lang)}</p>
                {!finished && <button onClick={onNext} className="chunky go big" autoFocus>{s.next} <ArrowRight size={20} /></button>}
              </div>
            )}
            {feedback?.ok === false && (
              <div className="note-paper mt-6">
                <p className="font-extrabold text-bad text-xl mb-1">{feedback.title || s.wrong}</p>
                <div className="text-[1.05rem]">{feedback.explain}</div>
                <button onClick={onNext} className="chunky mt-4" autoFocus><RotateCcw size={16} /> {s.another}</button>
              </div>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      <button onClick={onBack} className="mt-8 mx-auto block font-bold text-ink/65 hover:text-ink">{s.back}</button>
    </div>
  );
}

// A fraction written as at school: the numerator over the denominator.
export function Frac({ n, d, className = '' }: { n: React.ReactNode; d: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-[1.1] align-middle font-extrabold tabular-nums ${className}`}>
      <span className="px-1.5 border-b-[3.5px] border-current">{n}</span>
      <span className="px-1.5">{d}</span>
    </span>
  );
}

// The look of an answer button: neutral, then green for the right answer and pink for a wrong pick.
export function answerClass(state: 'idle' | 'right' | 'picked-wrong' | 'other') {
  const base = 'chunky big w-full disabled:opacity-100! disabled:cursor-default';
  if (state === 'right') return `${base} bg-mint!`;
  if (state === 'picked-wrong') return `${base} bg-rose!`;
  return base;
}
