import React, { useEffect, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang, pick } from '../i18n';
import ExerciseFrame, { Feedback, answerClass } from './ExerciseFrame';

// Average problems to read and solve, on Sodor: Gordon's trucks, the price of Sir
// Topham Hatt's engines, Thomas's speed, the weight of coal trucks, Percy's
// letters, Emily's passengers. At Secondary, some averages have decimals, and Toby
// asks the problem the other way round: what is missing to reach a given average?
// Four answers.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

type Bi = { fr: string; en: string };

interface Template {
  n: number;
  P: [number, number, number];          // Primary: lowest and highest average, spread of the values
  S: [number, number, number];          // Secondary
  scale?: number;                        // Primary values are multiples of this
  decimals?: boolean;                    // at Secondary, the average may have decimals
  inverse?: boolean;                     // find the missing value (Secondary only)
  labels: { fr: string[]; en: string[] };
  per: Bi;                               // what we divide by
  story: (v: number[], m: number) => Bi;
  ask: Bi;
  result: (m: string) => Bi;
}

const DAYS = { fr: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'], en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] };

const TEMPLATES: Template[] = [
  {
    n: 3, P: [5, 12, 4], S: [10, 29, 8],
    labels: { fr: DAYS.fr.slice(0, 3), en: DAYS.en.slice(0, 3) },
    per: { fr: 'jours', en: 'days' },
    story: v => ({
      fr: `Gordon a tiré ${v[0]} wagons lundi, ${v[1]} mardi et ${v[2]} mercredi.`,
      en: `Gordon pulled ${v[0]} trucks on Monday, ${v[1]} on Tuesday and ${v[2]} on Wednesday.`,
    }),
    ask: { fr: 'En moyenne, combien de wagons a-t-il tirés par jour ?', en: 'On average, how many trucks did he pull each day?' },
    result: m => ({ fr: `En moyenne, ${m} wagons par jour.`, en: `On average, ${m} trucks a day.` }),
  },
  {
    n: 4, P: [5, 12, 4], S: [10, 29, 8],
    labels: { fr: ['1re', '2e', '3e', '4e'], en: ['1st', '2nd', '3rd', '4th'] },
    per: { fr: 'locomotives', en: 'engines' },
    story: v => ({
      fr: `Sir Topham Hatt achète 4 nouvelles locomotives. Elles coûtent ${v[0]}, ${v[1]}, ${v[2]} et ${v[3]} pièces d’or.`,
      en: `Sir Topham Hatt buys 4 new engines. They cost ${v[0]}, ${v[1]}, ${v[2]} and ${v[3]} gold coins.`,
    }),
    ask: { fr: 'Quel est le prix moyen d’une locomotive, en pièces d’or ?', en: 'What is the average price of an engine, in gold coins?' },
    result: m => ({ fr: `Une locomotive coûte en moyenne ${m} pièces d’or.`, en: `An engine costs ${m} gold coins on average.` }),
  },
  {
    n: 3, P: [3, 8, 2], S: [25, 60, 10], scale: 10,
    labels: { fr: ['1re heure', '2e heure', '3e heure'], en: ['1st hour', '2nd hour', '3rd hour'] },
    per: { fr: 'heures', en: 'hours' },
    story: v => ({
      fr: `Thomas a parcouru ${v[0]} km pendant la première heure, ${v[1]} km pendant la deuxième et ${v[2]} km pendant la troisième.`,
      en: `Thomas travelled ${v[0]} km in the first hour, ${v[1]} km in the second and ${v[2]} km in the third.`,
    }),
    ask: { fr: 'Quelle a été sa vitesse moyenne, en km par heure ?', en: 'What was his average speed, in km per hour?' },
    result: m => ({ fr: `Sa vitesse moyenne était de ${m} km/h.`, en: `His average speed was ${m} km/h.` }),
  },
  {
    n: 5, P: [5, 12, 4], S: [10, 29, 8], decimals: true,
    labels: { fr: ['Wagon 1', 'Wagon 2', 'Wagon 3', 'Wagon 4', 'Wagon 5'], en: ['Truck 1', 'Truck 2', 'Truck 3', 'Truck 4', 'Truck 5'] },
    per: { fr: 'wagons', en: 'trucks' },
    story: v => ({
      fr: `Cinq wagons de charbon pèsent ${v[0]}, ${v[1]}, ${v[2]}, ${v[3]} et ${v[4]} tonnes.`,
      en: `Five coal trucks weigh ${v[0]}, ${v[1]}, ${v[2]}, ${v[3]} and ${v[4]} tonnes.`,
    }),
    ask: { fr: 'Quel est le poids moyen d’un wagon, en tonnes ?', en: 'What is the average weight of a truck, in tonnes?' },
    result: m => ({ fr: `Un wagon pèse en moyenne ${m} tonnes.`, en: `A truck weighs ${m} tonnes on average.` }),
  },
  {
    n: 3, P: [5, 12, 4], S: [10, 29, 8],
    labels: { fr: ['Ffarquhar', 'Elsbridge', 'Knapford'], en: ['Ffarquhar', 'Elsbridge', 'Knapford'] },
    per: { fr: 'gares', en: 'stations' },
    story: v => ({
      fr: `Percy a livré ${v[0]} lettres à Ffarquhar, ${v[1]} à Elsbridge et ${v[2]} à Knapford.`,
      en: `Percy delivered ${v[0]} letters to Ffarquhar, ${v[1]} to Elsbridge and ${v[2]} to Knapford.`,
    }),
    ask: { fr: 'En moyenne, combien de lettres a-t-il livrées par gare ?', en: 'On average, how many letters did he deliver per station?' },
    result: m => ({ fr: `En moyenne, ${m} lettres par gare.`, en: `On average, ${m} letters per station.` }),
  },
  {
    n: 4, P: [5, 12, 4], S: [10, 29, 8], decimals: true,
    labels: { fr: ['Knapford', 'Tidmouth', 'Vicarstown', 'Wellsworth'], en: ['Knapford', 'Tidmouth', 'Vicarstown', 'Wellsworth'] },
    per: { fr: 'gares', en: 'stations' },
    story: v => ({
      fr: `Emily compte les passagers qui montent dans son train : ${v[0]} à Knapford, ${v[1]} à Tidmouth, ${v[2]} à Vicarstown et ${v[3]} à Wellsworth.`,
      en: `Emily counts the passengers getting on her train: ${v[0]} at Knapford, ${v[1]} at Tidmouth, ${v[2]} at Vicarstown and ${v[3]} at Wellsworth.`,
    }),
    ask: { fr: 'En moyenne, combien de passagers sont montés à chaque gare ?', en: 'On average, how many passengers got on at each station?' },
    result: m => ({ fr: `En moyenne, ${m} passagers par gare.`, en: `On average, ${m} passengers per station.` }),
  },
  {
    n: 4, P: [0, 0, 0], S: [6, 15, 4], inverse: true,
    labels: DAYS,
    per: { fr: 'jours', en: 'days' },
    story: (v, m) => ({
      fr: `Toby veut livrer en moyenne ${m} bidons de lait par jour pendant 4 jours. Il en a livré ${v[0]} lundi, ${v[1]} mardi et ${v[2]} mercredi.`,
      en: `Toby wants to deliver an average of ${m} milk churns a day over 4 days. He delivered ${v[0]} on Monday, ${v[1]} on Tuesday and ${v[2]} on Wednesday.`,
    }),
    ask: { fr: 'Combien doit-il en livrer jeudi ?', en: 'How many must he deliver on Thursday?' },
    result: m => ({ fr: `Jeudi, Toby doit livrer ${m} bidons.`, en: `On Thursday, Toby must deliver ${m} churns.` }),
  },
];

interface Problem {
  t: Template;
  values: number[];       // the values given (all of them, or the first n − 1 for an inverse problem)
  sum: number;            // their sum
  mean: number;           // the average (given, for an inverse problem)
  answer: number;
  median: number | null;
  remDec: number | null;  // 62 ÷ 5 = 12 r 2, written "12.2"
  options: number[];
}

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);
const r2 = (x: number) => Math.round(x * 100) / 100;

// n values that add up to `sum`, scattered around `center`.
function makeValues(n: number, sum: number, center: number, spread: number): number[] {
  for (;;) {
    const v = Array.from({ length: n - 1 }, () => center + rnd(-spread, spread));
    v.push(sum - v.reduce((a, b) => a + b, 0));
    if (v.every(x => x >= 1 && x <= center + 2 * spread) && new Set(v).size > 1) return shuffle(v);
  }
}

function fill(options: Set<number>, first: number[], typical: number[], right: number) {
  for (const w of [...first, ...shuffle(typical)]) if (options.size < 3 && w > 0) options.add(w);
  while (options.size < 4) {
    const w = r2(right + (Math.random() < 0.5 ? -1 : 1) * rnd(1, 3));
    if (w > 0) options.add(w);
  }
  return [...options].sort((a, b) => a - b);
}

function makeProblem(grade: Grade): Problem {
  const primary = grade === 'Primary';
  const pool = TEMPLATES.filter(t => !(primary && t.inverse));
  const t = pool[rnd(0, pool.length - 1)];

  if (t.inverse) {
    const [lo, hi, spread] = t.S;
    for (;;) {
      const mean = rnd(lo, hi);
      const values = Array.from({ length: t.n - 1 }, () => mean + rnd(-spread, spread));
      const sum = values.reduce((a, b) => a + b, 0);
      const answer = t.n * mean - sum;
      if (answer < 1 || answer > 2 * mean || answer === mean) continue;
      const typical = [t.n * mean, answer + (Math.random() < 0.5 ? -1 : 1)];
      if (sum % (t.n - 1) === 0) typical.push(sum / (t.n - 1));
      const options = fill(new Set([answer]), [mean], typical, answer);
      return { t, values, sum, mean, answer, median: null, remDec: null, options };
    }
  }

  const [lo, hi, spread] = primary ? t.P : t.S;
  const scale = primary ? t.scale ?? 1 : 1;
  const n = t.n;
  const base = rnd(lo, hi);
  const extra = !primary && t.decimals && Math.random() < 0.5 ? rnd(1, n - 1) : 0;
  const sum0 = n * base + extra;
  const values = makeValues(n, sum0, base, Math.min(spread, base - 1)).map(v => v * scale);
  const sum = sum0 * scale;
  const mean = r2(sum / n);
  const sorted = [...values].sort((a, b) => a - b);
  const median = n % 2 ? sorted[(n - 1) / 2] : null;
  const q = Math.floor(sum / n), rem = sum % n;
  const remDec = rem ? r2(q + rem / 10) : null;

  const first: number[] = [], typical: number[] = [];
  if (remDec !== null) { first.push(remDec); typical.push(q); }
  if (median !== null) typical.push(median);
  if ((primary ? sum : sum * 100) % (n - 1) === 0) typical.push(r2(sum / (n - 1)));   // whole numbers only at Primary
  typical.push(sum);
  const options = fill(new Set([mean]), first, typical, mean);
  return { t, values, sum, mean, answer: mean, median, remDec, options };
}

export default function ArithmeticMeanWordProblems({ grade, questionsCount = 10, onComplete, onCancel, color, place }: Props) {
  const { lang, tr } = useLang();
  const fr = lang === 'fr';
  const L = (f: string, e: string) => pick({ fr: f, en: e }, lang);
  const fmt = (x: number) => x.toLocaleString(fr ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 2 });
  const [p, setP] = useState<Problem>(() => makeProblem(grade));
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);

  const next = () => { setP(makeProblem(grade)); setPicked(null); setKey(k => k + 1); };
  useEffect(() => { next(); }, [grade]);

  const { t } = p;
  const n = t.n;
  const per = tr(t.per);
  const ok = picked === p.answer;

  const answer = (o: number) => {
    if (picked !== null) return;
    setPicked(o);
    if (o === p.answer) {
      const k = answered + 1;
      setAnswered(k);
      if (k >= questionsCount) setTimeout(() => onComplete('video'), 1300);
    }
  };

  let explain: React.ReactNode = null;
  if (picked !== null && !ok) {
    if (t.inverse) {
      const total = n * p.mean;
      const hint = picked === p.mean ? L(`${p.mean}, c’est la moyenne voulue, pas ce qu’il faut livrer jeudi.`, `${p.mean} is the average he wants, not what he must deliver on Thursday.`)
        : picked === total ? L(`${total}, c’est le total pour les 4 jours. Il faut enlever ce qu’il a déjà livré.`, `${total} is the total for the 4 days. Take away what he has already delivered.`)
        : null;
      explain = (
        <>
          {hint && <p className="mt-0 mb-2">{hint}</p>}
          <p className="m-0">
            {L(`Pour une moyenne de ${p.mean} sur 4 jours, il faut `, `For an average of ${p.mean} over 4 days, he needs `)}
            <b className="tabular-nums">4 × {p.mean} = {total}</b>
            {L(' bidons en tout. Il en a déjà livré ', ' churns in all. He has already delivered ')}
            <b className="tabular-nums">{p.values.join(' + ')} = {p.sum}</b>.{' '}
            {L('Jeudi, il lui en faut donc ', 'So on Thursday he needs ')}
            <b className="tabular-nums">{total} − {p.sum} = {p.answer}</b>.
          </p>
        </>
      );
    } else {
      const q = Math.floor(p.sum / n), rem = p.sum % n;
      const hint = picked === p.sum ? L(`${p.sum}, c’est la somme. Il reste à la partager entre les ${n} ${per} !`, `${p.sum} is the sum. You still need to share it between the ${n} ${per}!`)
        : picked === p.remDec ? L(
          `${p.sum} ÷ ${n} = ${q}, reste ${rem}. Mais le reste ne s’écrit pas après la virgule : on continue la division, et ${rem} ÷ ${n} = ${fmt(r2(rem / n))}.`,
          `${p.sum} ÷ ${n} = ${q} remainder ${rem}. But the remainder does not go after the decimal point: keep dividing, and ${rem} ÷ ${n} = ${fmt(r2(rem / n))}.`)
        : rem && picked === q ? L(`La division ne s’arrête pas à ${q} : il reste ${rem}, alors on continue après la virgule.`, `The division does not stop at ${q}: there is ${rem} left over, so carry on after the decimal point.`)
        : r2(picked * (n - 1)) === p.sum ? L(`Tu as divisé par ${n - 1}, mais il y a ${n} ${per}.`, `You divided by ${n - 1}, but there are ${n} ${per}.`)
        : picked === p.median ? L(`${picked}, c’est le nombre du milieu quand on les range, pas la moyenne.`, `${picked} is the middle number when you put them in order, not the average.`)
        : null;
      explain = (
        <>
          {hint && <p className="mt-0 mb-2">{hint}</p>}
          <p className="m-0">
            {L('On additionne : ', 'Add them up: ')}
            <b className="tabular-nums">{p.values.join(' + ')} = {p.sum}</b>.{' '}
            {L(`Il y a ${n} ${per}, alors on divise par ${n} : `, `There are ${n} ${per}, so divide by ${n}: `)}
            <b className="tabular-nums">{p.sum} ÷ {n} = {fmt(p.mean)}</b>.{' '}
            {tr(t.result(fmt(p.mean)))}
          </p>
        </>
      );
    }
  }
  const feedback: Feedback = picked === null ? null : ok ? { ok: true } : { ok: false, explain };

  const story = tr(t.story(p.values, p.mean));
  const ask = tr(t.ask);
  const labels = t.labels[lang];

  return (
    <ExerciseFrame
      color={color} place={place || (fr ? 'Gare de Knapford' : 'Knapford Station')}
      label={L('La moyenne : problèmes', 'Averages: word problems')}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={() => speak(`${story} ${ask}`, lang)} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <p className="text-lg sm:text-xl mt-0 mb-2 leading-snug">{story}</p>
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">{ask}</h2>

      <div className="rounded-2xl border-[3px] border-ink bg-sky p-3 sm:p-4 mb-6">
        <dl className="m-0 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {labels.map((lab, k) => (
            <div key={lab} className="w-[4.9rem] sm:w-24 flex flex-col items-center">
              <dt className="text-[0.8rem] sm:text-[0.9rem] font-bold text-ink/70 text-center leading-tight mb-1 min-h-[2.1em] flex items-end">{lab}</dt>
              {k < p.values.length ? (
                <dd className="m-0 w-full h-12 rounded-xl border-[3px] border-ink bg-white flex items-center justify-center font-extrabold text-2xl tabular-nums">{p.values[k]}</dd>
              ) : (
                <dd className="m-0 w-full h-12 rounded-xl border-[3px] border-dashed border-[#e23b2e] text-[#e23b2e] flex items-center justify-center font-extrabold text-2xl"
                  aria-label={L('à trouver', 'to find')}>?</dd>
              )}
            </div>
          ))}
        </dl>
        {t.inverse && (
          <p className="mt-3 mb-0 text-center font-bold">
            {L('Moyenne voulue : ', 'Average wanted: ')}<span className="chip text-base! bg-note!">{p.mean}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {p.options.map(o => {
          const state = picked === null ? 'idle' : o === p.answer ? 'right' : o === picked ? 'picked-wrong' : 'other';
          return (
            <button key={o} onClick={() => answer(o)} disabled={picked !== null} className={`${answerClass(state)} py-3! text-[1.7rem] tabular-nums`}>
              {fmt(o)}
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
