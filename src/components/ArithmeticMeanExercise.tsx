import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang, Lang, pick } from '../i18n';
import ExerciseFrame, { Feedback, answerClass } from './ExerciseFrame';
import { Engine } from './ui';

// First steps with the average: a few engines pull different numbers of trucks;
// if they shared them out equally, how many would each one pull? Add them all up,
// then divide by the number of engines. Whole-number averages, four answers.

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

interface Problem { crew: Crew[]; values: number[]; sum: number; mean: number; median: number | null; options: number[] }

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);

// Values around a whole-number mean: random gaps, the last value balances them.
function makeValues(n: number, mean: number, spread: number, max: number): number[] {
  for (;;) {
    const v = Array.from({ length: n - 1 }, () => mean + rnd(-spread, spread));
    const last = n * mean - v.reduce((a, b) => a + b, 0);
    v.push(last);
    if (v.every(x => x >= 1 && x <= max) && new Set(v).size > 1) return shuffle(v);
  }
}

function makeProblem(grade: Grade): Problem {
  const primary = grade === 'Primary';
  const n = primary ? 3 : rnd(3, 5);
  const mean = primary ? rnd(3, 8) : rnd(6, 17);
  const values = makeValues(n, mean, Math.min(mean - 1, primary ? 4 : 7), primary ? 12 : 25);
  const sum = n * mean;
  const sorted = [...values].sort((a, b) => a - b);
  const median = n % 2 ? sorted[(n - 1) / 2] : null;

  // Likely mistakes: the middle number, dividing by one too few or too many, forgetting to divide.
  const options = new Set<number>([mean]);
  const typical: number[] = [];
  if (median !== null) typical.push(median);
  if (sum % (n - 1) === 0) typical.push(sum / (n - 1));
  if (sum % (n + 1) === 0) typical.push(sum / (n + 1));
  typical.push(sum);
  for (const w of shuffle(typical)) if (options.size < 3 && w > 0) options.add(w);
  while (options.size < 4) {
    const w = mean + (Math.random() < 0.5 ? -1 : 1) * rnd(1, 3);
    if (w > 0) options.add(w);
  }
  return { crew: shuffle(ENGINES).slice(0, n), values, sum, mean, median, options: [...options].sort((a, b) => a - b) };
}

const list = (xs: (string | number)[], lang: Lang) =>
  `${xs.slice(0, -1).join(', ')} ${lang === 'fr' ? 'et' : 'and'} ${xs[xs.length - 1]}`;

export default function ArithmeticMeanExercise({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
  const { lang } = useLang();
  const fr = lang === 'fr';
  const L = (f: string, e: string) => pick({ fr: f, en: e }, lang);
  const [p, setP] = useState<Problem>(() => makeProblem(grade));
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);

  const next = () => { setP(makeProblem(grade)); setPicked(null); setKey(k => k + 1); };
  useEffect(() => { next(); }, [grade]);

  const n = p.values.length;
  const ok = picked === p.mean;

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
    : picked === p.sum ? L(`${p.sum}, c’est la somme. Il reste à la partager entre les ${n} locomotives !`, `${p.sum} is the sum. You still need to share it between the ${n} engines!`)
    : picked * (n - 1) === p.sum ? L(`Tu as divisé par ${n - 1}, mais il y a ${n} locomotives.`, `You divided by ${n - 1}, but there are ${n} engines.`)
    : picked * (n + 1) === p.sum ? L(`Tu as divisé par ${n + 1}, mais il y a ${n} locomotives.`, `You divided by ${n + 1}, but there are ${n} engines.`)
    : picked === p.median ? L(`${picked}, c’est le nombre du milieu, pas la moyenne.`, `${picked} is the middle number, not the average.`)
    : null;

  const feedback: Feedback = picked === null ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <>
        {hint && <p className="mt-0 mb-2">{hint}</p>}
        <p className="m-0">
          {L('On additionne tous les wagons : ', 'Add up all the trucks: ')}
          <b className="tabular-nums">{p.values.join(' + ')} = {p.sum}</b>.{' '}
          {L(`Il y a ${n} locomotives, alors on partage en ${n} : `, `There are ${n} engines, so share by ${n}: `)}
          <b className="tabular-nums">{p.sum} ÷ {n} = {p.mean}</b>.{' '}
          {L(`Chaque locomotive tirerait ${p.mean} wagons.`, `Each engine would pull ${p.mean} trucks.`)}
        </p>
      </>
    ),
  };

  const said = list(p.crew.map((c, k) => (k === 0 ? `${c.name} ${fr ? 'tire' : 'pulls'} ${p.values[k]} ${fr ? 'wagons' : 'trucks'}` : `${c.name} ${p.values[k]}`)), lang);
  const say = fr ? `${said}. Quelle est la moyenne ?` : `${said}. What is the average?`;

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={L('La moyenne : premiers pas', 'Averages: first steps')}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(say, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">
        {L('Si ces locomotives partageaient leurs wagons également, combien chacune en tirerait-elle ?', 'If these engines shared their trucks out equally, how many would each one pull?')}
      </h2>

      {grade === 'Primary' ? (
        <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5 mb-6 space-y-3" role="img"
          aria-label={list(p.crew.map((c, k) => `${c.name} ${p.values[k]}`), lang)}>
          {p.crew.map((c, k) => (
            <div key={c.name} className="flex items-end gap-2 sm:gap-3">
              <span className="w-14 sm:w-20 shrink-0 font-extrabold text-[0.95rem] sm:text-lg pb-0.5">{c.name}</span>
              <span className="flex items-end gap-[2px] sm:gap-[3px] flex-1 min-w-0 border-b-[3px] border-ink">
                {Array.from({ length: p.values[k] }, (_, j) => (
                  <span key={j} className="block w-[10px] h-4 sm:w-5 sm:h-6 mb-1 rounded-[3px] sm:rounded-[4px] border-2 border-ink bg-[#c8925a]" />
                ))}
                <Engine size={48} color={c.color} number={c.number} className="w-9 h-auto sm:w-12 shrink-0" />
              </span>
              <span className="w-7 sm:w-9 text-right font-extrabold text-xl sm:text-2xl tabular-nums shrink-0">{p.values[k]}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {p.crew.map((c, k) => (
            <div key={c.name} className="w-[5.6rem] sm:w-28 rounded-2xl border-[3px] border-ink bg-sky px-2 py-3 flex flex-col items-center">
              <Engine size={52} color={c.color} number={c.number} />
              <span className="font-extrabold mt-1">{c.name}</span>
              <span className="font-extrabold text-3xl tabular-nums leading-tight">{p.values[k]}</span>
              <span className="text-sm font-bold text-ink/65">{L('wagons', 'trucks')}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {p.options.map(o => {
          const state = picked === null ? 'idle' : o === p.mean ? 'right' : o === picked ? 'picked-wrong' : 'other';
          return (
            <button key={o} onClick={() => answer(o)} disabled={picked !== null} className={`${answerClass(state)} py-3! text-[1.8rem] tabular-nums`}>
              {o}
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
