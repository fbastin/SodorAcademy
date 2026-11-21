import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import ExerciseFrame, { Feedback, answerClass } from './ExerciseFrame';
import { Engine } from './ui';

// The least common multiple, with the timetable of Knapford: Thomas leaves every
// a minutes, Percy every b minutes; they leave together at 8:00. When do they next
// leave together? Primary: two numbers from 2 to 8. Secondary: two numbers from 4
// to 15, or three engines with numbers from 2 to 8. Four answers to choose from.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

interface Problem { nums: number[]; L: number; options: number[] }

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

const ENGINES = [
  { name: 'Thomas', color: '#2464d6', number: '1' },
  { name: 'Percy', color: '#1c7a55', number: '6' },
  { name: 'James', color: '#e23b2e', number: '5' },
];

function makeProblem(grade: Grade, prev?: Problem): Problem {
  let nums: number[];
  const three = grade === 'Secondary' && Math.random() < 0.3;
  const same = (q?: Problem) => !!q && q.nums.join() === nums.join();
  do {
    if (three) {
      nums = [rnd(2, 8), rnd(2, 8), rnd(2, 8)];
    } else if (grade === 'Primary') {
      nums = [rnd(2, 8), rnd(2, 8)];
    } else {
      nums = [rnd(4, 15), rnd(4, 15)];
    }
  } while (
    new Set(nums).size !== nums.length || same(prev)
    || nums.reduce(lcm) > (grade === 'Primary' ? 40 : three ? 60 : 120)
    // Secondary: mostly numbers that are not multiples of each other
    || (grade === 'Secondary' && !three && (nums[0] % nums[1] === 0 || nums[1] % nums[0] === 0) && Math.random() < 0.8)
  );
  const L = nums.reduce(lcm);
  const product = nums.reduce((a, b) => a * b, 1);
  const g = nums.reduce(gcd);
  const max = Math.max(...nums), min = Math.min(...nums);
  // Likely mistakes: the product (a common multiple, not the least), the GCD, the
  // biggest number, a common multiple further on, near misses.
  const mistakes = [product, ...[g, max, 2 * L, L + min, L - min, nums.reduce((a, b) => a + b, 0)].sort(() => Math.random() - 0.5)];
  const options = new Set<number>([L]);
  for (const m of mistakes) if (options.size < 4 && m > 1 && m !== L) options.add(m);
  for (let k = 1; options.size < 4; k++) options.add(L + k);
  return { nums, L, options: [...options].sort((a, b) => a - b) };
}

// The departure time, L minutes after 8:00.
const clock = (L: number, fr: boolean) => {
  const h = 8 + Math.floor(L / 60), m = L % 60;
  return fr ? `${h} h ${String(m).padStart(2, '0')}` : `${h}:${String(m).padStart(2, '0')}`;
};

// The multiples of n up to L, with L on yellow.
function Row({ n, L, fr }: { n: number; L: number; fr: boolean }) {
  const list = Array.from({ length: L / n }, (_, k) => n * (k + 1));
  return (
    <p className="m-0 flex flex-wrap items-center gap-1.5">
      <span className="font-bold mr-1">{fr ? `Table de ${n} :` : `${n} times table:`}</span>
      {list.map(m => (
        <span key={m} className={`chip text-[0.95rem]! ${m === L ? 'bg-sticker!' : ''}`}>{m}</span>
      ))}
    </p>
  );
}

export default function LCMExercise({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
  const { lang } = useLang();
  const fr = lang === 'fr';
  const [p, setP] = useState<Problem>(() => makeProblem(grade));
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);

  const next = () => { setP(q => makeProblem(grade, q)); setPicked(null); setKey(k => k + 1); };
  useEffect(() => { next(); }, [grade]);

  const ok = picked === p.L;
  const answer = (o: number) => {
    if (picked !== null) return;
    setPicked(o);
    if (o === p.L) {
      const n = answered + 1;
      setAnswered(n);
      if (n >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
    }
  };

  const engines = p.nums.map((n, k) => ({ ...ENGINES[k], n }));
  const names = (and: string) => engines.map(e => e.name).join(', ').replace(/, ([^,]*)$/, ` ${and} $1`);
  const list = p.nums.join(', ');
  const product = p.nums.reduce((a, b) => a * b, 1);
  const g = p.nums.reduce(gcd);
  const common = (x: number) => p.nums.every(n => x % n === 0);
  const fn = fr ? 'PPCM' : 'LCM';

  const hint = picked === null || ok ? null
    : common(picked)
      ? (picked === product && p.nums.length === 2
        ? (fr ? <>{p.nums[0]} × {p.nums[1]} = {product} est bien un multiple commun, mais il y en a un plus petit.</> : <>{p.nums[0]} × {p.nums[1]} = {product} is a common multiple, but there is a smaller one.</>)
        : (fr ? <>{picked} est bien un multiple commun, mais ce n’est pas le plus petit.</> : <>{picked} is a common multiple, but not the smallest one.</>))
      : picked === g && g > 1
        ? (fr ? <>{g} est le PGCD : le plus grand nombre qui <i>divise</i> {list}. Le PPCM, lui, est dans la table de chacun.</> : <>{g} is the GCD: the biggest number that <i>divides</i> {list}. The LCM is in each of their times tables.</>)
        : (fr
          ? <>{picked} n’est pas un multiple de {p.nums.filter(n => picked % n !== 0).join(' ni de ')}.</>
          : <>{picked} is not a multiple of {p.nums.filter(n => picked % n !== 0).join(' or ')}.</>);

  const feedback: Feedback = picked === null ? null : ok ? { ok: true } : {
    ok: false,
    explain: (
      <div className="space-y-3">
        {hint && <p className="m-0 font-bold">{hint}</p>}
        <p className="m-0">{fr ? 'On écrit les tables jusqu’au premier nombre qui est dans toutes :' : 'Write out the times tables up to the first number that is in all of them:'}</p>
        <div className="space-y-2 pl-2">
          {p.nums.map(n => <React.Fragment key={n}><Row n={n} L={p.L} fr={fr} /></React.Fragment>)}
        </div>
        <p className="m-0">
          {fr
            ? <><b>{fn}({list}) = {p.L}</b>. {names('et')} repartiront ensemble au bout de {p.L} minutes, à {clock(p.L, true)}.</>
            : <><b>{fn}({list}) = {p.L}</b>. {names('and')} will leave together again after {p.L} minutes, at {clock(p.L, false)}.</>}
        </p>
        <p className="m-0 text-[0.98rem] text-ink/80">
          {fr
            ? `Astuce : écris seulement la table du plus grand nombre, ${Math.max(...p.nums)}, et arrête-toi au premier nombre que ${p.nums.length > 2 ? 'les autres divisent' : `${Math.min(...p.nums)} divise`}.`
            : `Tip: write only the times table of the biggest number, ${Math.max(...p.nums)}, and stop at the first number that ${p.nums.length > 2 ? 'the others divide' : `${Math.min(...p.nums)} divides`}.`}
        </p>
      </div>
    ),
  };

  const every = (e: { name: string; n: number }) => fr ? `${e.name} part toutes les ${e.n} minutes` : `${e.name} leaves every ${e.n} minutes`;
  const story = fr
    ? `À Knapford, ${engines.map(every).join(', ').replace(/, ([^,]*)$/, ' et $1')}. Ils partent ensemble à 8 h. Au bout de combien de minutes repartiront-ils ensemble ?`
    : `At Knapford, ${engines.map(every).join(', ').replace(/, ([^,]*)$/, ' and $1')}. They leave together at 8:00. After how many minutes will they next leave together?`;

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={fr ? 'Le plus petit commun multiple' : 'The least common multiple'}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(story, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">{story}</h2>
      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8 mb-5">
        {engines.map(e => (
          <div key={e.name} className="flex flex-col items-center gap-1.5">
            <Engine size={76} color={e.color} number={e.number} />
            <span className="font-extrabold">{e.name}</span>
            <span className="chip text-[0.95rem]!">{fr ? `toutes les ${e.n} min` : `every ${e.n} min`}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-[2rem] font-extrabold mb-7 flex items-center justify-center gap-3 flex-wrap">
        {fn}({list}) =
        <span className="w-16 h-14 rounded-xl border-[3px] border-dashed border-[#e23b2e] text-[#e23b2e] inline-flex items-center justify-center">?</span>
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {p.options.map(o => {
          const state = picked === null ? 'idle' : o === p.L ? 'right' : o === picked ? 'picked-wrong' : 'other';
          return (
            <button key={o} onClick={() => answer(o)} disabled={picked !== null} className={`${answerClass(state)} text-[1.8rem]`}
              aria-label={`${o} minutes`}>
              {o}
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
