import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { Engine } from './ui';
import { STATIONS } from '../content/stations';
import { FractionBar, BarRow, barLabel, inlineFrac, YELLOW, BLUE, gcd, lcm } from './FractionAdditionLesson';
import { Frac } from './ExerciseFrame';

// The least common multiple, with the timetable of Knapford: the multiples of a
// number, two engines leaving every 4 and every 6 minutes, the LCM, the shortcut of
// the biggest number's table, the LCM as a common denominator, and a × b = GCD × LCM.

const INK = '#17233d';
const math = STATIONS.find(s => s.id === 'math')!;

const THOMAS = { name: 'Thomas', color: '#2464d6', number: '1' };
const PERCY = { name: 'Percy', color: '#1c7a55', number: '6' };
const GORDON = { name: 'Gordon', color: '#2464d6', number: '4' };
const JAMES = { name: 'James', color: '#e23b2e', number: '5' };

const Ff = (n: number, d: number) => inlineFrac(n, d, 'fr');
const Fe = (n: number, d: number) => inlineFrac(n, d, 'en');

const multiples = (n: number, to: number) => Array.from({ length: Math.floor(to / n) }, (_, k) => n * (k + 1));
const clock = (L: number, lang: Lang) => {
  const h = 8 + Math.floor(L / 60), m = String(L % 60).padStart(2, '0');
  return lang === 'fr' ? `${h} h ${m}` : `${h}:${m}`;
};

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5 space-y-3 max-w-2xl">{children}</div>
);

// − 4 +
function Stepper({ value, set, min, max, name, lang }: {
  value: number; set: (v: number) => void; min: number; max: number; name: string; lang: Lang;
}) {
  const fr = lang === 'fr';
  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} className="chunky p-0! w-10 h-10 text-xl"
        aria-label={fr ? `${name} : un de moins` : `${name}: one less`}>−</button>
      <span className="chip text-lg! min-w-[2.6rem] justify-center" aria-live="polite">{value}</span>
      <button onClick={() => set(Math.min(max, value + 1))} disabled={value >= max} className="chunky p-0! w-10 h-10 text-xl"
        aria-label={fr ? `${name} : un de plus` : `${name}: one more`}>+</button>
    </span>
  );
}

// Jumps of n along the number line: the multiples of n.
function JumpLine({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const [n, setN] = useState(4);
  const max = 30;
  const x = (v: number) => 24 + v * (592 / max);
  const list = multiples(n, max);
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2.5 font-bold">
        <span className="mr-1">{fr ? 'Des bonds de :' : 'Jumps of:'}</span>
        {[2, 3, 4, 5, 6].map(k => (
          <React.Fragment key={k}>
            <button onClick={() => setN(k)} aria-pressed={n === k} className="chunky text-lg w-11">{k}</button>
          </React.Fragment>
        ))}
      </div>
      <svg viewBox="0 0 640 124" className="w-full block bg-white rounded-xl border-[2.5px] border-ink" role="img"
        aria-label={fr ? `Des bonds de ${n} sur la droite des nombres, de 0 à ${max} : ${list.join(', ')}` : `Jumps of ${n} along the number line from 0 to ${max}: ${list.join(', ')}`}>
        <line x1={x(0)} y1={88} x2={x(max)} y2={88} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {Array.from({ length: max + 1 }, (_, v) => (
          <line key={v} x1={x(v)} x2={x(v)} y1={v % n === 0 ? 80 : 84} y2={v % n === 0 ? 96 : 92} stroke={INK} strokeWidth={v % n === 0 ? 3 : 1.5} />
        ))}
        {list.map(m => (
          <path key={m} d={`M ${x(m - n)} 84 Q ${x(m - n / 2)} ${84 - (22 + n * 7)} ${x(m)} 84`} fill="none" stroke={BLUE} strokeWidth={3.5} strokeLinecap="round" />
        ))}
        {list.map(m => <circle key={m} cx={x(m)} cy={88} r={7} fill={YELLOW} stroke={INK} strokeWidth={2.5} />)}
        {[0, ...list].map(m => (
          <text key={m} x={x(m)} y={116} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{m}</text>
        ))}
      </svg>
      <p className="m-0 text-lg"><b>{fr ? `Multiples de ${n} :` : `Multiples of ${n}:`}</b> {list.join(', ')}…</p>
    </Panel>
  );
}

// Thomas every 4 minutes, Percy every 6: together at 0, 12 and 24.
function Timetable({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const max = 24;
  const x = (v: number) => 120 + v * (496 / max);
  const rows = [{ e: THOMAS, n: 4, y: 44 }, { e: PERCY, n: 6, y: 104 }];
  const labels = [0, 4, 6, 8, 12, 16, 18, 20, 24];
  return (
    <div className="max-w-2xl rounded-2xl border-[3px] border-ink bg-white p-2 sm:p-3">
      <svg viewBox="0 0 640 198" className="w-full block" role="img"
        aria-label={fr
          ? 'Horaire : Thomas part à 0, 4, 8, 12, 16, 20 et 24 minutes, Percy à 0, 6, 12, 18 et 24 minutes. Ils partent ensemble à 0, 12 et 24 minutes.'
          : 'Timetable: Thomas leaves at 0, 4, 8, 12, 16, 20 and 24 minutes, Percy at 0, 6, 12, 18 and 24 minutes. They leave together at 0, 12 and 24 minutes.'}>
        {[0, 12, 24].map(v => <rect key={v} x={x(v) - 14} y={16} width={28} height={118} rx={9} fill={YELLOW} stroke={INK} strokeWidth={2} />)}
        {rows.map(r => (
          <g key={r.e.name}>
            <g transform={`translate(10 ${r.y - 30})`}><Engine size={60} color={r.e.color} number={r.e.number} /></g>
            <text x={40} y={r.y + 27} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK}>{r.e.name}</text>
            <line x1={x(0)} y1={r.y} x2={x(max)} y2={r.y} stroke={INK} strokeWidth={2} strokeDasharray="4 6" opacity={0.45} />
            {[0, ...multiples(r.n, max)].map(v => <circle key={v} cx={x(v)} cy={r.y} r={10} fill={r.e.color} stroke={INK} strokeWidth={2.5} />)}
          </g>
        ))}
        <line x1={x(0)} y1={152} x2={x(max)} y2={152} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {Array.from({ length: max / 2 + 1 }, (_, k) => (
          <line key={k} x1={x(2 * k)} x2={x(2 * k)} y1={147} y2={157} stroke={INK} strokeWidth={2} />
        ))}
        {labels.map(v => (
          <text key={v} x={x(v)} y={175} textAnchor="middle" fontSize={v % 12 === 0 ? 18 : 15} fontWeight={800} fill={INK}>{v}</text>
        ))}
        <text x={x(12)} y={195} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK} opacity={0.7}>
          {fr ? 'minutes après 8 h' : 'minutes after 8:00'}
        </text>
      </svg>
    </div>
  );
}

// Pick two timetables: the two tables up to the LCM.
function LCMFinder({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const [a, setA] = useState(4);
  const [b, setB] = useState(6);
  const L = lcm(a, b);
  const row = (e: typeof THOMAS, n: number) => (
    <div className="flex items-start gap-3">
      <Engine size={52} color={e.color} number={e.number} className="shrink-0 mt-0.5" />
      <p className="m-0 flex flex-wrap items-center gap-1.5">
        {multiples(n, L).map(m => (
          <span key={m} className={`chip text-[0.95rem]! ${m === L ? 'bg-sticker!' : ''}`}>{m}</span>
        ))}
      </p>
    </div>
  );
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-bold">
        <span className="flex items-center gap-2">Thomas <Stepper value={a} set={setA} min={2} max={10} name="Thomas" lang={lang} /> min</span>
        <span className="flex items-center gap-2">Percy <Stepper value={b} set={setB} min={2} max={10} name="Percy" lang={lang} /> min</span>
      </div>
      {row(THOMAS, a)}
      {row(PERCY, b)}
      <p className="m-0 text-lg" aria-live="polite">
        <b className="px-1.5 rounded bg-note">{fr ? `PPCM(${a}, ${b}) = ${L}` : `LCM(${a}, ${b}) = ${L}`}</b>
        {fr ? ` : ils repartent ensemble à ${clock(L, lang)}.` : `: they leave together again at ${clock(L, lang)}.`}
      </p>
    </Panel>
  );
}

// The shortcut: the table of 12 only, until 8 divides it.
function BiggestTable({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const rows = [
    { m: 12, ok: false, text: fr ? '12 ÷ 8 = 1, reste 4' : '12 ÷ 8 = 1, remainder 4' },
    { m: 24, ok: true, text: '24 ÷ 8 = 3' },
  ];
  return (
    <Panel>
      <div className="flex flex-wrap items-end gap-6">
        {[{ e: GORDON, n: 12 }, { e: JAMES, n: 8 }].map(({ e, n }) => (
          <div key={e.name} className="flex flex-col items-center gap-1">
            <Engine size={64} color={e.color} number={e.number} />
            <span className="font-extrabold">{e.name}</span>
            <span className="chip text-[0.95rem]!">{fr ? `toutes les ${n} min` : `every ${n} min`}</span>
          </div>
        ))}
      </div>
      <ol className="space-y-2 m-0 p-0 list-none">
        {rows.map((r, k) => (
          <li key={r.m} className="flex flex-wrap items-center gap-3 text-lg">
            <span className="chip text-base! bg-white!">12 × {k + 1} = {r.m}</span>
            <span className="font-bold">{r.text}</span>
            {r.ok
              ? <span className="inline-flex items-center gap-1 font-extrabold text-good"><Check size={22} strokeWidth={3} aria-hidden="true" />{fr ? 'ça tombe juste' : 'it works'}</span>
              : <span className="inline-flex items-center gap-1 font-extrabold text-bad"><X size={22} strokeWidth={3} aria-hidden="true" />{fr ? 'ça ne tombe pas juste' : 'it does not work'}</span>}
          </li>
        ))}
      </ol>
      <p className="m-0 text-lg"><b className="px-1.5 rounded bg-note">{fr ? 'PPCM(8, 12) = 24' : 'LCM(8, 12) = 24'}</b></p>
    </Panel>
  );
}

// 1/4 + 1/6 over the LCM of 4 and 6.
function CommonDenominator({ lang }: { lang: Lang }) {
  return (
    <Panel>
      <BarRow label={<><Frac n={1} d={4} /> = <Frac n={3} d={12} /></>}>
        <FractionBar d={12} fills={[[3, YELLOW]]} group={3} label={barLabel(3, 12, lang)} />
      </BarRow>
      <BarRow sign="+" label={<><Frac n={1} d={6} /> = <Frac n={2} d={12} /></>}>
        <FractionBar d={12} fills={[[2, BLUE]]} group={2} label={barLabel(2, 12, lang)} />
      </BarRow>
      <BarRow sign="=" label={<span className="px-1.5 rounded-lg bg-note"><Frac n={5} d={12} /></span>}>
        <FractionBar d={12} fills={[[3, YELLOW], [2, BLUE]]} label={barLabel(5, 12, lang)} />
      </BarRow>
    </Panel>
  );
}

// a × b = GCD × LCM, for any two numbers.
function ProductCheck({ lang }: { lang: Lang }) {
  const fr = lang === 'fr';
  const [a, setA] = useState(4);
  const [b, setB] = useState(6);
  const g = gcd(a, b), L = lcm(a, b);
  const G = fr ? 'PGCD' : 'GCD', M = fr ? 'PPCM' : 'LCM';
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-bold">
        <span className="flex items-center gap-2">a <Stepper value={a} set={setA} min={2} max={12} name="a" lang={lang} /></span>
        <span className="flex items-center gap-2">b <Stepper value={b} set={setB} min={2} max={12} name="b" lang={lang} /></span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3" aria-live="polite">
        <div className="card-ink p-3.5 text-center">
          <p className="label-caps m-0">a × b</p>
          <p className="m-0 text-2xl font-extrabold">{a} × {b} = <span className="px-1.5 rounded bg-note">{a * b}</span></p>
        </div>
        <div className="card-ink p-3.5 text-center">
          <p className="label-caps m-0">{G} × {M}</p>
          <p className="m-0 text-2xl font-extrabold">{g} × {L} = <span className="px-1.5 rounded bg-note">{g * L}</span></p>
        </div>
      </div>
      <p className="m-0 text-lg">
        {G}({a}, {b}) = <b>{g}</b> · {M}({a}, {b}) = <b>{L}</b>
      </p>
    </Panel>
  );
}

const STEPS: LessonStep[] = [
  {
    title: { fr: 'Les multiples d’un nombre', en: 'The multiples of a number' },
    body: {
      fr: 'Thomas part de Knapford toutes les 4 minutes : après 4 minutes, 8 minutes, 12 minutes… Ces nombres sont les <b>multiples</b> de 4 : la table de 4. On les trouve en faisant des bonds de 4 sur la droite des nombres. Choisis un autre nombre pour voir ses bonds.',
      en: 'Thomas leaves Knapford every 4 minutes: after 4 minutes, 8 minutes, 12 minutes… These numbers are the <b>multiples</b> of 4: the 4 times table. You find them by jumping 4 at a time along the number line. Pick another number to see its jumps.',
    },
    visual: lang => <JumpLine lang={lang} />,
    note: {
      fr: 'Les multiples de 4 sont 4 × 1, 4 × 2, 4 × 3… : 4, 8, 12, 16… La liste ne s’arrête jamais !',
      en: 'The multiples of 4 are 4 × 1, 4 × 2, 4 × 3…: 4, 8, 12, 16… The list never ends!',
    },
  },
  {
    title: { fr: 'Deux locomotives, deux horaires', en: 'Two engines, two timetables' },
    body: {
      fr: 'Percy, lui, part toutes les 6 minutes. À 8 h, les deux locomotives partent ensemble. Thomas repart après 4, 8, 12, 16… minutes, et Percy après 6, 12, 18, 24… minutes. Regarde les bandes jaunes : après 12 minutes, puis après 24 minutes, ils partent de nouveau en même temps !',
      en: 'Percy leaves every 6 minutes. At 8:00, both engines leave together. Thomas leaves again after 4, 8, 12, 16… minutes, and Percy after 6, 12, 18, 24… minutes. Look at the yellow bands: after 12 minutes, and again after 24 minutes, they leave at the same time!',
    },
    visual: lang => <Timetable lang={lang} />,
    note: {
      fr: '12 et 24 sont dans la table de 4 <b>et</b> dans la table de 6 : ce sont des <b>multiples communs</b> de 4 et de 6.',
      en: '12 and 24 are in the 4 times table <b>and</b> in the 6 times table: they are <b>common multiples</b> of 4 and 6.',
    },
  },
  {
    title: { fr: 'Le plus petit des multiples communs', en: 'The smallest common multiple' },
    body: {
      fr: 'Le plus petit des multiples communs s’appelle le <b>plus petit commun multiple</b>, ou <b>PPCM</b>. Pour 4 et 6, c’est 12 : Thomas et Percy repartent ensemble pour la première fois à 8 h 12. Pour le trouver, écris les deux tables jusqu’au premier nombre qui est dans les deux. Essaie avec d’autres horaires !',
      en: 'The smallest of the common multiples is called the <b>least common multiple</b>, or <b>LCM</b>. For 4 and 6, it is 12: Thomas and Percy first leave together again at 8:12. To find it, write out both times tables up to the first number that is in both. Try other timetables!',
    },
    visual: lang => <LCMFinder lang={lang} />,
    note: {
      fr: 'PPCM(4, 6) = 12 : c’est le plus petit nombre qui est à la fois dans la table de 4 et dans la table de 6.',
      en: 'LCM(4, 6) = 12: it is the smallest number that is in both the 4 and the 6 times tables.',
    },
  },
  {
    title: { fr: 'Une astuce : la table du plus grand', en: 'A shortcut: the bigger number’s table' },
    body: {
      fr: 'Gordon part toutes les 12 minutes et James toutes les 8 minutes. Pas besoin d’écrire les deux tables : écris seulement celle du plus grand nombre, 12, et arrête-toi au premier nombre que 8 divise. 12 ÷ 8 ne tombe pas juste, mais 24 ÷ 8 = 3. Donc PPCM(8, 12) = 24.',
      en: 'Gordon leaves every 12 minutes and James every 8 minutes. No need to write out both tables: write only the table of the bigger number, 12, and stop at the first number that 8 divides. 12 ÷ 8 does not work out exactly, but 24 ÷ 8 = 3. So LCM(8, 12) = 24.',
    },
    visual: lang => <BiggestTable lang={lang} />,
    note: {
      fr: 'Si le petit nombre divise le grand, le PPCM est le grand : PPCM(3, 6) = 6. Si aucun nombre sauf 1 ne divise les deux, le PPCM est leur produit : PPCM(4, 5) = 20.',
      en: 'If the small number divides the big one, the LCM is the big one: LCM(3, 6) = 6. If no number except 1 divides both, the LCM is their product: LCM(4, 5) = 20.',
    },
  },
  {
    title: { fr: 'Le PPCM des dénominateurs', en: 'The LCM of the denominators' },
    body: {
      fr: `Percy remplit ${Ff(1, 4)} d’un wagon de courrier à Knapford et ${Ff(1, 6)} à Elsbridge. Pour additionner, il faut des parts de même taille : un dénominateur commun. Le meilleur, c’est le PPCM des dénominateurs : PPCM(4, 6) = 12. ${Ff(1, 4)} = ${Ff(3, 12)} et ${Ff(1, 6)} = ${Ff(2, 12)}, donc ${Ff(1, 4)} + ${Ff(1, 6)} = ${Ff(5, 12)}.`,
      en: `Percy fills ${Fe(1, 4)} of a mail van at Knapford and ${Fe(1, 6)} at Elsbridge. To add them, you need parts of the same size: a common denominator. The best one is the LCM of the denominators: LCM(4, 6) = 12. ${Fe(1, 4)} = ${Fe(3, 12)} and ${Fe(1, 6)} = ${Fe(2, 12)}, so ${Fe(1, 4)} + ${Fe(1, 6)} = ${Fe(5, 12)}.`,
    },
    visual: lang => <CommonDenominator lang={lang} />,
    note: {
      fr: 'Le PPCM des dénominateurs est le plus petit dénominateur commun : les nombres restent petits, et il y a moins à simplifier.',
      en: 'The LCM of the denominators is the smallest common denominator: the numbers stay small, and there is less to simplify.',
    },
  },
  {
    title: { fr: 'Le PPCM et le PGCD', en: 'The LCM and the GCD' },
    body: {
      fr: 'Le <b>plus grand commun diviseur (PGCD)</b> de 4 et 6 est 2 : c’est le plus grand nombre qui divise 4 et 6. Regarde : 4 × 6 = 24, et PGCD × PPCM = 2 × 12 = 24. Ça marche pour tous les couples de nombres ! Donc PPCM = 4 × 6 ÷ 2 = 12. Vérifie avec d’autres nombres.',
      en: 'The <b>greatest common divisor (GCD)</b> of 4 and 6 is 2: it is the biggest number that divides both 4 and 6. Look: 4 × 6 = 24, and GCD × LCM = 2 × 12 = 24. This works for any two numbers! So LCM = 4 × 6 ÷ 2 = 12. Check it with other numbers.',
    },
    visual: lang => <ProductCheck lang={lang} />,
    note: {
      fr: '<b>a × b = PGCD × PPCM</b>. Pour trouver vite le PGCD de grands nombres, il y a l’algorithme d’Euclide.',
      en: '<b>a × b = GCD × LCM</b>. To find the GCD of big numbers quickly, use Euclid’s algorithm.',
    },
  },
];

const LINKS = math.links.filter(l => l.href.includes('multiples/lcm') || l.href.includes('euclid') || l.href.includes('/Practice/'));

export default function LCMLesson({ onCancel, onStartExercise, color }: {
  onCancel: () => void;
  onStartExercise?: () => void;
  color?: string;
  place?: string;
}) {
  return (
    <LessonPlayer
      title={{ fr: 'Le plus petit commun multiple', en: 'The Least Common Multiple' }}
      color={color || math.color}
      steps={STEPS}
      links={LINKS}
      onStartExercise={onStartExercise}
      onCancel={onCancel}
    />
  );
}
