import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { Grade, Question } from '../types';
import { generateQuestion } from '../services/questionService';
import { loadFrBank, FrBank } from '../services/frQuestions';
import { frTypo } from '../i18n';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import { Station, Activity } from '../content/stations';
import { Engine, EnOnly } from '../components/ui';

// The progress train: it moves along the rails, one step per right answer.
export function TrainTrack({ progress, from, to, color }: { progress: number; from: string; to: string; color?: string }) {
  return (
    <div className="mb-8" aria-hidden="true">
      <div className="relative h-14">
        <div className="absolute left-0 right-0 bottom-2 h-3 train-track" />
        <div className="absolute left-0 right-0 bottom-[18px] h-[3px] bg-ink rounded" />
        <div className="absolute left-0 right-0 bottom-1 h-[3px] bg-ink rounded" />
        <motion.div className="absolute bottom-[14px] -ml-6" animate={{ left: `${Math.min(progress, 100)}%` }} transition={{ type: 'spring', stiffness: 80, damping: 15 }}>
          <Engine size={52} color={color} number="1" />
        </motion.div>
      </div>
      <div className="flex justify-between mt-1 label-caps">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}

export default function QuizView({ station, activity, grade, questionsCount = 10, onComplete, onCancel }: {
  station: Station;
  activity: Activity;
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}) {
  const { lang, t, tr } = useLang();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [frBank, setFrBank] = useState<FrBank | null>(null);

  useEffect(() => { loadFrBank(station.bank).then(setFrBank); }, [station.bank]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(0);
  const [used, setUsed] = useState<string[]>([]);

  const loadNext = async (exclude: string[]) => {
    setLoading(true);
    setSelected(null);
    setIsCorrect(null);
    try {
      const q = await generateQuestion(station.bank, grade, exclude);
      setQuestion(q);
      setUsed(prev => [...prev, q.id]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { setAnswered(0); setUsed([]); loadNext([]); }, [station.bank, grade]);

  // The question in the chosen language: its French translation when there is one
  // (options found by their position in the bank), otherwise the English bank.
  const fr = lang === 'fr' && question ? frBank?.[question.id] : undefined;
  const qLang = fr ? 'fr' : 'en';
  const shown = question && {
    text: fr ? frTypo(fr.text) : question.text,
    options: question.options.map((o, k) => (fr ? frTypo(fr.options[question.perm?.[k] ?? k] ?? o) : o)),
    explanation: fr ? frTypo(fr.explanation) : question.explanation,
  };
  const rightIndex = question ? question.options.indexOf(question.correctAnswer) : -1;

  const answer = (k: number) => {
    if (selected !== null) return;
    setSelected(k);
    const ok = k === rightIndex;
    setIsCorrect(ok);
    if (ok) {
      const n = answered + 1;
      setAnswered(n);
      if (n >= questionsCount) setTimeout(() => onComplete(question?.rewardType || 'engine'), 1300);
    }
  };

  const progress = (answered / questionsCount) * 100;
  const short = shown ? shown.options.every(o => o.length <= 40) : false;

  return (
    <div className="max-w-3xl mx-auto">
      <TrainTrack progress={progress} from={t('start')} to={tr(station.place)} color={station.color} />

      {loading && !question ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <motion.div animate={{ x: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Engine size={80} color={station.color} />
          </motion.div>
          <p className="text-ink/60 font-semibold">{t('loading')}</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={question?.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="card-ink p-5 sm:p-7 relative overflow-hidden" style={{ borderTopWidth: 10, borderTopColor: station.color }}>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <span className="flex flex-wrap items-center gap-2">
                <span className="label-caps">{t('question_of', Math.min(answered + 1, questionsCount), questionsCount)}</span>
                {frBank && <EnOnly enOnly={qLang === 'en'} />}
              </span>
              <button onClick={() => shown && speak(shown.text, qLang)} className="chunky p-0! w-10 h-10" title={t('listen')} aria-label={t('listen')}>
                <Volume2 size={18} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug" lang={qLang}>{shown?.text}</h2>

            <div className={`grid gap-3 ${short ? 'sm:grid-cols-2' : ''}`} lang={qLang}>
              {shown?.options.map((option, i) => {
                const isPicked = selected === i;
                const isAnswer = selected !== null && i === rightIndex;
                const cls = isAnswer ? 'bg-mint!' : isPicked ? 'bg-rose!' : '';
                return (
                  <button key={i} onClick={() => answer(i)} disabled={selected !== null}
                    className={`chunky big justify-between! text-left! font-bold w-full disabled:opacity-100! disabled:cursor-default ${cls}`}>
                    <span>{option}</span>
                    {isAnswer && <span aria-hidden="true">✓</span>}
                    {isPicked && !isAnswer && <span aria-hidden="true">✗</span>}
                  </button>
                );
              })}
            </div>

            {isCorrect === false && (
              <div className="note-paper mt-6" role="status">
                <p className="font-extrabold text-bad mb-1">{t('wrong_title')}</p>
                <p lang={qLang}>{shown?.explanation}</p>
                <button onClick={() => loadNext(used)} className="chunky mt-3 text-sm"><RotateCcw size={15} /> {t('another')}</button>
              </div>
            )}

            {isCorrect === true && answered < questionsCount && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3" role="status">
                <p className="font-extrabold text-good text-lg m-0">{t('correct')}</p>
                <button onClick={() => loadNext(used)} className="chunky go big">{t('next')} <ArrowRight size={20} /></button>
              </div>
            )}
            {isCorrect === true && answered >= questionsCount && (
              <p className="mt-6 font-extrabold text-good text-lg text-center" role="status">{t('correct')}</p>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <button onClick={onCancel} className="mt-8 mx-auto block font-bold text-ink/65 hover:text-ink">{t('back_station')}</button>
    </div>
  );
}
