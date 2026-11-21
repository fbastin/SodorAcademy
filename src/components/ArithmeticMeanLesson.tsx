import React, { useState } from 'react';
import { RotateCcw, ArrowRightLeft } from 'lucide-react';
import { Lang, pick } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { Engine } from './ui';
import { STATIONS } from '../content/stations';

// The average (the arithmetic mean): share out fairly, even out the trains, then
// the quick way (add everything up, divide by how many values there are), a lab
// with Emily's passengers, and the zero that counts too.

const math = STATIONS.find(s => s.id === 'math')!;

const tx = (lang: Lang, fr: string, en: string) => pick({ fr, en }, lang);
const fmt = (x: number, lang: Lang) => x.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 2 });
const list = (xs: (string | number)[], lang: Lang) =>
  xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${lang === 'fr' ? 'et' : 'and'} ${xs[xs.length - 1]}`;

// Percy, James and Gordon, and the colour of the trucks each one starts with.
const CREW = [
  { name: 'Percy', color: '#3a9a3f', number: '6', truck: '#a7dcae' },
  { name: 'James', color: '#d8342c', number: '5', truck: '#f6aaa2' },
  { name: 'Gordon', color: '#2464d6', number: '4', truck: '#a9c4f2' },
];
const START = [3, 5, 10];   // 18 trucks, 6 each

const startRows = () => CREW.map((c, k) => Array.from({ length: START[k] }, () => c.truck));

// A number on a chunky tile, and the sign between two tiles.
function Tile({ children, bg = '#fff' }: { children: React.ReactNode; bg?: string }) {
  return (
    <span className="inline-flex items-center justify-center min-w-11 h-11 px-2 rounded-xl border-[3px] border-ink font-extrabold text-2xl tabular-nums" style={{ background: bg }}>
      {children}
    </span>
  );
}
function Op({ children }: { children: React.ReactNode }) {
  return <span className="font-extrabold text-2xl text-ink/60 px-0.5">{children}</span>;
}

// One engine and its trucks on a rail, with its name and how many trucks it pulls.
function TrainRow({ name, color, number, trucks, lang }: { name: string; color: string; number: string; trucks: string[]; lang: Lang }) {
  return (
    <div className="flex items-end gap-2 sm:gap-3">
      <span className="w-16 sm:w-20 shrink-0 leading-tight pb-0.5">
        <span className="block font-extrabold text-base sm:text-lg">{name}</span>
        <span className="block text-sm font-bold text-ink/65 tabular-nums">{trucks.length} {tx(lang, 'wagons', 'trucks')}</span>
      </span>
      <span className="flex items-end gap-[2px] sm:gap-[3px] flex-1 min-w-0 border-b-[3px] border-ink">
        {trucks.map((c, k) => (
          <span key={k} className="block w-[13px] h-4 sm:w-[22px] sm:h-6 mb-1 rounded-[4px] border-2 sm:border-[2.5px] border-ink transition-colors" style={{ background: c }} />
        ))}
        <Engine size={52} color={color} number={number} className="w-10 h-auto sm:w-[52px] shrink-0" />
      </span>
    </div>
  );
}

function Trains({ rows, lang }: { rows: string[][]; lang: Lang }) {
  const label = list(CREW.map((c, k) => `${c.name} ${rows[k].length}`), lang);
  return (
    <div role="img" aria-label={tx(lang, `Nombre de wagons : ${label}`, `Trucks pulled: ${label}`)} className="space-y-3">
      {CREW.map((c, k) => (
        <React.Fragment key={c.name}>
          <TrainRow name={c.name} color={c.color} number={c.number} trucks={rows[k]} lang={lang} />
        </React.Fragment>
      ))}
    </div>
  );
}

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5">{children}</div>
);

// Step 1: three trains that are not fair.
function Unfair({ lang }: { lang: Lang }) {
  return <Panel><Trains rows={startRows()} lang={lang} /></Panel>;
}

// Step 2: move one truck at a time from the longest train to the shortest.
function Leveller({ lang }: { lang: Lang }) {
  const [rows, setRows] = useState<string[][]>(startRows);
  const [moves, setMoves] = useState(0);
  const lens = rows.map(r => r.length);
  const done = Math.max(...lens) === Math.min(...lens);

  const move = () => {
    if (done) return;
    const hi = lens.indexOf(Math.max(...lens)), lo = lens.indexOf(Math.min(...lens));
    const next = rows.map(r => [...r]);
    const truck = next[hi].shift()!;          // the last truck of the longest train…
    next[lo].unshift(truck);                  // …goes to the end of the shortest one
    setRows(next);
    setMoves(m => m + 1);
  };
  const reset = () => { setRows(startRows()); setMoves(0); };

  return (
    <Panel>
      <Trains rows={rows} lang={lang} />
      <p aria-live="polite" className="mt-4 mb-0 font-bold text-lg">
        {done
          ? tx(lang, `Chaque locomotive tire ${lens[0]} wagons, et il y a toujours 18 wagons en tout.`, `Each engine pulls ${lens[0]} trucks, and there are still 18 trucks in all.`)
          : tx(lang, `Wagons déplacés : ${moves} · en tout : 18 wagons`, `Trucks moved: ${moves} · in all: 18 trucks`)}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button onClick={move} disabled={done} className="chunky go">
          <ArrowRightLeft size={18} aria-hidden="true" /> {tx(lang, 'Déplacer un wagon', 'Move one truck')}
        </button>
        <button onClick={reset} className="chunky">
          <RotateCcw size={16} aria-hidden="true" /> {tx(lang, 'Recommencer', 'Start again')}
        </button>
      </div>
    </Panel>
  );
}

// Step 3: all the trucks in one long train, counted.
function OneBigTrain({ lang }: { lang: Lang }) {
  const trucks = startRows().flat();
  return (
    <Panel>
      <div role="img" aria-label={tx(lang, '18 wagons accrochés en un seul train : 3 de Percy, 5 de James et 10 de Gordon', '18 trucks coupled into one train: 3 from Percy, 5 from James and 10 from Gordon')}
        className="flex flex-wrap items-end gap-1.5 mb-5">
        {trucks.map((c, k) => (
          <span key={k} className="flex items-center justify-center w-8 h-8 rounded-md border-[2.5px] border-ink text-[0.8rem] font-extrabold tabular-nums" style={{ background: c }}>{k + 1}</span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Tile bg={CREW[0].truck}>3</Tile><Op>+</Op><Tile bg={CREW[1].truck}>5</Tile><Op>+</Op><Tile bg={CREW[2].truck}>10</Tile><Op>=</Op><Tile bg="#fff3b0">18</Tile>
      </div>
    </Panel>
  );
}

// Step 4: the 18 trucks shared out in 3 equal parts.
function Shared({ lang }: { lang: Lang }) {
  const all = startRows().flat();
  const rows = [all.slice(0, 6), all.slice(6, 12), all.slice(12)];
  return (
    <Panel>
      <Trains rows={rows} lang={lang} />
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Tile bg="#fff3b0">18</Tile><Op>÷</Op><Tile>3</Tile><Op>=</Op><Tile bg="#c9eedb">6</Tile>
      </div>
    </Panel>
  );
}

// Step 5: Emily's passengers at four stations; change them and watch the average.
const STOPS = ['Knapford', 'Tidmouth', 'Vicarstown', 'Wellsworth'];
const MAX = 12;

function PassengerLab({ lang }: { lang: Lang }) {
  const [v, setV] = useState([8, 3, 6, 5]);
  const sum = v.reduce((a, b) => a + b, 0);
  const mean = sum / v.length;
  const change = (k: number, d: number) => setV(v.map((x, j) => (j === k ? Math.max(0, Math.min(MAX, x + d)) : x)));
  const h = (x: number) => `${(x / MAX) * 80}%`;
  const label = list(STOPS.map((s, k) => `${s} ${v[k]}`), lang);

  return (
    <Panel>
      <div className="relative h-44 sm:h-52 flex items-end gap-2 border-b-[3px] border-ink" role="img"
        aria-label={tx(lang, `Passagers : ${label}. Moyenne : ${fmt(mean, lang)}`, `Passengers: ${label}. Average: ${fmt(mean, lang)}`)}>
        {v.map((x, k) => (
          <div key={k} className="flex-1 h-full flex flex-col items-center justify-end">
            <span className="font-extrabold text-lg tabular-nums leading-none mb-1">{x}</span>
            <div className="w-[70%] rounded-t-lg border-[2.5px] border-b-0 border-ink bg-[#7fb2f0] transition-all" style={{ height: h(x) }} />
          </div>
        ))}
        <div className="absolute left-0 right-0 border-t-[3px] border-dashed border-[#e23b2e] pointer-events-none transition-all" style={{ bottom: h(mean) }} />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {STOPS.map((s, k) => (
          <div key={s} className="flex flex-col items-center gap-1.5 min-w-0">
            <span className="text-[0.78rem] sm:text-[0.95rem] font-bold text-center leading-tight">{s}</span>
            <span className="flex gap-1">
              <button onClick={() => change(k, -1)} disabled={v[k] === 0} className="chunky p-0! w-7 h-7 sm:w-9 sm:h-9 text-lg"
                aria-label={tx(lang, `Un passager de moins à ${s}`, `One passenger fewer at ${s}`)}>−</button>
              <button onClick={() => change(k, 1)} disabled={v[k] === MAX} className="chunky p-0! w-7 h-7 sm:w-9 sm:h-9 text-lg"
                aria-label={tx(lang, `Un passager de plus à ${s}`, `One more passenger at ${s}`)}>+</button>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 mb-0 text-lg font-bold flex flex-wrap items-center gap-x-2" aria-live="polite">
        <span className="inline-block w-8 border-t-[3px] border-dashed border-[#e23b2e]" aria-hidden="true" />
        <span>{tx(lang, 'La moyenne :', 'The average:')}</span>
        <span className="tabular-nums">{v.join(' + ')} = {sum}, {sum} ÷ 4 = <b className="px-1.5 rounded bg-note">{fmt(mean, lang)}</b></span>
      </p>
    </Panel>
  );
}

// Step 6: Thomas's coal, with a day at the Works.
const DAYS = [
  { fr: 'Lundi', en: 'Monday', v: 5 },
  { fr: 'Mardi', en: 'Tuesday', v: 0 },
  { fr: 'Mercredi', en: 'Wednesday', v: 7 },
];
const SACK = 22, GAP = 3;

function CoalDays({ lang }: { lang: Lang }) {
  return (
    <Panel>
      <div className="relative grid grid-cols-3 gap-3 items-end border-b-[3px] border-ink" style={{ height: 7 * (SACK + GAP) + 12 }}
        role="img" aria-label={tx(lang, 'Sacs de charbon : lundi 5, mardi 0, mercredi 7. La moyenne est de 4 sacs par jour.', 'Sacks of coal: Monday 5, Tuesday 0, Wednesday 7. The average is 4 sacks a day.')}>
        {DAYS.map(d => (
          <div key={d.en} className="flex flex-col-reverse items-center" style={{ gap: GAP }}>
            {d.v === 0
              ? <span className="text-sm font-bold text-ink/60 text-center leading-tight mb-1">{tx(lang, 'à l’atelier', 'at the Works')}</span>
              : Array.from({ length: d.v }, (_, k) => (
                <span key={k} className="block w-14 rounded-md border-2 border-ink bg-[#3b3f4a]" style={{ height: SACK }} />
              ))}
          </div>
        ))}
        <div className="absolute left-0 right-0 border-t-[3px] border-dashed border-[#e23b2e] pointer-events-none" style={{ bottom: 4 * (SACK + GAP) - GAP / 2 }} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2 text-center">
        {DAYS.map(d => (
          <span key={d.en} className="font-bold leading-tight">{lang === 'fr' ? d.fr : d.en}<br /><b className="text-xl tabular-nums">{d.v}</b></span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Tile>5</Tile><Op>+</Op><Tile>0</Tile><Op>+</Op><Tile>7</Tile><Op>=</Op><Tile bg="#fff3b0">12</Tile>
        <span className="w-4" aria-hidden="true" />
        <Tile bg="#fff3b0">12</Tile><Op>÷</Op><Tile>3</Tile><Op>=</Op><Tile bg="#c9eedb">4</Tile>
      </div>
    </Panel>
  );
}

const STEPS: LessonStep[] = [
  {
    title: { fr: 'Partager équitablement', en: 'Sharing fairly' },
    body: {
      fr: 'Ce matin, Percy tire 3 wagons, James en tire 5 et Gordon en tire 10. Ce n’est pas très juste ! Si on partageait les wagons également, combien chaque locomotive en tirerait-elle ? Ce nombre s’appelle la <b>moyenne</b>.',
      en: 'This morning Percy pulls 3 trucks, James pulls 5 and Gordon pulls 10. That is not very fair! If the trucks were shared out equally, how many would each engine pull? That number is called the <b>average</b>, or the <b>mean</b>.',
    },
    visual: lang => <Unfair lang={lang} />,
    note: { fr: 'La moyenne, c’est la part de chacun quand on partage tout également.', en: 'The average is everyone’s share when everything is shared out equally.' },
  },
  {
    title: { fr: 'Égaliser les trains', en: 'Evening out the trains' },
    body: {
      fr: 'Prends un wagon au train le plus long et donne-le au train le plus court. Recommence jusqu’à ce que les trois trains soient pareils. Appuie sur le bouton !',
      en: 'Take a truck from the longest train and give it to the shortest one. Keep going until all three trains are the same. Press the button!',
    },
    visual: lang => <Leveller lang={lang} />,
    note: { fr: 'On n’ajoute aucun wagon et on n’en enlève aucun : on les déplace seulement. Le total ne change pas.', en: 'No truck is added and none is taken away: they are only moved. The total does not change.' },
  },
  {
    title: { fr: 'D’abord, on additionne', en: 'First, add them all up' },
    body: {
      fr: 'Déplacer les wagons un par un, c’est long. Il y a plus rapide ! On accroche tous les wagons en un seul grand train, puis on les compte : 3 + 5 + 10 = <b>18 wagons</b>. Ce total s’appelle la <b>somme</b>.',
      en: 'Moving trucks one by one takes a long time. There is a quicker way! Couple all the trucks into one big train, then count them: 3 + 5 + 10 = <b>18 trucks</b>. This total is called the <b>sum</b>.',
    },
    visual: lang => <OneBigTrain lang={lang} />,
    note: { fr: 'La <b>somme</b>, c’est le total de toutes les valeurs.', en: 'The <b>sum</b> is the total of all the values.' },
  },
  {
    title: { fr: 'Ensuite, on divise', en: 'Then, divide' },
    body: {
      fr: 'Il y a 3 locomotives, alors on partage les 18 wagons en 3 parts égales : 18 ÷ 3 = <b>6</b>. Chaque locomotive tire 6 wagons, comme quand tu les déplaçais un par un !',
      en: 'There are 3 engines, so share the 18 trucks into 3 equal parts: 18 ÷ 3 = <b>6</b>. Each engine pulls 6 trucks, just like when you moved them one by one!',
    },
    visual: lang => <Shared lang={lang} />,
    note: { fr: '<b>Moyenne = somme ÷ nombre de valeurs</b>. Ici, on divise par 3, parce qu’il y a 3 locomotives.', en: '<b>Average = sum ÷ number of values</b>. Here we divide by 3, because there are 3 engines.' },
  },
  {
    title: { fr: 'À toi de jouer', en: 'Your turn' },
    body: {
      fr: 'Emily compte les passagers qui montent à chaque gare. Change les nombres avec les boutons − et +, et regarde la ligne pointillée : c’est la moyenne. Les colonnes plus hautes que la ligne donnent ce qu’elles ont en trop aux plus basses.',
      en: 'Emily counts the passengers who get on at each station. Change the numbers with the − and + buttons, and watch the dotted line: that is the average. The columns above the line give what they have extra to the shorter ones.',
    },
    visual: lang => <PassengerLab lang={lang} />,
    note: {
      fr: 'Une moyenne n’est pas toujours un nombre entier : 22 ÷ 4 = 5,5. On ne peut pas avoir 5 passagers et demi, mais une moyenne de 5,5 passagers, oui !',
      en: 'An average is not always a whole number: 22 ÷ 4 = 5.5. You cannot have five and a half passengers, but an average of 5.5 passengers is fine!',
    },
  },
  {
    title: { fr: 'Le zéro compte aussi', en: 'Zero counts too' },
    body: {
      fr: 'Lundi, Thomas livre 5 sacs de charbon. Mardi, il est à l’atelier pour une réparation : 0 sac. Mercredi, il en livre 7. La somme est 5 + 0 + 7 = 12. Combien de jours ? <b>3</b>, même si mardi vaut zéro ! La moyenne est donc 12 ÷ 3 = <b>4 sacs par jour</b>.',
      en: 'On Monday Thomas delivers 5 sacks of coal. On Tuesday he is at the Works for repairs: 0 sacks. On Wednesday he delivers 7. The sum is 5 + 0 + 7 = 12. How many days? <b>3</b>, even though Tuesday is zero! So the average is 12 ÷ 3 = <b>4 sacks a day</b>.',
    },
    visual: lang => <CoalDays lang={lang} />,
    note: {
      fr: 'Compte toutes les valeurs, même les zéros. Et vérifie : la moyenne est toujours entre la plus petite et la plus grande valeur.',
      en: 'Count every value, even the zeros. And check: the average is always between the smallest and the largest value.',
    },
  },
];

// To divide bigger sums: the long division page.
const LINKS = math.links.filter(l => l.href.includes('long-division'));

export default function ArithmeticMeanLesson({ onCancel, onStartExercise, color }: {
  onCancel: () => void;
  onStartExercise?: () => void;
  color?: string;
  place?: string;
}) {
  return (
    <LessonPlayer
      title={{ fr: 'La moyenne', en: 'The Average' }}
      color={color || math.color}
      steps={STEPS}
      links={LINKS}
      onStartExercise={onStartExercise}
      onCancel={onCancel}
    />
  );
}
