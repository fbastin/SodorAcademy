import React, { useState } from 'react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { Engine } from './ui';
import { STATIONS } from '../content/stations';

// Forces and gravity, after "La 2e loi de Newton" in the pages for kids
// (Physics-for-kids/index.php?topic=newton): a push or a pull, F = m × a, gravity,
// the hammer and the feather, and the gravity of other worlds.

const INK = '#17233d';
const science = STATIONS.find(s => s.id === 'science')!;

// Thomas pushes trucks: an arrow for the force, the trucks for the mass.
function PushPull({ lang }: { lang: Lang }) {
  return (
    <svg viewBox="0 0 520 150" className="w-full max-w-xl mx-auto block" role="img"
      aria-label={lang === 'fr' ? 'Thomas pousse deux wagons ; Harvey tire une caisse' : 'Thomas pushes two trucks; Harvey pulls a crate'}>
      <rect x="0" y="118" width="520" height="6" fill={INK} />
      {[20, 120].map(x => (
        <g key={x}>
          <rect x={x} y="70" width="90" height="44" rx="4" fill="#8a5a32" stroke={INK} strokeWidth="3" />
          <circle cx={x + 22} cy="118" r="9" fill="#555" stroke={INK} strokeWidth="3" />
          <circle cx={x + 68} cy="118" r="9" fill="#555" stroke={INK} strokeWidth="3" />
        </g>
      ))}
      <g transform="translate(212 42)"><Engine size={120} number="1" /></g>
      <path d="M 196 40 L 120 40" stroke="#e23b2e" strokeWidth="8" strokeLinecap="round" />
      <path d="M 134 26 L 114 40 L 134 54" fill="none" stroke="#e23b2e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="160" y="22" textAnchor="middle" fontSize="20" fontWeight="800" fill="#e23b2e">{lang === 'fr' ? 'pousser' : 'push'}</text>
      <rect x="420" y="78" width="64" height="40" rx="3" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <path d="M 452 78 L 452 30" stroke={INK} strokeWidth="3" />
      <path d="M 470 96 L 470 30" stroke="#2464d6" strokeWidth="8" strokeLinecap="round" transform="translate(30 0)" />
      <path d="M 486 44 L 500 26 L 514 44" fill="none" stroke="#2464d6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="446" y="20" textAnchor="middle" fontSize="20" fontWeight="800" fill="#2464d6">{lang === 'fr' ? 'tirer' : 'pull'}</text>
    </svg>
  );
}

// The same push on more and more trucks: the acceleration shrinks.
function TrucksLab({ lang }: { lang: Lang }) {
  const [n, setN] = useState(1);
  const F = 12000;                    // newtons, Thomas's push
  const m = 2000 + n * 2000;          // kilograms: Thomas and his trucks
  const a = F / m;
  const fmt = (x: number, d = 1) => x.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: d });
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5">
      <label className="flex flex-wrap items-center gap-3 font-bold mb-3">
        {lang === 'fr' ? 'Nombre de wagons :' : 'Number of trucks:'}
        <input type="range" min={1} max={6} value={n} onChange={e => setN(+e.target.value)} className="w-48 accent-[#1c7a55]" />
        <span className="chip text-base!">{n}</span>
      </label>
      <div className="flex items-end gap-1 overflow-hidden mb-3" aria-hidden="true">
        {Array.from({ length: n }, (_, k) => <span key={k} className="w-12 h-8 rounded bg-[#8a5a32] border-[2.5px] border-ink" />)}
        <Engine size={64} number="1" />
      </div>
      <p className="m-0 text-lg">
        F = <b>{fmt(F, 0)} N</b> · m = <b>{fmt(m, 0)} kg</b> → a = F ÷ m = <b className="px-1.5 rounded bg-note">{fmt(a, 2)} m/s²</b>
      </p>
      <div className="mt-2 h-4 rounded-full border-2 border-ink bg-white overflow-hidden">
        <div className="h-full bg-[#1c7a55] transition-all" style={{ width: `${(a / 3) * 100}%` }} />
      </div>
    </div>
  );
}

// How fast things fall on each world.
function Worlds({ lang }: { lang: Lang }) {
  const rows = [
    { fr: 'la Lune', en: 'the Moon', g: 1.6, c: '#9aa5b8' },
    { fr: 'Mars', en: 'Mars', g: 3.7, c: '#e2683c' },
    { fr: 'la Terre', en: 'Earth', g: 9.8, c: '#2464d6' },
    { fr: 'Jupiter', en: 'Jupiter', g: 24.8, c: '#c8925a' },
  ];
  return (
    <div className="space-y-2.5 max-w-xl">
      {rows.map(r => (
        <div key={r.en} className="flex items-center gap-3">
          <span className="w-20 font-bold shrink-0">{lang === 'fr' ? r.fr : r.en}</span>
          <span className="flex-1 h-6 rounded-lg border-2 border-ink bg-white overflow-hidden">
            <span className="block h-full" style={{ width: `${(r.g / 24.8) * 100}%`, background: r.c }} />
          </span>
          <span className="w-24 text-right font-extrabold tabular-nums">{r.g.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA')} m/s²</span>
        </div>
      ))}
    </div>
  );
}

const STEPS: LessonStep[] = [
  {
    title: { fr: 'Une force pousse ou tire', en: 'A force pushes or pulls' },
    body: {
      fr: 'Quand Thomas pousse des wagons, il exerce une <b>force</b>. Quand Harvey tire une caisse avec sa grue, c’est aussi une force. Une force peut faire démarrer un objet, l’accélérer, le freiner ou le faire tourner.',
      en: 'When Thomas pushes his trucks, he exerts a <b>force</b>. When Harvey pulls a crate with his crane, that is a force too. A force can start something moving, speed it up, slow it down or turn it.',
    },
    visual: lang => <PushPull lang={lang} />,
    note: { fr: 'On mesure une force en <b>newtons</b> (N).', en: 'Forces are measured in <b>newtons</b> (N).' },
  },
  {
    title: { fr: 'Plus c’est lourd, moins ça accélère', en: 'The heavier it is, the less it speeds up' },
    body: {
      fr: 'Thomas pousse toujours aussi fort. Ajoute des wagons : la masse augmente, et Thomas accélère de moins en moins. C’est la <b>2e loi de Newton</b> : la force est égale à la masse multipliée par l’accélération.',
      en: 'Thomas always pushes just as hard. Add trucks: the mass goes up, and Thomas speeds up less and less. This is <b>Newton’s second law</b>: force equals mass times acceleration.',
    },
    visual: lang => <TrucksLab lang={lang} />,
    note: { fr: '<b>F = m × a</b>, donc <b>a = F ÷ m</b> : deux fois plus de masse, deux fois moins d’accélération.', en: '<b>F = m × a</b>, so <b>a = F ÷ m</b>: twice the mass, half the acceleration.' },
  },
  {
    title: { fr: 'La gravité tire tout vers le bas', en: 'Gravity pulls everything down' },
    body: {
      fr: 'La Terre attire tout ce qui est près d’elle vers son centre : c’est la <b>gravité</b>. Quand un sac de charbon tombe du wagon, c’est la gravité qui le fait tomber. Cette force s’appelle aussi le <b>poids</b>.',
      en: 'The Earth pulls everything near it towards its centre: this is <b>gravity</b>. When a sack of coal falls off a truck, gravity makes it fall. This force is also called <b>weight</b>.',
    },
    visual: <img src="/Physics-for-kids/2nd%20Newton%20Law/2nd%20Newton%20Law%20Thomas.png" alt="" className="block mx-auto max-h-72 rounded-2xl border-[3px] border-ink" />,
  },
  {
    title: { fr: 'Le marteau et la plume', en: 'The hammer and the feather' },
    body: {
      fr: 'Un objet lourd tombe-t-il plus vite qu’un objet léger ? Sans air, non ! En 1971, sur la Lune, l’astronaute David Scott a lâché un marteau et une plume en même temps : ils ont touché le sol ensemble. Sur la Terre, c’est l’air qui freine la plume.',
      en: 'Does a heavy thing fall faster than a light one? Without air, no! In 1971, on the Moon, astronaut David Scott dropped a hammer and a feather at the same time: they hit the ground together. On Earth, it is the air that slows the feather down.',
    },
    note: { fr: 'Sans air, tous les objets tombent aussi vite, quelle que soit leur masse.', en: 'Without air, everything falls just as fast, whatever its mass.' },
  },
  {
    title: { fr: 'La gravité des autres mondes', en: 'The gravity of other worlds' },
    body: {
      fr: 'Chaque planète a sa gravité. Sur la Lune, une balle tombe six fois moins vite que sur la Terre ; sur Jupiter, deux fois et demie plus vite. Plus un astre est massif, plus il attire fort.',
      en: 'Every planet has its own gravity. On the Moon a ball falls six times more slowly than on Earth; on Jupiter, two and a half times faster. The more massive a world is, the harder it pulls.',
    },
    visual: lang => <Worlds lang={lang} />,
    note: { fr: 'Sur la Terre, un objet qui tombe gagne <b>9,8 m/s</b> de vitesse à chaque seconde.', en: 'On Earth, a falling object gains <b>9.8 m/s</b> of speed every second.' },
  },
];

const LINKS = science.links.filter(l => l.href.includes('topic=newton'));

export default function ForceLesson({ onCancel, onStartExercise }: { onCancel: () => void; onStartExercise?: () => void }) {
  return (
    <LessonPlayer
      title={{ fr: 'Les forces et la gravité', en: 'Forces and Gravity' }}
      color={science.color}
      steps={STEPS}
      links={LINKS}
      onStartExercise={onStartExercise}
      onCancel={onCancel}
    />
  );
}
