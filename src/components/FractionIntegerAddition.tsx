import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import ExerciseFrame, { Feedback, Frac, answerClass } from './ExerciseFrame';
import { FractionBars, YELLOW, BLUE, Fr, gcd, rnd, frKey, fractionOptions } from './FractionAdditionLesson';

// A whole number plus a fraction, as one fraction: Gordon's full trucks and part
// of another. A whole truck is d/d, so i trucks are (i × d)/d; then add the
// numerators. The fraction is in its lowest terms, so the answer is too.
// Primary: up to 4 trucks and denominators up to 6. Secondary: up to 9 trucks,
// denominators up to 12, and sometimes the fraction first.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

interface Problem { i: number; n: number; d: number; fracFirst: boolean; right: Fr; options: Fr[] }

function makeProblem(grade: Grade, prev?: Problem): Problem {
  const prim = grade === 'Primary';
  let i: number, n: number, d: number;
  do {
    i = rnd(1, prim ? 4 : 9);
    d = rnd(2, prim ? 6 : 12);
    n = rnd(1, d - 1);
  } while (gcd(n, d) !== 1 || (prev && prev.i === i && prev.n === n && prev.d === d));
  const right: Fr = [i * d + n, d];
  const mistakes: Fr[] = [
    [i + n, d],                            // the whole number added to the numerator
    ...([
      [i + n, d + 1],                      // i/1 + n/d, tops and bottoms added
      [i * n, d],                          // multiplied instead of added
      [(i + 1) * d + n, d],                // one whole truck too many
      [i * d - n, d],                      // the part taken away
    ] as Fr[]).sort(() => Math.random() - 0.5),
  ];
  const near = (): Fr => [right[0] + rnd(-3, 3), d];
  return { i, n, d, fracFirst: !prim && Math.random() < 0.35, right, options: fractionOptions(right, mistakes, near) };
}

export default function FractionIntegerAddition({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
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
  const whole = p.i * p.d;

  const answer = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === right) {
      const n = answered + 1;
      setAnswered(n);
      if (n >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
    }
  };

  const [pn, pd] = (picked ?? '0/1').split('/').map(Number);
  const hint = !picked || ok ? null
    : pn === p.i + p.n && (pd === p.d || pd === p.d + 1)
      ? (fr
        ? <>Attention : {p.i} compte des wagons entiers, pas des parts. {p.i} {p.i > 1 ? 'wagons' : 'wagon'}, c’est {whole} parts, car chaque wagon a {p.d} parts.</>
        : <>Careful: {p.i} counts whole trucks, not parts. {p.i} {p.i > 1 ? 'trucks are' : 'truck is'} {whole} parts, because each truck has {p.d} parts.</>)
      : null;

  const feedback: Feedback = !picked ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <div className="space-y-3">
        {hint && <p className="m-0 font-bold">{hint}</p>}
        <p className="m-0">
          {fr
            ? <>Un wagon entier, c’est {p.d} parts sur {p.d} : 1 = <Frac n={p.d} d={p.d} />. Donc {p.i} {p.i > 1 ? 'wagons' : 'wagon'}, c’est {p.i} × {p.d} = <b>{whole}</b> parts :</>
            : <>A whole truck is {p.d} parts out of {p.d}: 1 = <Frac n={p.d} d={p.d} />. So {p.i} {p.i > 1 ? 'trucks are' : 'truck is'} {p.i} × {p.d} = <b>{whole}</b> parts:</>}
        </p>
        <p className="m-0 pl-4 flex flex-wrap items-center gap-2 text-[1.35rem]">
          {p.i} = <Frac n={`${p.i} × ${p.d}`} d={p.d} /> = <Frac n={whole} d={p.d} />
        </p>
        <p className="m-0">{fr ? 'Maintenant les dénominateurs sont pareils : on additionne les numérateurs.' : 'Now the denominators are the same: add the numerators.'}</p>
        <p className="m-0 pl-4 flex flex-wrap items-center gap-2 text-[1.35rem]">
          <Frac n={whole} d={p.d} /> + <Frac n={p.n} d={p.d} /> = <Frac n={`${whole} + ${p.n}`} d={p.d} /> =
          <span className="px-1.5 rounded-lg bg-white"><Frac n={p.right[0]} d={p.right[1]} /></span>
        </p>
        {p.i <= 4 && (
          <div className="max-w-xl">
            <FractionBars d={p.d} fills={[[whole, BLUE], [p.n, YELLOW]]}
              label={fr ? `${p.i} ${p.i > 1 ? 'wagons pleins' : 'wagon plein'} et ${p.n} ${p.n > 1 ? 'parts' : 'part'} d’un wagon de ${p.d} parts` : `${p.i} full truck${p.i > 1 ? 's' : ''} and ${p.n} part${p.n > 1 ? 's' : ''} of a truck of ${p.d} parts`} />
          </div>
        )}
      </div>
    ),
  };

  const plus = <span className="text-[#2464d6]">+</span>;
  const sum = p.fracFirst ? <><Frac n={p.n} d={p.d} />{plus}{p.i}</> : <>{p.i}{plus}<Frac n={p.n} d={p.d} /></>;
  const say = fr
    ? `Gordon tire ${p.i} ${p.i > 1 ? 'wagons pleins' : 'wagon plein'} de charbon et ${p.n} sur ${p.d} d’un autre wagon. Combien de wagons en tout ?`
    : `Gordon pulls ${p.i} full truck${p.i > 1 ? 's' : ''} of coal and ${p.n} over ${p.d} of another truck. How many trucks is that?`;

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={fr ? 'Un entier plus une fraction' : 'A whole number plus a fraction'}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(say, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">
        {fr
          ? <>Gordon tire {p.i} {p.i > 1 ? 'wagons pleins' : 'wagon plein'} de charbon et <Frac n={p.n} d={p.d} /> d’un autre wagon. Combien de wagons en tout ? Écris la réponse en une seule fraction.</>
          : <>Gordon pulls {p.i} full truck{p.i > 1 ? 's' : ''} of coal and <Frac n={p.n} d={p.d} /> of another truck. How many trucks is that? Write the answer as one fraction.</>}
      </h2>
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-7 text-[2.2rem] font-extrabold">
        <span className="flex items-center gap-4 sm:gap-6">{sum}</span>
        <span className="text-ink/50">=</span>
        <span className="w-14 h-20 rounded-xl border-[3px] border-dashed border-[#e23b2e] text-[#e23b2e] flex items-center justify-center">?</span>
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
