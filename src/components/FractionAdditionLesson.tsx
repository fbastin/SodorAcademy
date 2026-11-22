import React, { useState } from 'react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { Frac } from './ExerciseFrame';
import { Engine } from './ui';
import { STATIONS } from '../content/stations';

// Adding fractions with Percy: what a fraction is, the same denominator, equal
// fractions, a common denominator, simplifying, and a whole number plus a fraction.
// The fraction bars below are also drawn by the exercises on adding fractions.

const INK = '#17233d';
export const YELLOW = '#ffd23f';
export const BLUE = '#2464d6';
export const GREEN = '#1c7a55';
const math = STATIONS.find(s => s.id === 'math')!;

// The arithmetic shared by the exercises on adding fractions.
export type Fr = [number, number];
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
export const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
export const reduce = ([n, d]: Fr): Fr => { const g = gcd(n, d); return [n / g, d / g]; };
export const frKey = ([n, d]: Fr) => `${n}/${d}`;

// Four answers to choose from: the right one; the same answer not simplified, when
// the exercise asks to simplify (`same`); then the likely mistakes; then near misses.
// No two answers but `same` and the right one are worth the same.
export function fractionOptions(right: Fr, mistakes: Fr[], near: () => Fr, same?: Fr | null): Fr[] {
  const out: Fr[] = [right];
  const eq = (a: Fr, b: Fr) => a[0] * b[1] === b[0] * a[1];
  if (same && frKey(same) !== frKey(right)) out.push(same);
  const add = (f: Fr) => {
    if (out.length < 4 && Number.isInteger(f[0]) && Number.isInteger(f[1]) && f[0] > 0 && f[1] >= 2 && !out.some(o => eq(o, f))) out.push(f);
  };
  mistakes.forEach(add);
  for (let i = 0; out.length < 4 && i < 80; i++) add(near());
  for (let k = 1; out.length < 4; k++) add([right[0] + k, right[1]]);
  return out.sort(() => Math.random() - 0.5);
}

// A fraction inside a text of a step: stacked, and read "3 over 4" aloud.
export const inlineFrac = (n: number, d: number, lang: Lang) =>
  `<span class="inline-flex flex-col items-center align-middle leading-none text-[0.85em] font-extrabold mx-0.5">` +
  `<span class="px-1 pb-0.5 border-b-[2.5px] border-current">${n}</span>` +
  `<span class="sr-only">${lang === 'fr' ? ' sur ' : ' over '}</span>` +
  `<span class="px-1 pt-0.5">${d}</span></span>`;
const Ff = (n: number, d: number) => inlineFrac(n, d, 'fr');
const Fe = (n: number, d: number) => inlineFrac(n, d, 'en');

// What a bar shows, for a screen reader.
export const barLabel = (n: number, d: number, lang: Lang) =>
  lang === 'fr' ? `Une barre de ${d} parts égales, dont ${n} coloriée${n > 1 ? 's' : ''}` : `A bar of ${d} equal parts, ${n} coloured`;

// A bar cut into d equal parts, coloured from the left: fills = [how many parts, colour].
// With `group`, a thick line every `group` parts shows the bigger parts it was cut from.
export function FractionBar({ d, fills, group = 0, label, className = '' }: {
  d: number;
  fills: [number, string][];
  group?: number;
  label?: string;
  className?: string;
}) {
  const colours: string[] = [];
  for (const [n, c] of fills) for (let k = 0; k < n; k++) colours.push(c);
  return (
    <div role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      className={`flex h-10 w-full rounded-lg border-[3px] border-ink overflow-hidden bg-white ${className}`}>
      {Array.from({ length: d }, (_, k) => (
        <span key={k} className="flex-1 h-full" style={{
          background: colours[k] ?? '#fff',
          borderLeft: k === 0 ? undefined : group > 0 && k % group !== 0 ? '1.5px solid rgba(23,35,61,.38)' : `2.5px solid ${INK}`,
        }} />
      ))}
    </div>
  );
}

// Several wholes in a row: the coloured parts run on from one bar to the next.
export function FractionBars({ d, fills, label }: { d: number; fills: [number, string][]; label?: string }) {
  const total = fills.reduce((s, [n]) => s + n, 0);
  const bars = Math.max(1, Math.ceil(total / d));
  const colours: string[] = [];
  for (const [n, c] of fills) for (let k = 0; k < n; k++) colours.push(c);
  return (
    <div role={label ? 'img' : undefined} aria-label={label} className="flex flex-wrap gap-2">
      {Array.from({ length: bars }, (_, b) => {
        const part = colours.slice(b * d, (b + 1) * d);
        const runs: [number, string][] = [];
        for (const c of part) {
          const last = runs[runs.length - 1];
          if (last && last[1] === c) last[0]++;
          else runs.push([1, c]);
        }
        return (
          <React.Fragment key={b}>
            <div className="flex-1 min-w-[7rem]"><FractionBar d={d} fills={runs} /></div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// A line of a picture: a sign and a fraction on the left, its bar on the right.
export function BarRow({ sign, label, children }: { sign?: string; label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="w-36 sm:w-44 shrink-0 flex items-center justify-end gap-2 text-[1.45rem] sm:text-[1.6rem] font-extrabold">
        {sign && <span className="text-[#2464d6]">{sign}</span>}
        {label}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5 space-y-3 max-w-2xl">{children}</div>
);

// Percy's van, cut into equal parts: click on the parts to fill them.
function FractionMaker({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const [d, setD] = useState(4);
  const [n, setN] = useState(1);
  const setParts = (v: number) => {
    const dd = Math.max(2, Math.min(10, v));
    setD(dd);
    setN(x => Math.min(x, dd));
  };
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-3 font-bold">
        <span>{fr ? 'Nombre de parts égales :' : 'Number of equal parts:'}</span>
        <button onClick={() => setParts(d - 1)} disabled={d <= 2} className="chunky p-0! w-10 h-10 text-xl"
          aria-label={fr ? 'Moins de parts' : 'Fewer parts'}>−</button>
        <span className="chip text-base!" aria-live="polite">{d}</span>
        <button onClick={() => setParts(d + 1)} disabled={d >= 10} className="chunky p-0! w-10 h-10 text-xl"
          aria-label={fr ? 'Plus de parts' : 'More parts'}>+</button>
      </div>
      <div className="flex items-end gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex h-16 rounded-xl border-[3px] border-ink overflow-hidden bg-white">
            {Array.from({ length: d }, (_, k) => (
              <button key={k} onClick={() => setN(k + 1 === n ? k : k + 1)} aria-pressed={k < n}
                aria-label={fr ? `Part ${k + 1} sur ${d}` : `Part ${k + 1} of ${d}`}
                className="flex-1 h-full cursor-pointer hover:brightness-95"
                style={{ background: k < n ? YELLOW : '#fff', borderLeft: k === 0 ? undefined : `2.5px solid ${INK}` }} />
            ))}
          </div>
          <div className="flex justify-around px-6" aria-hidden="true">
            <span className="w-5 h-5 -mt-1 rounded-full bg-[#555] border-[2.5px] border-ink" />
            <span className="w-5 h-5 -mt-1 rounded-full bg-[#555] border-[2.5px] border-ink" />
          </div>
        </div>
        <Engine size={84} color={GREEN} number="6" className="shrink-0 mb-0.5" />
      </div>
      <div className="flex items-center gap-4 sm:gap-6 pt-1">
        <span className="text-[2.6rem] text-ink"><Frac n={n} d={d} /></span>
        <div className="text-[1.02rem] leading-snug space-y-2">
          <p className="m-0"><b>{fr ? 'Numérateur' : 'Numerator'} = {n}</b>{fr ? ` : ${n} ${n > 1 ? 'parts pleines' : 'part pleine'}` : `: ${n} full part${n === 1 ? '' : 's'}`}</p>
          <p className="m-0"><b>{fr ? 'Dénominateur' : 'Denominator'} = {d}</b>{fr ? ` : ${d} parts en tout` : `: ${d} parts in all`}</p>
        </div>
      </div>
    </Panel>
  );
}

// 1/5 + 2/5 = 3/5: the same parts, so we count them.
function SameDenominator({ lang }: { lang: Lang }) {
  return (
    <Panel>
      <BarRow label={<Frac n={1} d={5} />}><FractionBar d={5} fills={[[1, YELLOW]]} label={barLabel(1, 5, lang)} /></BarRow>
      <BarRow sign="+" label={<Frac n={2} d={5} />}><FractionBar d={5} fills={[[2, BLUE]]} label={barLabel(2, 5, lang)} /></BarRow>
      <BarRow sign="=" label={<Frac n={3} d={5} />}><FractionBar d={5} fills={[[1, YELLOW], [2, BLUE]]} label={barLabel(3, 5, lang)} /></BarRow>
    </Panel>
  );
}

// Cut every part again: the fraction changes its name, not its size.
function Cutter({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const bases: [number, number][] = [[1, 2], [1, 3], [2, 3], [3, 4]];
  const [b, setB] = useState(0);
  const [k, setK] = useState(2);
  const [n, d] = bases[b];
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2.5 font-bold">
        <span className="mr-1">{fr ? 'La fraction :' : 'The fraction:'}</span>
        {bases.map(([bn, bd], i) => (
          <React.Fragment key={i}>
            <button onClick={() => setB(i)} aria-pressed={b === i} className="chunky py-1! text-lg" aria-label={`${bn}/${bd}`}>
              <Frac n={bn} d={bd} />
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 font-bold">
        <span className="mr-1">{fr ? 'Recouper chaque part en :' : 'Cut each part into:'}</span>
        {[2, 3, 4].map(f => (
          <React.Fragment key={f}>
            <button onClick={() => setK(f)} aria-pressed={k === f} className="chunky text-lg">{f}</button>
          </React.Fragment>
        ))}
      </div>
      <BarRow label={<Frac n={n} d={d} />}><FractionBar d={d} fills={[[n, YELLOW]]} label={barLabel(n, d, lang)} /></BarRow>
      <BarRow sign="=" label={<Frac n={n * k} d={d * k} />}>
        <FractionBar d={d * k} fills={[[n * k, YELLOW]]} group={k} label={barLabel(n * k, d * k, lang)} />
      </BarRow>
      <p className="m-0 flex flex-wrap items-center justify-center gap-2.5 text-[1.5rem] font-extrabold pt-1">
        <Frac n={n} d={d} /> = <Frac n={`${n} × ${k}`} d={`${d} × ${k}`} /> = <span className="px-1.5 rounded-lg bg-note"><Frac n={n * k} d={d * k} /></span>
      </p>
    </Panel>
  );
}

// 1/2 + 1/4: cut the half in two first.
function DifferentDenominators({ lang }: { lang: Lang }) {
  return (
    <Panel>
      <BarRow label={<><Frac n={1} d={2} /> = <Frac n={2} d={4} /></>}>
        <FractionBar d={4} fills={[[2, YELLOW]]} group={2} label={barLabel(2, 4, lang)} />
      </BarRow>
      <BarRow sign="+" label={<Frac n={1} d={4} />}><FractionBar d={4} fills={[[1, BLUE]]} label={barLabel(1, 4, lang)} /></BarRow>
      <BarRow sign="=" label={<Frac n={3} d={4} />}><FractionBar d={4} fills={[[2, YELLOW], [1, BLUE]]} label={barLabel(3, 4, lang)} /></BarRow>
    </Panel>
  );
}

// 1/6 + 1/3 = 3/6, and 3/6 is one half.
function Simplify({ lang }: { lang: Lang }) {
  return (
    <Panel>
      <BarRow label={<Frac n={1} d={6} />}><FractionBar d={6} fills={[[1, YELLOW]]} label={barLabel(1, 6, lang)} /></BarRow>
      <BarRow sign="+" label={<><Frac n={1} d={3} /> = <Frac n={2} d={6} /></>}>
        <FractionBar d={6} fills={[[2, BLUE]]} group={2} label={barLabel(2, 6, lang)} />
      </BarRow>
      <BarRow sign="=" label={<Frac n={3} d={6} />}>
        <FractionBar d={6} fills={[[1, YELLOW], [2, BLUE]]} group={3} label={barLabel(3, 6, lang)} />
      </BarRow>
      <BarRow sign="=" label={<span className="px-1.5 rounded-lg bg-note"><Frac n={1} d={2} /></span>}>
        <FractionBar d={2} fills={[[1, GREEN]]} label={barLabel(1, 2, lang)} />
      </BarRow>
      <p className="m-0 flex flex-wrap items-center justify-center gap-2.5 text-[1.5rem] font-extrabold pt-1">
        <Frac n={3} d={6} /> = <Frac n="3 ÷ 3" d="6 ÷ 3" /> = <Frac n={1} d={2} />
      </p>
    </Panel>
  );
}

// Gordon's 2 full trucks and 3/4 of another: 11 quarters.
function WholeAndPart({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  return (
    <Panel>
      <BarRow label={<>1 = <Frac n={4} d={4} /></>}><FractionBar d={4} fills={[[4, BLUE]]} label={barLabel(4, 4, lang)} /></BarRow>
      <BarRow sign="+" label={<>1 = <Frac n={4} d={4} /></>}><FractionBar d={4} fills={[[4, BLUE]]} label={barLabel(4, 4, lang)} /></BarRow>
      <BarRow sign="+" label={<Frac n={3} d={4} />}><FractionBar d={4} fills={[[3, YELLOW]]} label={barLabel(3, 4, lang)} /></BarRow>
      <BarRow sign="=" label={<span className="px-1.5 rounded-lg bg-note"><Frac n={11} d={4} /></span>}>
        <p className="m-0 text-lg font-bold">4 + 4 + 3 = 11 {fr ? 'quarts' : 'quarters'}</p>
      </BarRow>
    </Panel>
  );
}

const STEPS: LessonStep[] = [
  {
    title: { fr: 'Une fraction, c’est une part d’un tout', en: 'A fraction is part of a whole' },
    body: {
      fr: 'Le wagon de courrier de Percy est coupé en <b>parts égales</b>. Clique sur les parts pour les remplir de lettres. La fraction dit combien de parts sont pleines, et en combien de parts le wagon est coupé.',
      en: 'Percy’s mail van is cut into <b>equal parts</b>. Click on the parts to fill them with letters. The fraction tells you how many parts are full, and how many parts the van is cut into.',
    },
    visual: lang => <FractionMaker lang={lang} />,
    note: {
      fr: 'En haut, le <b>numérateur</b> : les parts que l’on prend. En bas, le <b>dénominateur</b> : le nombre de parts du tout.',
      en: 'On top, the <b>numerator</b>: the parts you take. Underneath, the <b>denominator</b>: how many parts make the whole.',
    },
  },
  {
    title: { fr: 'Des parts de même taille', en: 'Parts of the same size' },
    body: {
      fr: `Le matin, Percy remplit ${Ff(1, 5)} de son wagon. L’après-midi, il en remplit encore ${Ff(2, 5)}. Les parts ont la même taille : il suffit de les compter. 1 part + 2 parts = 3 parts, donc ${Ff(1, 5)} + ${Ff(2, 5)} = ${Ff(3, 5)}.`,
      en: `In the morning, Percy fills ${Fe(1, 5)} of his van. In the afternoon, he fills ${Fe(2, 5)} more. The parts are the same size, so you just count them: 1 part + 2 parts = 3 parts, so ${Fe(1, 5)} + ${Fe(2, 5)} = ${Fe(3, 5)}.`,
    },
    visual: lang => <SameDenominator lang={lang} />,
    note: {
      fr: 'Quand les dénominateurs sont pareils, on additionne les numérateurs et on <b>garde</b> le dénominateur. On n’additionne jamais les dénominateurs : le wagon a toujours 5 parts !',
      en: 'When the denominators are the same, add the numerators and <b>keep</b> the denominator. Never add the denominators: the van still has 5 parts!',
    },
  },
  {
    title: { fr: 'Des fractions égales', en: 'Equal fractions' },
    body: {
      fr: `James remplit une moitié de son wagon : ${Ff(1, 2)}. S’il recoupe chaque part en 2, le wagon a 4 parts, dont 2 pleines : ${Ff(2, 4)}. Le chargement n’a pas bougé ! Choisis une fraction et une façon de recouper pour voir.`,
      en: `James fills one half of his truck: ${Fe(1, 2)}. If he cuts each part in 2 again, the truck has 4 parts, and 2 of them are full: ${Fe(2, 4)}. The load has not moved! Pick a fraction and a way to cut it to see.`,
    },
    visual: lang => <Cutter lang={lang} />,
    note: {
      fr: `Si on multiplie le numérateur <b>et</b> le dénominateur par le même nombre, on obtient une fraction égale : ${Ff(1, 2)} = ${Ff(2, 4)} = ${Ff(3, 6)}.`,
      en: `If you multiply the numerator <b>and</b> the denominator by the same number, you get an equal fraction: ${Fe(1, 2)} = ${Fe(2, 4)} = ${Fe(3, 6)}.`,
    },
  },
  {
    title: { fr: 'Des parts de tailles différentes', en: 'Parts of different sizes' },
    body: {
      fr: `Percy remplit ${Ff(1, 2)} de son wagon avec des lettres, puis ${Ff(1, 4)} avec des colis. Une moitié est plus grande qu’un quart : on ne peut pas compter les parts tout de suite. Il faut des parts de même taille, donc un <b>dénominateur commun</b>. Ici, 4 convient : ${Ff(1, 2)} = ${Ff(2, 4)}, puis ${Ff(2, 4)} + ${Ff(1, 4)} = ${Ff(3, 4)}.`,
      en: `Percy fills ${Fe(1, 2)} of his van with letters, then ${Fe(1, 4)} with parcels. A half is bigger than a quarter, so you cannot count the parts straight away. You need parts of the same size: a <b>common denominator</b>. Here, 4 works: ${Fe(1, 2)} = ${Fe(2, 4)}, then ${Fe(2, 4)} + ${Fe(1, 4)} = ${Fe(3, 4)}.`,
    },
    visual: lang => <DifferentDenominators lang={lang} />,
    note: {
      fr: `Un dénominateur commun est dans la table des deux dénominateurs. Le plus pratique est leur <b>plus petit commun multiple (PPCM)</b>. Pour ${Ff(1, 3)} + ${Ff(1, 4)} : PPCM(3, 4) = 12, donc ${Ff(4, 12)} + ${Ff(3, 12)} = ${Ff(7, 12)}.`,
      en: `A common denominator is in the times tables of both denominators. The handiest one is their <b>least common multiple (LCM)</b>. For ${Fe(1, 3)} + ${Fe(1, 4)}: LCM(3, 4) = 12, so ${Fe(4, 12)} + ${Fe(3, 12)} = ${Fe(7, 12)}.`,
    },
  },
  {
    title: { fr: 'Simplifier le résultat', en: 'Simplifying the answer' },
    body: {
      fr: `Percy livre ${Ff(1, 6)} du courrier à Elsbridge et ${Ff(1, 3)} à Ffarquhar. Le dénominateur commun est 6, car ${Ff(1, 3)} = ${Ff(2, 6)}. Il a donc livré ${Ff(1, 6)} + ${Ff(2, 6)} = ${Ff(3, 6)} du courrier. Regarde la barre : c’est juste la moitié ! On <b>simplifie</b> : ${Ff(3, 6)} = ${Ff(1, 2)}.`,
      en: `Percy delivers ${Fe(1, 6)} of the mail to Elsbridge and ${Fe(1, 3)} to Ffarquhar. The common denominator is 6, because ${Fe(1, 3)} = ${Fe(2, 6)}. So he has delivered ${Fe(1, 6)} + ${Fe(2, 6)} = ${Fe(3, 6)} of the mail. Look at the bar: that is exactly one half! You <b>simplify</b>: ${Fe(3, 6)} = ${Fe(1, 2)}.`,
    },
    visual: lang => <Simplify lang={lang} />,
    note: {
      fr: 'Pour simplifier, on divise le numérateur et le dénominateur par le même nombre : 3 ÷ 3 = 1 et 6 ÷ 3 = 2. On s’arrête quand aucun nombre plus grand que 1 ne divise les deux.',
      en: 'To simplify, divide the numerator and the denominator by the same number: 3 ÷ 3 = 1 and 6 ÷ 3 = 2. Stop when no number bigger than 1 divides both.',
    },
  },
  {
    title: { fr: 'Un entier plus une fraction', en: 'A whole number plus a fraction' },
    body: {
      fr: `Gordon tire 2 wagons de charbon pleins et ${Ff(3, 4)} d’un troisième wagon. Combien de wagons en tout ? Un wagon entier, c’est 4 quarts : 1 = ${Ff(4, 4)}. Donc 2 = ${Ff(8, 4)}, et 2 + ${Ff(3, 4)} = ${Ff(8, 4)} + ${Ff(3, 4)} = ${Ff(11, 4)}.`,
      en: `Gordon pulls 2 full trucks of coal and ${Fe(3, 4)} of a third truck. How many trucks is that? A whole truck is 4 quarters: 1 = ${Fe(4, 4)}. So 2 = ${Fe(8, 4)}, and 2 + ${Fe(3, 4)} = ${Fe(8, 4)} + ${Fe(3, 4)} = ${Fe(11, 4)}.`,
    },
    visual: lang => <WholeAndPart lang={lang} />,
    note: {
      fr: `Pour ajouter un entier, écris-le avec le dénominateur de la fraction : multiplie l’entier par ce dénominateur. 2 × 4 = 8, donc 2 = ${Ff(8, 4)}.`,
      en: `To add a whole number, write it with the denominator of the fraction: multiply the whole number by that denominator. 2 × 4 = 8, so 2 = ${Fe(8, 4)}.`,
    },
  },
];

const LINKS = math.links.filter(l => l.href.includes('fractions/adding-fractions') || l.href.includes('/Practice/'));

export default function FractionAdditionLesson({ onCancel, onStartExercise, color }: {
  onCancel: () => void;
  onStartExercise?: () => void;
  color?: string;
  place?: string;
}) {
  return (
    <LessonPlayer
      title={{ fr: 'Additionner des fractions', en: 'Adding Fractions' }}
      color={color || math.color}
      steps={STEPS}
      links={LINKS}
      onStartExercise={onStartExercise}
      onCancel={onCancel}
    />
  );
}
