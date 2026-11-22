import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Volume2, PlayCircle } from 'lucide-react';
import { useLang, Text, Lang } from '../i18n';
import { speak, stopSpeaking } from '../services/speechService';
import { SiteLink } from '../content/stations';
import { SiteCard } from './ui';

// The shell of every lesson of Sodor Academy: a few steps to read, one at a time,
// each with a text, an optional picture or animation and an optional "remember"
// note, then the exercise the lesson leads to and the pages of slashbin.net on the
// same topic. A lesson only writes its steps (see components/*Lesson.tsx).

export interface LessonStep {
  title: Text;
  body: Text;                                  // the text of the step (simple HTML allowed: <b>, <i>, <br>)
  visual?: React.ReactNode | ((lang: Lang) => React.ReactNode);
  note?: Text;                                 // the "remember" note
  say?: Text;                                  // what is read aloud, when it differs from title + body
}

const S = {
  en: { step: (a: number, b: number) => `Step ${a} of ${b}`, prev: 'Back', next: 'Next', start: 'Start the exercise', done: 'Back to the station', listen: 'Read aloud', remember: 'Remember', more: 'Go further on slashbin.net' },
  fr: { step: (a: number, b: number) => `Étape ${a} sur ${b}`, prev: 'Retour', next: 'Suivant', start: 'Commencer l’exercice', done: 'Retour à la gare', listen: 'Lire à voix haute', remember: 'À retenir', more: 'Pour aller plus loin sur slashbin.net' },
};

const plain = (html: string) => html.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

export default function LessonPlayer({ title, color = '#2464d6', steps, links = [], onStartExercise, onCancel }: {
  title: Text;
  color?: string;
  steps: LessonStep[];
  links?: SiteLink[];
  onStartExercise?: () => void;
  onCancel: () => void;
}) {
  const { lang, tr } = useLang();
  const s = S[lang];
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;

  const go = (n: number) => {
    stopSpeaking();
    setI(Math.max(0, Math.min(steps.length - 1, n)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i]);

  useEffect(() => () => stopSpeaking(), []);

  const visual = typeof step.visual === 'function' ? (step.visual as (l: Lang) => React.ReactNode)(lang) : step.visual;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="card-ink overflow-hidden">
        <header className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b-[3px] border-ink" style={{ background: color }}>
          <h1 className="sticker-title text-2xl sm:text-3xl bg-white! text-ink! [text-shadow:none]!">{tr(title)}</h1>
          <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
            {steps.map((_, k) => (
              <button key={k} onClick={() => go(k)} tabIndex={-1}
                className={`h-3 flex-1 rounded-full border-2 border-ink transition-colors ${k <= i ? 'bg-sticker' : 'bg-white/70'}`} />
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            className="p-5 sm:p-8">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="label-caps m-0">{s.step(i + 1, steps.length)}</p>
                <h2 className="text-2xl sm:text-[1.9rem] font-extrabold leading-tight mt-1">{tr(step.title)}</h2>
              </div>
              <button onClick={() => speak(plain(tr(step.say ?? '') || `${tr(step.title)}. ${tr(step.body)}`), lang)}
                className="chunky p-0! w-11 h-11 shrink-0" title={s.listen} aria-label={s.listen}>
                <Volume2 size={20} />
              </button>
            </div>

            <p className="text-[1.15rem] sm:text-[1.25rem] leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: tr(step.body) }} />

            {visual && <div className="mb-5">{visual}</div>}

            {step.note && (
              <div className="note-paper mb-5 max-w-2xl">
                <p className="font-extrabold mb-1">{s.remember}</p>
                <p className="m-0" dangerouslySetInnerHTML={{ __html: tr(step.note) }} />
              </div>
            )}

            {last && links.length > 0 && (
              <section className="mb-6">
                <h3 className="font-extrabold text-lg mb-3">{s.more}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {links.map(l => <React.Fragment key={l.href}><SiteCard link={l} /></React.Fragment>)}
                </div>
              </section>
            )}

            <nav className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => go(i - 1)} disabled={i === 0} className={`chunky ${i === 0 ? 'invisible' : ''}`}>
                <ArrowLeft size={18} /> {s.prev}
              </button>
              {!last ? (
                <button onClick={() => go(i + 1)} className="chunky go big">{s.next} <ArrowRight size={20} /></button>
              ) : onStartExercise ? (
                <button onClick={onStartExercise} className="chunky go big"><PlayCircle size={20} /> {s.start}</button>
              ) : (
                <button onClick={onCancel} className="chunky go big">{s.done}</button>
              )}
            </nav>
          </motion.div>
        </AnimatePresence>
      </article>
    </div>
  );
}
