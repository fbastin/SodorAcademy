import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import ExerciseFrame, { Feedback, Frac, answerClass } from './ExerciseFrame';
import { FractionBars, YELLOW, BLUE, Fr, gcd, lcm, rnd, reduce, frKey, fractionOptions } from './FractionAdditionLesson';

// Adding fractions with different denominators: find a common denominator (the
// LCM of the two), write both fractions with it, add the numerators, then simplify.
// Primary: one denominator is a multiple of the other (1/2 + 1/4). Secondary: any
// two denominators up to 10, with a common denominator up to 40 (1/4 + 1/6).

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

interface Problem {
  n1: number; d1: number; n2: number; d2: number;
  L: number; a: number; b: number; raw: number;   // n1/d1 = a/L, n2/d2 = b/L, a + b = raw
  right: Fr; options: Fr[];
}

const lowest = (n: number, d: number) => gcd(n, d) === 1;

function makeProblem(grade: Grade, prev?: Problem): Problem {
  let n1: number, d1: number, n2: number, d2: number;
  const same = (q?: Problem) => q && q.n1 === n1 && q.d1 === d1 && q.n2 === n2 && q.d2 === d2;
  if (grade === 'Primary') {
    do {
      d1 = rnd(2, 5); d2 = d1 * rnd(2, 3);
      if (d2 > 12) d2 = d1 * 2;
      n1 = rnd(1, d1 - 1); n2 = rnd(1, d2 - 1);
      if (Math.random() < 0.5) [n1, d1, n2, d2] = [n2, d2, n1, d1];
    } while (!lowest(n1, d1) || !lowest(n2, d2) || same(prev));
  } else {
    // About one sum in three to simplify at the end (1/6 + 1/10 = 8/30 = 4/15).
    const simplifies = Math.random() < 0.35;
    const toSimplify = () => { const L = lcm(d1, d2); return gcd(n1 * (L / d1) + n2 * (L / d2), L) > 1; };
    do {
      d1 = rnd(2, 10); d2 = rnd(2, 10);
      n1 = rnd(1, d1 - 1); n2 = rnd(1, d2 - 1);
    } while (d1 === d2 || lcm(d1, d2) > 40 || !lowest(n1, d1) || !lowest(n2, d2) || same(prev)
      // mostly denominators that are not multiples of each other
      || ((d1 % d2 === 0 || d2 % d1 === 0) && Math.random() < 0.7)
      || toSimplify() !== simplifies);
  }
  const L = lcm(d1, d2);
  const a = n1 * (L / d1), b = n2 * (L / d2), raw = a + b;
  const right = reduce([raw, L]);
  // The same answer, not simplified: over the LCM, or else over d1 × d2.
  const unsimplified: Fr | null = raw !== right[0] ? [raw, L] : L !== d1 * d2 ? [n1 * d2 + n2 * d1, d1 * d2] : null;
  const mistakes: Fr[] = [
    [n1 + n2, d1 + d2],                    // tops added, bottoms added
    ...([
      reduce([n1 + n2, L]),                // the denominators changed, not the numerators
      reduce([a + n2, L]),                 // only the first fraction changed
      reduce([n1 + b, L]),                 // only the second fraction changed
    ] as Fr[]).sort(() => Math.random() - 0.5),
  ];
  const near = (): Fr => reduce([right[0] + rnd(-2, 2), right[1] + rnd(-2, 2)]);
  const options = fractionOptions(right, mistakes, near, unsimplified);
  return { n1, d1, n2, d2, L, a, b, raw, right, options };
}

// The multiples of n up to `to`, the last one in bold.
function Multiples({ n, to }: { n: number; to: number }) {
  const list = Array.from({ length: to / n }, (_, k) => n * (k + 1));
  return (
    <span className="inline-flex flex-wrap gap-1.5 align-middle">
      {list.map(m => (
        <span key={m} className={`chip text-[0.95rem]! ${m === to ? 'bg-sticker!' : ''}`}>{m}</span>
      ))}
    </span>
  );
}

export default function FractionAddition({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
  const { lang } = useLang();
  const fr = lang === 'fr';
  const [p, setP] = useState<Problem>(() => makeProblem(grade));
  const [picked, setPicked] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);

  const next = () => { setP(q => makeProblem(grade, q)); setPicked(null); setKey(k => k + 1); };
  useEffect(() => { next(); }, [grade]);

  const right = frKey(p.right);
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

  const g = gcd(p.raw, p.L);
  const [pn, pd] = (picked ?? '0/1').split('/').map(Number);
  const m1 = p.L / p.d1, m2 = p.L / p.d2;
  const hint = !picked || ok ? null
    : pn === p.n1 + p.n2 && pd === p.d1 + p.d2
      ? (fr ? <>Attention : on n’additionne pas les dénominateurs ! Il faut d’abord des parts de même taille.</> : <>Careful: you never add the denominators! First you need parts of the same size.</>)
      : pn * p.right[1] === p.right[0] * pd
        ? (fr ? <>Ta fraction vaut la bonne réponse, mais il fallait encore la simplifier.</> : <>Your fraction is worth the right answer, but it still needed simplifying.</>)
        : null;

  // One fraction written over the common denominator.
  const convert = (n: number, d: number, m: number, to: number) => m === 1
    ? <p className="m-0 flex flex-wrap items-center gap-2 text-[1.35rem]"><Frac n={n} d={d} />
        <span className="text-[1.02rem]">{fr ? <>a déjà le dénominateur {p.L}.</> : <>already has the denominator {p.L}.</>}</span></p>
    : <p className="m-0 flex flex-wrap items-center gap-2 text-[1.35rem]">
        <Frac n={n} d={d} /> = <Frac n={`${n} × ${m}`} d={`${d} × ${m}`} /> = <Frac n={to} d={p.L} />
      </p>;

  const feedback: Feedback = !picked ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <div className="space-y-3">
        {hint && <p className="m-0 font-bold">{hint}</p>}
        <p className="m-0">
          {fr
            ? <><b>1.</b> Les dénominateurs, {p.d1} et {p.d2}, ne sont pas pareils. On cherche leur plus petit commun multiple (PPCM) :</>
            : <><b>1.</b> The denominators, {p.d1} and {p.d2}, are not the same. Find their least common multiple (LCM):</>}
        </p>
        <div className="space-y-1.5 pl-4">
          <p className="m-0 flex flex-wrap items-center gap-2">{fr ? `Table de ${p.d1} :` : `${p.d1} times table:`} <Multiples n={p.d1} to={p.L} /></p>
          <p className="m-0 flex flex-wrap items-center gap-2">{fr ? `Table de ${p.d2} :` : `${p.d2} times table:`} <Multiples n={p.d2} to={p.L} /></p>
          <p className="m-0 font-bold">{fr ? `PPCM(${p.d1}, ${p.d2}) = ${p.L} : c’est le dénominateur commun.` : `LCM(${p.d1}, ${p.d2}) = ${p.L}: that is the common denominator.`}</p>
        </div>
        <p className="m-0">{fr ? <><b>2.</b> On écrit les deux fractions avec le dénominateur {p.L} :</> : <><b>2.</b> Write both fractions with the denominator {p.L}:</>}</p>
        <div className="space-y-2 pl-4">
          {convert(p.n1, p.d1, m1, p.a)}
          {convert(p.n2, p.d2, m2, p.b)}
        </div>
        <p className="m-0">{fr ? <><b>3.</b> On additionne les numérateurs :</> : <><b>3.</b> Add the numerators:</>}</p>
        <p className="m-0 pl-4 flex flex-wrap items-center gap-2 text-[1.35rem]">
          <Frac n={p.a} d={p.L} /> + <Frac n={p.b} d={p.L} /> = <Frac n={p.raw} d={p.L} />
        </p>
        {p.L <= 24 && (
          <div className="pl-4 max-w-md">
            <FractionBars d={p.L} fills={[[p.a, YELLOW], [p.b, BLUE]]}
              label={fr ? `${p.a} + ${p.b} = ${p.raw} parts, dans des wagons de ${p.L} parts` : `${p.a} + ${p.b} = ${p.raw} parts, in vans of ${p.L} parts`} />
          </div>
        )}
        <p className="m-0">
          {g > 1
            ? (fr ? <><b>4.</b> On simplifie : {p.raw} et {p.L} se divisent tous les deux par {g}.</> : <><b>4.</b> Simplify: {p.raw} and {p.L} can both be divided by {g}.</>)
            : (fr ? <><b>4.</b> Aucun nombre plus grand que 1 ne divise {p.raw} et {p.L} : la fraction est déjà simplifiée.</> : <><b>4.</b> No number bigger than 1 divides both {p.raw} and {p.L}: the fraction is already simplified.</>)}
        </p>
        <p className="m-0 pl-4 flex flex-wrap items-center gap-2 text-[1.35rem]">
          {g > 1 && <><Frac n={p.raw} d={p.L} /> = <Frac n={`${p.raw} ÷ ${g}`} d={`${p.L} ÷ ${g}`} /> =</>}
          <span className="px-1.5 rounded-lg bg-white"><Frac n={p.right[0]} d={p.right[1]} /></span>
        </p>
      </div>
    ),
  };

  const say = fr
    ? `Combien font ${p.n1} sur ${p.d1} plus ${p.n2} sur ${p.d2} ?`
    : `What is ${p.n1} over ${p.d1} plus ${p.n2} over ${p.d2}?`;
  const big = Math.max(p.d1, p.d2), small = Math.min(p.d1, p.d2);

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={fr ? 'Additionner des fractions' : 'Adding fractions'}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(say, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">
        {fr
          ? 'Percy charge des colis, mais les parts n’ont pas la même taille. Trouve un dénominateur commun, additionne, puis simplifie :'
          : 'Percy is loading parcels, but the parts are not the same size. Find a common denominator, add, then simplify:'}
      </h2>
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 text-[2.2rem]">
        <Frac n={p.n1} d={p.d1} />
        <span className="font-extrabold text-[#2464d6]">+</span>
        <Frac n={p.n2} d={p.d2} />
        <span className="font-extrabold text-ink/50">=</span>
        <span className="w-14 h-20 rounded-xl border-[3px] border-dashed border-[#e23b2e] text-[#e23b2e] flex items-center justify-center font-extrabold">?</span>
      </div>
      {grade === 'Primary' && (
        <p className="text-center mb-6 text-ink/75 font-semibold">
          {fr ? `Indice : ${big} est dans la table de ${small}.` : `Hint: ${big} is in the ${small} times table.`}
        </p>
      )}
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${grade === 'Primary' ? '' : 'mt-7'}`}>
        {p.options.map(f => {
          const o = frKey(f);
          const state = !picked ? 'idle' : o === right ? 'right' : o === picked ? 'picked-wrong' : 'other';
          return (
            <button key={o} onClick={() => answer(o)} disabled={!!picked} className={`${answerClass(state)} py-3! text-[1.6rem]`}
              aria-label={fr ? `${f[0]} sur ${f[1]}` : `${f[0]} over ${f[1]}`}>
              <Frac n={f[0]} d={f[1]} />
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
