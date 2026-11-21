import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang, Lang, pick } from '../i18n';
import ExerciseFrame, { Feedback, answerClass } from './ExerciseFrame';
import { Engine } from './ui';

// The average of a longer list: an engine pulls 4 to 8 coal trucks, each with its
// load in tonnes; what is the average load of a truck? Whole-number averages at
// Primary; at Secondary, some averages have decimals (4 or 5 trucks, so that the
// division ends: 61 ÷ 4 = 15.25, 62 ÷ 5 = 12.4). Four answers.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

const ENGINES = [
  { name: 'Thomas', color: '#2464d6', number: '1' },
  { name: 'Edward', color: '#4a7cc4', number: '2' },
  { name: 'Henry', color: '#2e8b3e', number: '3' },
  { name: 'Gordon', color: '#1f4fa0', number: '4' },
  { name: 'James', color: '#d8342c', number: '5' },
  { name: 'Percy', color: '#3fa34d', number: '6' },
  { name: 'Toby', color: '#8a5a32', number: '7' },
  { name: 'Emily', color: '#1c7a55', number: '12' },
];
type Crew = typeof ENGINES[number];

interface Problem {
  engine: Crew; values: number[]; sum: number; mean: number;
  median: number | null; remDec: number | null; options: number[];
}

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);
const r2 = (x: number) => Math.round(x * 100) / 100;

// n values that add up to `sum`, scattered around `center`.
function makeValues(n: number, sum: number, center: number, spread: number, max: number): number[] {
  for (;;) {
    const v = Array.from({ length: n - 1 }, () => center + rnd(-spread, spread));
    v.push(sum - v.reduce((a, b) => a + b, 0));
    if (v.every(x => x >= 1 && x <= max) && new Set(v).size > 2) return shuffle(v);
  }
}

function makeProblem(grade: Grade): Problem {
  const primary = grade === 'Primary';
  const n = rnd(4, 8);
  const base = primary ? rnd(4, 9) : rnd(8, 19);
  // At Secondary, with 4 or 5 trucks, the sum often does not share out exactly.
  const extra = !primary && n <= 5 && Math.random() < 0.6 ? rnd(1, n - 1) : 0;
  const sum = n * base + extra;
  const values = makeValues(n, sum, base, Math.min(base - 1, primary ? 5 : 9), primary ? 15 : 30);
  const mean = r2(sum / n);
  const sorted = [...values].sort((a, b) => a - b);
  const median = n % 2 ? sorted[(n - 1) / 2] : null;
  const q = Math.floor(sum / n), rem = sum % n;
  const remDec = rem ? r2(q + rem / 10) : null;            // 62 ÷ 5 = 12 r 2, written "12.2"

  const options = new Set<number>([mean]);
  const first: number[] = [];                               // the mistakes worth showing first
  const typical: number[] = [];                             // other likely mistakes
  if (remDec !== null) { first.push(remDec); typical.push(q); }
  if (median !== null) typical.push(median);
  if ((primary ? sum : sum * 100) % (n - 1) === 0) typical.push(r2(sum / (n - 1)));   // whole numbers only at Primary
  typical.push(sum);
  for (const w of [...first, ...shuffle(typical)]) if (options.size < 3 && w > 0) options.add(w);
  while (options.size < 4) {
    const w = r2(mean + (Math.random() < 0.5 ? -1 : 1) * rnd(1, 3));
    if (w > 0) options.add(w);
  }
  return { engine: ENGINES[rnd(0, ENGINES.length - 1)], values, sum, mean, median, remDec, options: [...options].sort((a, b) => a - b) };
}

const list = (xs: (string | number)[], lang: Lang) =>
  `${xs.slice(0, -1).join(', ')} ${lang === 'fr' ? 'et' : 'and'} ${xs[xs.length - 1]}`;

export default function ArithmeticMeanMastery({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
  const { lang } = useLang();
  const fr = lang === 'fr';
  const L = (f: string, e: string) => pick({ fr: f, en: e }, lang);
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 2 });
  const [p, setP] = useState<Problem>(() => makeProblem(grade));
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);

  const next = () => { setP(makeProblem(grade)); setPicked(null); setKey(k => k + 1); };
  useEffect(() => { next(); }, [grade]);

  const n = p.values.length;
  const ok = picked === p.mean;
  const q = Math.floor(p.sum / n), rem = p.sum % n;

  const answer = (o: number) => {
    if (picked !== null) return;
    setPicked(o);
    if (o === p.mean) {
      const k = answered + 1;
      setAnswered(k);
      if (k >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
    }
  };

  // What the wrong answer probably was.
  const hint = picked === null || ok ? null
    : picked === p.sum ? L(`${p.sum}, c’est la somme des charges. Il reste à la partager entre les ${n} wagons !`, `${p.sum} is the sum of the loads. You still need to share it between the ${n} trucks!`)
    : picked === p.remDec ? L(
      `${p.sum} ÷ ${n} = ${q}, reste ${rem}. Mais le reste ne s’écrit pas après la virgule : on continue la division, et ${rem} ÷ ${n} = ${fmt(r2(rem / n))}.`,
      `${p.sum} ÷ ${n} = ${q} remainder ${rem}. But the remainder does not go after the decimal point: keep dividing, and ${rem} ÷ ${n} = ${fmt(r2(rem / n))}.`)
    : rem && picked === q ? L(`La division ne s’arrête pas à ${q} : il reste ${rem}, alors on continue après la virgule.`, `The division does not stop at ${q}: there is ${rem} left over, so carry on after the decimal point.`)
    : r2(picked * (n - 1)) === p.sum ? L(`Tu as divisé par ${n - 1}, mais il y a ${n} wagons.`, `You divided by ${n - 1}, but there are ${n} trucks.`)
    : picked === p.median ? L(`${picked}, c’est le nombre du milieu quand on les range, pas la moyenne.`, `${picked} is the middle number when you put them in order, not the average.`)
    : null;

  const feedback: Feedback = picked === null ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <>
        {hint && <p className="mt-0 mb-2">{hint}</p>}
        <p className="m-0">
          {L(`On additionne les ${n} charges : `, `Add up the ${n} loads: `)}
          <b className="tabular-nums">{p.values.join(' + ')} = {p.sum}</b>.{' '}
          {L(`Il y a ${n} wagons, alors on divise par ${n} : `, `There are ${n} trucks, so divide by ${n}: `)}
          <b className="tabular-nums">{p.sum} ÷ {n} = {fmt(p.mean)}</b>.{' '}
          {L(`La charge moyenne est de ${fmt(p.mean)} tonnes.`, `The average load is ${fmt(p.mean)} tonnes.`)}
        </p>
      </>
    ),
  };

  const intro = L(
    `${p.engine.name} tire ${n} wagons de charbon. Le nombre sur chaque wagon, c’est sa charge en tonnes.`,
    `${p.engine.name} is pulling ${n} coal trucks. The number on each truck is its load in tonnes.`);
  const ask = L('Quelle est la charge moyenne d’un wagon ?', 'What is the average load of a truck?');
  const say = `${intro} ${fr ? 'Les charges sont' : 'The loads are'} ${list(p.values, lang)}. ${ask}`;

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={L('La moyenne : maîtrise', 'Averages: mastery')}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(say, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <p className="text-lg mt-0 mb-1">{intro}</p>
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">{ask}</h2>

      <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5 mb-6 flex flex-wrap items-end justify-center gap-x-1.5 gap-y-4" role="img"
        aria-label={L(`Les ${n} charges, en tonnes : ${list(p.values, lang)}`, `The ${n} loads, in tonnes: ${list(p.values, lang)}`)}>
        {p.values.map((v, k) => (
          <span key={k} className="flex flex-col items-center">
            <span className="block w-11 h-2.5 rounded-t-full bg-[#2b2f38] border-2 border-b-0 border-ink" />
            <span className="flex items-center justify-center min-w-[3.4rem] h-10 px-1 rounded-md border-[2.5px] border-ink bg-[#e9c48f] font-extrabold text-xl tabular-nums">{v}</span>
            <span className="flex gap-5 -mt-1.5">
              <span className="block w-3.5 h-3.5 rounded-full bg-[#555] border-2 border-ink" />
              <span className="block w-3.5 h-3.5 rounded-full bg-[#555] border-2 border-ink" />
            </span>
          </span>
        ))}
        <Engine size={72} color={p.engine.color} number={p.engine.number} className="shrink-0" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {p.options.map(o => {
          const state = picked === null ? 'idle' : o === p.mean ? 'right' : o === picked ? 'picked-wrong' : 'other';
          return (
            <button key={o} onClick={() => answer(o)} disabled={picked !== null} className={`${answerClass(state)} py-3! text-[1.6rem] tabular-nums`}>
              {fmt(o)}
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
