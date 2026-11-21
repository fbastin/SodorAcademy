import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import ExerciseFrame, { Feedback, Frac, answerClass } from './ExerciseFrame';

// Multiplying fractions, as in the fraction game of the pages for kids
// (games/multiplying_fractions.html): numerator times numerator, denominator times
// denominator, then simplify. Four answers to choose from.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

interface Problem { n1: number; d1: number; n2: number; d2: number; n: number; d: number; rawN: number; rawD: number; options: string[] }

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

function makeProblem(grade: Grade): Problem {
  const max = grade === 'Primary' ? 6 : 10;
  let n1, d1, n2, d2;
  do {
    d1 = rnd(2, max); n1 = rnd(1, d1 - 1);
    d2 = rnd(2, max); n2 = rnd(1, d2 - 1);
  } while (n1 * n2 === d1 * d2);
  const rawN = n1 * n2, rawD = d1 * d2, g = gcd(rawN, rawD);
  const right = `${rawN / g}/${rawD / g}`;
  const options = new Set<string>([right]);
  // Likely mistakes first: not simplified, added instead of multiplied, crossed.
  const wrong = [`${rawN}/${rawD}`, `${n1 + n2}/${d1 + d2}`, `${n1 * d2}/${d1 * n2}`];
  for (const w of wrong) if (options.size < 4 && w !== right && !w.endsWith('/0')) options.add(w);
  while (options.size < 4) {
    const w = `${Math.max(1, rawN / g + rnd(-2, 2))}/${Math.max(2, rawD / g + rnd(-2, 2))}`;
    if (w !== right) options.add(w);
  }
  return { n1, d1, n2, d2, n: rawN / g, d: rawD / g, rawN, rawD, options: [...options].sort(() => Math.random() - 0.5) };
}

export default function FractionMultiplication({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
  const { lang } = useLang();
  const fr = lang === 'fr';
  const [p, setP] = useState<Problem>(() => makeProblem(grade));
  const [picked, setPicked] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);

  const next = () => { setP(makeProblem(grade)); setPicked(null); setKey(k => k + 1); };
  useEffect(() => { next(); }, [grade]);

  const right = `${p.n}/${p.d}`;
  const ok = picked === right;

  const answer = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === right) {
      const n = answered + 1;
      setAnswered(n);
      if (n >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
    }
  };

  const simplified = p.rawN !== p.n;
  const feedback: Feedback = !picked ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <p className="m-0">
        {fr ? 'On multiplie le haut par le haut et le bas par le bas : ' : 'Multiply top by top and bottom by bottom: '}
        <b>{p.n1} × {p.n2} = {p.rawN}</b> {fr ? 'et' : 'and'} <b>{p.d1} × {p.d2} = {p.rawD}</b>.{' '}
        {simplified
          ? (fr ? <>Puis on simplifie {p.rawN}/{p.rawD} en divisant par {gcd(p.rawN, p.rawD)} : <b>{right}</b>.</> : <>Then simplify {p.rawN}/{p.rawD} by dividing by {gcd(p.rawN, p.rawD)}: <b>{right}</b>.</>)
          : (fr ? <>La fraction ne se simplifie pas : <b>{right}</b>.</> : <>It cannot be simplified: <b>{right}</b>.</>)}
      </p>
    ),
  };

  const say = fr
    ? `Combien font ${p.n1} sur ${p.d1} fois ${p.n2} sur ${p.d2} ?`
    : `What is ${p.n1} over ${p.d1} times ${p.n2} over ${p.d2}?`;

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={fr ? 'Multiplier des fractions' : 'Multiplying fractions'}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(say, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">
        {fr ? 'Thomas livre des fractions de chargement. Multiplie, puis simplifie :' : 'Thomas is delivering fractions of a load. Multiply, then simplify:'}
      </h2>
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-7 text-[2.2rem]">
        <Frac n={p.n1} d={p.d1} />
        <span className="font-extrabold text-[#2464d6]">×</span>
        <Frac n={p.n2} d={p.d2} />
        <span className="font-extrabold text-ink/50">=</span>
        <span className="w-14 h-20 rounded-xl border-[3px] border-dashed border-[#e23b2e] text-[#e23b2e] flex items-center justify-center font-extrabold">?</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {p.options.map(o => {
          const [on, od] = o.split('/');
          const state = !picked ? 'idle' : o === right ? 'right' : o === picked ? 'picked-wrong' : 'other';
          return (
            <button key={o} onClick={() => answer(o)} disabled={!!picked} className={`${answerClass(state)} py-3! text-[1.6rem]`}
              aria-label={`${on}/${od}`}>
              <Frac n={on} d={od} />
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
