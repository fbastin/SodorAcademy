import React, { useState } from 'react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from '../components/LessonPlayer';
import { STATIONS } from '../content/stations';

// One more lesson that follows the pages for kids on slashbin.net: the turning Earth
// (Physics-for-kids, topic Earth: day and night, time zones, seasons) for Peel
// Godred. The lessons of the Steamworks are in ProgrammingLessons.tsx.

const INK = '#17233d';
type LessonProps = { onCancel: () => void; onStartExercise?: () => void };

// ---------------------------------------------------------------- The turning Earth

const geography = STATIONS.find(s => s.id === 'geography')!;

// The Sun on the left lights half the Earth; a town turns with it through the day.
function DayNight({ lang }: { lang: Lang }) {
  const [h, setH] = useState(12);
  const ang = ((h - 12) / 24) * 2 * Math.PI;   // noon: facing the Sun
  const x = 230 - 70 * Math.cos(ang), y = 100 + 70 * Math.sin(ang);
  const day = Math.cos(ang) > 0;
  return (
    <div className="text-center">
      <svg viewBox="0 0 340 200" className="w-full max-w-md mx-auto block" role="img"
        aria-label={lang === 'fr' ? `À ${h} h, la ville est du côté ${day ? 'éclairé : il fait jour' : 'sombre : il fait nuit'}` : `At ${h}:00 the town is on the ${day ? 'lit side: it is day' : 'dark side: it is night'}`}>
        <circle cx="40" cy="100" r="30" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(k => {
          const a = (k / 8) * 2 * Math.PI;
          return <line key={k} x1={40 + 36 * Math.cos(a)} y1={100 + 36 * Math.sin(a)} x2={40 + 46 * Math.cos(a)} y2={100 + 46 * Math.sin(a)} stroke="#ffb703" strokeWidth="4" strokeLinecap="round" />;
        })}
        <circle cx="230" cy="100" r="70" fill="#2464d6" stroke={INK} strokeWidth="3" />
        <path d="M 230 30 A 70 70 0 0 1 230 170 Z" fill={INK} opacity="0.7" />
        <circle cx={x} cy={y} r="9" fill={day ? '#ffd23f' : '#fff'} stroke={INK} strokeWidth="3" />
        <text x="230" y="194" textAnchor="middle" fontSize="15" fontWeight="800" fill={INK}>
          {lang === 'fr' ? (day ? 'jour' : 'nuit') : (day ? 'day' : 'night')}
        </text>
      </svg>
      <label className="inline-flex items-center gap-3 font-bold mt-2">
        {lang === 'fr' ? 'Heure :' : 'Time:'}
        <input type="range" min={0} max={23} value={h} onChange={e => setH(+e.target.value)} className="w-56 accent-[#ff8a1f]" />
        <span className="chip text-base!">{lang === 'fr' ? `${h} h` : `${h}:00`}</span>
      </label>
    </div>
  );
}

function Clocks({ lang }: { lang: Lang }) {
  // Standard (winter) time, when it is noon in Montréal.
  const rows: [string, string, number, number][] = [
    ['Vancouver', 'Vancouver', -3, 0], ['Montréal', 'Montreal', 0, 0], ['Londres', 'London', 5, 0],
    ['Paris', 'Paris', 6, 0], ['Tokyo', 'Tokyo', 14, 1],
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {rows.map(([fr, en, d, next]) => {
        const hh = (12 + d + 24) % 24;
        return (
          <div key={en} className={`rounded-xl border-[2.5px] border-ink p-2.5 text-center ${d === 0 ? 'bg-note' : 'bg-white'}`}>
            <p className="m-0 font-extrabold">{lang === 'fr' ? fr : en}</p>
            <p className="m-0 text-2xl font-extrabold tabular-nums">{lang === 'fr' ? `${hh} h` : `${hh}:00`}</p>
            {next ? <p className="m-0 text-xs text-ink/60">{lang === 'fr' ? 'le lendemain' : 'next day'}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function Seasons({ lang }: { lang: Lang }) {
  const pos = [
    // The axis points the same way all year (north end to the right): in June the
    // north leans towards the Sun, in December away from it.
    { x: 40, y: 90, fr: 'juin', en: 'June' }, { x: 170, y: 150, fr: 'septembre', en: 'September' },
    { x: 300, y: 90, fr: 'décembre', en: 'December' }, { x: 170, y: 30, fr: 'mars', en: 'March' },
  ];
  return (
    <svg viewBox="0 0 340 185" className="w-full max-w-md mx-auto block" role="img"
      aria-label={lang === 'fr' ? 'La Terre autour du Soleil : son axe reste penché dans la même direction toute l’année' : 'The Earth around the Sun: its axis stays tilted the same way all year'}>
      <ellipse cx="170" cy="90" rx="130" ry="60" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="170" cy="90" r="22" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      {pos.map(p => (
        <g key={p.en}>
          <circle cx={p.x} cy={p.y} r="14" fill="#2464d6" stroke={INK} strokeWidth="2.5" />
          <line x1={p.x - 8} y1={p.y + 18} x2={p.x + 8} y2={p.y - 18} stroke={INK} strokeWidth="3" />
          <text x={p.x} y={p.y + (p.y < 90 ? -24 : 34)} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK}>{lang === 'fr' ? p.fr : p.en}</text>
        </g>
      ))}
    </svg>
  );
}

const EARTH: LessonStep[] = [
  {
    title: { fr: 'La Terre tourne sur elle-même', en: 'The Earth spins' },
    body: {
      fr: 'Le Soleil éclaire toujours la moitié de la Terre. Mais la Terre tourne sur elle-même en <b>24 heures</b> : chaque ville passe du côté éclairé (le jour) au côté sombre (la nuit). Fais avancer l’heure !',
      en: 'The Sun always lights half of the Earth. But the Earth spins round once every <b>24 hours</b>: each town goes from the lit side (day) to the dark side (night). Move the time along!',
    },
    visual: lang => <DayNight lang={lang} />,
    note: { fr: 'La Terre tourne d’ouest en est : c’est pour ça que le Soleil se lève à l’est.', en: 'The Earth turns from west to east: that is why the Sun rises in the east.' },
  },
  {
    title: { fr: 'Les fuseaux horaires', en: 'Time zones' },
    body: {
      fr: 'Quand il est midi à Montréal, le Soleil s’est déjà couché au Japon ! Pour que midi tombe quand le Soleil est haut, on a découpé la Terre en tranches, les <b>fuseaux horaires</b> : 24 fuseaux d’environ 15 degrés, un par heure.',
      en: 'When it is noon in Montreal, the Sun has already set in Japan! So that noon comes when the Sun is high, the Earth is cut into slices, the <b>time zones</b>: 24 zones of about 15 degrees, one for each hour.',
    },
    visual: lang => <Clocks lang={lang} />,
    note: { fr: 'En allant vers l’est, on avance sa montre ; vers l’ouest, on la recule.', en: 'Going east, put your watch forward; going west, put it back.' },
  },
  {
    title: { fr: 'Les saisons', en: 'The seasons' },
    body: {
      fr: 'La Terre fait le tour du Soleil en un an, et son axe est penché de <b>23,4 degrés</b>, toujours dans la même direction. En juin, notre moitié de la Terre penche vers le Soleil : les jours sont longs et le Soleil monte haut, c’est l’été. En décembre, elle penche de l’autre côté : c’est l’hiver.',
      en: 'The Earth goes round the Sun in a year, and its axis is tilted by <b>23.4 degrees</b>, always in the same direction. In June our half of the Earth leans towards the Sun: days are long and the Sun climbs high, it is summer. In December it leans away: it is winter.',
    },
    visual: lang => <Seasons lang={lang} />,
    note: { fr: 'Les saisons ne viennent pas de la distance au Soleil : quand c’est l’été chez nous, c’est l’hiver en Australie !', en: 'Seasons do not come from the distance to the Sun: when it is summer here, it is winter in Australia!' },
  },
];

export function EarthLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'La Terre qui tourne', en: 'The Turning Earth' }} color={geography.color} steps={EARTH}
    links={geography.links} onStartExercise={onStartExercise} onCancel={onCancel} />;
}
