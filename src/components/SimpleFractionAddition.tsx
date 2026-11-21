import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import ExerciseFrame, { Feedback, Frac, answerClass } from './ExerciseFrame';
import { FractionBars, YELLOW, BLUE, Fr, gcd, rnd, reduce, frKey, fractionOptions } from './FractionAdditionLesson';

// Adding fractions with the same denominator: the parts are the same size, so add
// the numerators and keep the denominator. Primary: the answer is less than one and
// already simplified. Secondary: it may be more than one, and must be simplified.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

interface Problem { d: number; n1: number; n2: number; sum: number; right: Fr; options: Fr[] }

function makeProblem(grade: Grade, prev?: Problem): Problem {
  let d: number, n1: number, n2: number;
  if (grade === 'Primary') {
    do {
      d = rnd(3, 9); n1 = rnd(1, d - 2); n2 = rnd(1, d - 1 - n1);
    } while (gcd(n1 + n2, d) !== 1 || (prev && prev.d === d && prev.n1 === n1 && prev.n2 === n2));
  } else {
    const simplifies = Math.random() < 0.6;
    do {
      d = rnd(4, 12); n1 = rnd(1, d - 1); n2 = rnd(1, d - 1);
    } while (n1 + n2 === d || (gcd(n1 + n2, d) > 1) !== simplifies || (prev && prev.d === d && prev.n1 === n1 && prev.n2 === n2));
  }
  const sum = n1 + n2;
  const right = reduce([sum, d]);
  const prim = grade === 'Primary';
  // Likely mistakes: adding the denominators too, then (in any order, so that the right
  // answer is not always the middle one) a part too many or too few, or multiplying.
  const keep = (f: Fr): Fr => (prim ? f : reduce(f));
  const others: Fr[] = [[sum + 1, d], [sum - 1, d], [sum + 2, d], [n1 * n2, d]].map(f => keep(f as Fr));
  const mistakes: Fr[] = [[sum, 2 * d], ...others.sort(() => Math.random() - 0.5)];
  const near = (): Fr => prim ? [sum + rnd(-3, 3), d] : reduce([sum + rnd(-3, 3), d + rnd(-1, 1)]);
  const options = fractionOptions(right, mistakes, near, prim ? null : [sum, d]);
  return { d, n1, n2, sum, right, options };
}

export default function SimpleFractionAddition({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
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
  const secondary = grade === 'Secondary';

  const answer = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === right) {
      const n = answered + 1;
      setAnswered(n);
      if (n >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
    }
  };

  const g = gcd(p.sum, p.d);
  const [pn, pd] = (picked ?? '0/1').split('/').map(Number);
  const hint = !picked || ok ? null
    : pd === 2 * p.d || pd === p.d * p.d
      ? (fr ? <>Attention : on ne touche pas au dénominateur. Le wagon a toujours {p.d} parts !</> : <>Careful: the denominator does not change. The van still has {p.d} parts!</>)
      : picked === `${p.sum}/${p.d}`
        ? (fr ? <>Ton addition est juste, mais il fallait encore simplifier.</> : <>Your sum is right, but it still needed simplifying.</>)
        : pn * p.d !== p.sum * pd && pd === p.d
          ? (fr ? <>Recompte les parts : {p.n1} + {p.n2} = {p.sum}.</> : <>Count the parts again: {p.n1} + {p.n2} = {p.sum}.</>)
          : null;

  const feedback: Feedback = !picked ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <div className="space-y-3">
        {hint && <p className="m-0 font-bold">{hint}</p>}
        <p className="m-0">
          {fr
            ? <>Les deux fractions ont le même dénominateur, <b>{p.d}</b> : les parts ont la même taille. On additionne les numérateurs, <b>{p.n1} + {p.n2} = {p.sum}</b>, et on garde le dénominateur.</>
            : <>Both fractions have the same denominator, <b>{p.d}</b>, so the parts are the same size. Add the numerators, <b>{p.n1} + {p.n2} = {p.sum}</b>, and keep the denominator.</>}
          {g > 1 && (fr
            ? <> Puis on simplifie en divisant le haut et le bas par <b>{g}</b>.</>
            : <> Then simplify by dividing the top and the bottom by <b>{g}</b>.</>)}
        </p>
        <p className="m-0 flex flex-wrap items-center gap-2.5 text-[1.5rem]">
          <Frac n={p.n1} d={p.d} /> + <Frac n={p.n2} d={p.d} /> = <Frac n={p.sum} d={p.d} />
          {g > 1 && <> = <Frac n={`${p.sum} ÷ ${g}`} d={`${p.d} ÷ ${g}`} /> = <Frac n={p.right[0]} d={p.right[1]} /></>}
        </p>
        <div className="max-w-md">
          <FractionBars d={p.d} fills={[[p.n1, YELLOW], [p.n2, BLUE]]}
            label={fr
              ? `${p.n1} part${p.n1 > 1 ? 's' : ''} jaune${p.n1 > 1 ? 's' : ''} et ${p.n2} part${p.n2 > 1 ? 's' : ''} bleue${p.n2 > 1 ? 's' : ''}, dans des wagons de ${p.d} parts`
              : `${p.n1} yellow part${p.n1 > 1 ? 's' : ''} and ${p.n2} blue part${p.n2 > 1 ? 's' : ''}, in vans of ${p.d} parts`} />
        </div>
      </div>
    ),
  };

  const say = fr
    ? `Combien font ${p.n1} sur ${p.d} plus ${p.n2} sur ${p.d} ?`
    : `What is ${p.n1} over ${p.d} plus ${p.n2} over ${p.d}?`;

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={fr ? 'Fractions de même dénominateur' : 'Fractions with the same denominator'}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(say, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">
        {secondary
          ? (fr ? 'Percy charge du courrier dans ses wagons. Les parts ont la même taille : additionne, puis simplifie si c’est possible.' : 'Percy is loading mail into his vans. The parts are the same size: add, then simplify if you can.')
          : (fr ? 'Percy remplit son wagon de courrier. Les parts ont la même taille : additionne !' : 'Percy is filling his mail van. The parts are the same size: add them up!')}
      </h2>
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-7 text-[2.2rem]">
        <Frac n={p.n1} d={p.d} />
        <span className="font-extrabold text-[#2464d6]">+</span>
        <Frac n={p.n2} d={p.d} />
        <span className="font-extrabold text-ink/50">=</span>
        <span className="w-14 h-20 rounded-xl border-[3px] border-dashed border-[#e23b2e] text-[#e23b2e] flex items-center justify-center font-extrabold">?</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
