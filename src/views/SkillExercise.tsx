import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { useLang, withLang } from '../i18n';
import { Grade } from '../types';
import { Station, Activity } from '../content/stations';
import { loadPractice, PracticeBank, PQuestion, PSkill, PTopic, res, parseNum, answerText, lessonHref } from '../practice/bank';
import { TrainTrack } from './QuizView';
import { Engine } from '../components/ui';

// An exercise on one topic of the Practice Room (see practice/bank.ts): its skills
// in turn, at a level that starts from the school level and follows the answers.

const S = {
  en: {
    check: 'Check', level: (n: number) => `Level ${n}`,
    wrong: 'Not quite…', correct_was: 'The right answer was', you_said: (x: string) => `You answered: ${x}`,
    explanation: 'Explanation', got_it: 'Got it', lesson: 'See the lesson on slashbin.net',
    empty: 'Type a number first.', empty_pair: 'Fill in both boxes.',
    loading: 'Coupling the trucks…', fail: 'The exercises could not be loaded.', retry: 'Try again',
    right: ['Well done!', 'Spot on!', 'Brilliant!', 'Full steam ahead!', 'Right on time!'],
    from_practice: 'From the Practice Room',
  },
  fr: {
    check: 'Vérifier', level: (n: number) => `Niveau ${n}`,
    wrong: 'Pas tout à fait…', correct_was: 'La bonne réponse était', you_said: (x: string) => `Tu as répondu\u00a0: ${x}`,
    explanation: 'Explication', got_it: 'J’ai compris', lesson: 'Revoir la leçon sur slashbin.net',
    empty: 'Écris d’abord un nombre.', empty_pair: 'Remplis les deux cases.',
    loading: 'On attelle les wagons…', fail: 'Les exercices n’ont pas pu être chargés.', retry: 'Réessayer',
    right: ['Bravo !', 'Tout juste !', 'Excellent !', 'En avant toute !', 'Pile à l’heure !'],
    from_practice: 'De la salle d’entraînement',
  },
};

const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const numInput = 'w-[4.6em] h-[1.9em] text-center text-[1.7rem] font-extrabold tabular-nums bg-white border-[2.5px] border-ink rounded-xl shadow-[inset_0_3px_0_rgba(23,35,61,.08)] outline-none focus-visible:outline-3 focus-visible:outline-[#2464d6] disabled:bg-sky';

type Phase = 'ask' | 'right' | 'wrong';

export default function SkillExercise({ station, activity, grade, questionsCount, onComplete, onBack }: {
  station: Station;
  activity: Activity;
  grade: Grade;
  questionsCount: number;
  onComplete: (reward: string) => void;
  onBack: () => void;
}) {
  const { lang, t, tr } = useLang();
  const s = S[lang];
  const [bank, setBank] = useState<PracticeBank | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState<(PQuestion & { skill: PSkill; order: number[] }) | null>(null);
  const [phase, setPhase] = useState<Phase>('ask');
  const [qn, setQn] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [level, setLevel] = useState(grade === 'Primary' ? 0 : 1);
  const [streak, setStreak] = useState(0);
  const [inputs, setInputs] = useState(['', '']);
  const [last, setLast] = useState<any>(null);
  const [flash, setFlash] = useState('');
  const [info, setInfo] = useState('');
  const recent = useRef<string[]>([]);
  const queue = useRef<PSkill[]>([]);
  const firstInput = useRef<HTMLInputElement>(null);

  const load = () => {
    setFailed(false);
    loadPractice().then(setBank).catch(() => setFailed(true));
  };
  useEffect(load, []);

  const topic: PTopic | undefined = useMemo(() => bank?.topics.find(x => x.id === activity.practice), [bank, activity.practice]);
  const skills = useMemo(() => bank?.skills.filter(x => x.topic === activity.practice) || [], [bank, activity.practice]);

  // The skills in turn, shuffled each round; a question not asked lately.
  const next = (lv = level) => {
    if (!skills.length) return;
    if (!queue.current.length) queue.current = shuffle(skills);
    const skill = queue.current.shift()!;
    let qq: PQuestion = skill.gen(lv);
    for (let i = 0; i < 25 && recent.current.includes(qq.key); i++) qq = skill.gen(lv);
    recent.current = [...recent.current.slice(-7), qq.key];
    const idx = (qq.choices || []).map((_, i) => i);
    setQ({ ...qq, skill, order: qq.keep ? idx : shuffle(idx) });
    setQn(n => n + 1);
    setPhase('ask');
    setInputs(['', '']);
    setLast(null);
    setInfo('');
  };

  useEffect(() => { if (skills.length && !q) next(); }, [skills]);
  useEffect(() => { if (phase === 'ask') firstInput.current?.focus(); }, [q, phase]);

  const submit = (choice?: number) => {
    if (!q || phase !== 'ask') return;
    let v: any, ok: boolean;
    if (q.type === 'choice') {
      v = choice!;
      ok = v === q.answer;
    } else if (q.type === 'pair') {
      v = [parseNum(inputs[0], lang), parseNum(inputs[1], lang)];
      if (v.some(isNaN)) { setInfo(s.empty_pair); return; }
      ok = q.check ? q.check(v) : v[0] === q.answer[0] && v[1] === q.answer[1];
    } else {
      v = parseNum(inputs[0], lang);
      if (isNaN(v)) { setInfo(s.empty); return; }
      ok = Math.abs(v - q.answer) <= (q.tol || 1e-9);
    }
    setLast(v);
    setInfo('');
    if (ok) {
      const n = answered + 1;
      setAnswered(n);
      setFlash(s.right[Math.floor(Math.random() * s.right.length)]);
      setPhase('right');
      let lv = level;
      if (streak + 1 >= 3 && level < 2) { lv = level + 1; setLevel(lv); setStreak(0); } else setStreak(streak + 1);
      if (n >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
      else setTimeout(() => next(lv), 1000);
    } else {
      setPhase('wrong');
      setStreak(0);
      if (level > 0) setLevel(level - 1);
    }
  };

  const href = q?.skill.lesson ? lessonHref(q.skill) : topic ? lessonHref(topic) : undefined;

  if (failed) {
    return (
      <div className="max-w-3xl mx-auto card-ink p-8 text-center">
        <p className="font-bold mb-4">{s.fail}</p>
        <button onClick={load} className="chunky"><RotateCcw size={16} /> {s.retry}</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <TrainTrack progress={(answered / questionsCount) * 100} from={t('start')} to={tr(station.place)} color={station.color} />

      {!q ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <motion.div animate={{ x: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Engine size={80} color={station.color} />
          </motion.div>
          <p className="text-ink/60 font-semibold">{s.loading}</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.section key={qn} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            className="card-ink p-5 sm:p-7 skill-q" style={{ borderTopWidth: 10, borderTopColor: station.color }}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="label-caps">{topic?.letter} · {res(q.skill.title, lang)}</span>
              <span className="flex items-center gap-2">
                <span className="label-caps">{t('question_of', Math.min(answered + 1, questionsCount), questionsCount)}</span>
                <span className="chip" title={s.from_practice}>{s.level(level + 1)}</span>
              </span>
            </div>

            <div className="prompt text-xl sm:text-[1.35rem] font-bold leading-snug mb-3" dangerouslySetInnerHTML={{ __html: res(q.prompt, lang) }} />
            {q.visual && <div className="visual" dangerouslySetInnerHTML={{ __html: res(q.visual, lang) }} />}

            <form onSubmit={e => { e.preventDefault(); submit(); }} autoComplete="off" className="mt-4">
              {q.type === 'choice' ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {q.order.map((i, k) => {
                    const isAnswer = phase !== 'ask' && i === q.answer;
                    const isPicked = phase === 'wrong' && i === last;
                    return (
                      <button key={i} type="button" onClick={() => submit(i)} disabled={phase !== 'ask'}
                        className={`chunky big justify-start! text-left! w-full disabled:opacity-100! disabled:cursor-default ${isAnswer ? 'bg-mint!' : isPicked ? 'bg-rose!' : ''}`}>
                        <kbd className="inline-grid place-items-center w-6 h-6 text-xs font-mono font-bold border-2 border-ink/25 rounded-md shrink-0">{k + 1}</kbd>
                        <span dangerouslySetInnerHTML={{ __html: res(q.choices![i], lang) }} />
                      </button>
                    );
                  })}
                </div>
              ) : q.type === 'pair' && q.frac ? (
                <div className="flex flex-col items-center gap-2">
                  <input ref={firstInput} className={numInput} inputMode="decimal" aria-label={res(q.labels?.[0], lang)} value={inputs[0]} disabled={phase !== 'ask'}
                    onChange={e => setInputs([e.target.value, inputs[1]])} />
                  <span className="block w-[6em] border-t-4 border-ink" aria-hidden="true" />
                  <input className={numInput} inputMode="decimal" aria-label={res(q.labels?.[1], lang)} value={inputs[1]} disabled={phase !== 'ask'}
                    onChange={e => setInputs([inputs[0], e.target.value])} />
                  <button type="submit" className="chunky go big mt-2" disabled={phase !== 'ask'}>{s.check}</button>
                </div>
              ) : q.type === 'pair' ? (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {[0, 1].map(k => (
                    <label key={k} className="flex items-center gap-2 font-bold">
                      <span dangerouslySetInnerHTML={{ __html: res(q.labels?.[k], lang) }} />
                      <input ref={k === 0 ? firstInput : undefined} className={numInput} inputMode="decimal" value={inputs[k]} disabled={phase !== 'ask'}
                        onChange={e => setInputs(k === 0 ? [e.target.value, inputs[1]] : [inputs[0], e.target.value])} />
                    </label>
                  ))}
                  <button type="submit" className="chunky go big" disabled={phase !== 'ask'}>{s.check}</button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <input ref={firstInput} className={numInput} inputMode="decimal" aria-label={s.check} value={inputs[0]} disabled={phase !== 'ask'}
                    onChange={e => setInputs([e.target.value, inputs[1]])} />
                  {q.unit && <span className="text-2xl font-extrabold">{res(q.unit, lang)}</span>}
                  <button type="submit" className="chunky go big" disabled={phase !== 'ask'}>{s.check}</button>
                </div>
              )}
            </form>

            <div aria-live="polite">
              {info && <p className="mt-4 text-center font-bold">{info}</p>}
              {phase === 'right' && <p className="mt-5 text-center font-extrabold text-2xl text-good">{flash}</p>}
              {phase === 'wrong' && (
                <div className="note-paper mt-6">
                  <p className="font-extrabold text-bad text-xl mb-1">{s.wrong}</p>
                  <p className="m-0">
                    {s.correct_was}{' '}
                    <b className="px-1.5 rounded-md bg-white" dangerouslySetInnerHTML={{ __html: q.show !== undefined ? res(q.show, lang) : answerText(q, q.answer, lang) }} />.
                  </p>
                  {last !== null && q.type !== 'choice' && (
                    <p className="m-0 text-ink/65 text-sm">{s.you_said(answerText(q, last, lang))}</p>
                  )}
                  <h3 className="mt-3 mb-1 font-extrabold">{s.explanation}</h3>
                  <div className="explain" dangerouslySetInnerHTML={{ __html: res(q.explain, lang) }} />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button onClick={() => next()} className="chunky go" autoFocus>{s.got_it} <ArrowRight size={18} /></button>
                    {href && (
                      <a href={withLang(href, lang)} className="font-bold text-[#2464d6] flex items-center gap-1.5"><BookOpen size={17} /> {s.lesson}</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      )}

      <button onClick={onBack} className="mt-8 mx-auto block font-bold text-ink/65 hover:text-ink">{t('back_station')}</button>
    </div>
  );
}
