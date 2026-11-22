import React, { useState } from 'react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from '../components/LessonPlayer';
import { STATIONS } from '../content/stations';

// The lessons of the Science station that follow the pages for kids on slashbin.net:
// electricity, magnets, gears, the solar system (Physics-for-kids) and acids and
// bases (Chemistry-for-kids). Each one leads to the matching exercise of the
// Practice Room (see content/stations.ts) and links to the full page of the site.

const INK = '#17233d';
const science = STATIONS.find(s => s.id === 'science')!;
const linkTo = (part: string) => science.links.filter(l => l.href.includes(part));
const img = (src: string, alt = '') => (
  <img src={src} alt={alt} loading="lazy" className="block mx-auto max-h-72 w-auto max-w-full rounded-2xl border-[3px] border-ink" />
);

type LessonProps = { onCancel: () => void; onStartExercise?: () => void };

// ---------------------------------------------------------------- Electricity

function Circuit({ lang, series = false }: { lang: Lang; series?: boolean }) {
  const [on, setOn] = useState(false);
  const glow = on ? '#ffd23f' : '#f2f4f7';
  const bulb = (x: number) => (
    <g key={x}>
      {on && <circle cx={x} cy={40} r={30} fill="#ffd23f" opacity={0.35} />}
      <circle cx={x} cy={40} r={18} fill={glow} stroke={INK} strokeWidth={3} />
      <path d={`M ${x - 7} 50 L ${x - 7} 42 C ${x - 7} 30, ${x + 7} 30, ${x + 7} 42 L ${x + 7} 50`} fill="none" stroke={on ? '#e23b2e' : INK} strokeWidth={2.5} />
      <rect x={x - 9} y={56} width={18} height={9} rx={2} fill="#9aa5b8" stroke={INK} strokeWidth={2} />
    </g>
  );
  return (
    <div className="text-center">
      <svg viewBox="0 0 360 200" className="w-full max-w-md mx-auto block" role="img"
        aria-label={lang === 'fr' ? `Un circuit avec une pile, ${series ? 'deux ampoules' : 'une ampoule'} et un interrupteur ${on ? 'fermé : le courant passe' : 'ouvert : le courant ne passe pas'}` : `A circuit with a battery, ${series ? 'two bulbs' : 'a bulb'} and a switch, ${on ? 'closed: current flows' : 'open: no current'}`}>
        <path d="M 60 40 L 60 160 L 150 160" fill="none" stroke={on ? '#e23b2e' : INK} strokeWidth={5} />
        <path d="M 230 160 L 300 160 L 300 40 L 60 40" fill="none" stroke={on ? '#e23b2e' : INK} strokeWidth={5} />
        {series ? [140, 220].map(bulb) : bulb(180)}
        <rect x="35" y="80" width="50" height="44" rx="4" fill="#2464d6" stroke={INK} strokeWidth={3} />
        <rect x="52" y="72" width="16" height="8" fill={INK} />
        <text x="60" y="108" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">+ −</text>
        <circle cx="150" cy="160" r="5" fill={INK} /><circle cx="230" cy="160" r="5" fill={INK} />
        <line x1="150" y1="160" x2={on ? 230 : 220} y2={on ? 160 : 128} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <button onClick={() => setOn(!on)} className="chunky go mt-2" aria-pressed={on}>
        {lang === 'fr' ? (on ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur') : (on ? 'Open the switch' : 'Close the switch')}
      </button>
    </div>
  );
}

function Materials({ lang }: { lang: Lang }) {
  const col = (title: string, items: string[], bg: string) => (
    <div className="flex-1 min-w-[12rem] rounded-2xl border-[3px] border-ink p-4" style={{ background: bg }}>
      <p className="font-extrabold text-lg mb-2">{title}</p>
      <ul className="m-0 pl-5 list-disc space-y-0.5">{items.map(i => <li key={i}>{i}</li>)}</ul>
    </div>
  );
  return lang === 'fr' ? (
    <div className="flex flex-wrap gap-4">
      {col('Conducteurs', ['le cuivre des fils', 'le fer et l’acier', 'l’aluminium', 'le graphite d’un crayon', 'l’eau salée'], '#c9eedb')}
      {col('Isolants', ['le plastique', 'le caoutchouc', 'le bois', 'le verre', 'le papier'], '#ffd6cf')}
    </div>
  ) : (
    <div className="flex flex-wrap gap-4">
      {col('Conductors', ['the copper of wires', 'iron and steel', 'aluminium', 'pencil graphite', 'salt water'], '#c9eedb')}
      {col('Insulators', ['plastic', 'rubber', 'wood', 'glass', 'paper'], '#ffd6cf')}
    </div>
  );
}

const ELECTRICITY: LessonStep[] = [
  {
    title: { fr: 'Le courant, c’est une ronde', en: 'Current goes round and round' },
    body: {
      fr: 'Dans un fil électrique, de minuscules particules, les <b>électrons</b>, avancent toutes ensemble : c’est le <b>courant</b>. La pile les pousse. Pour que le courant passe, il faut un chemin qui fait le tour complet : un <b>circuit fermé</b>. Ferme l’interrupteur !',
      en: 'In an electric wire, tiny particles called <b>electrons</b> move along together: this is the <b>current</b>. The battery pushes them. For the current to flow, it needs a path that goes all the way round: a <b>closed circuit</b>. Close the switch!',
    },
    visual: lang => <Circuit lang={lang} />,
    note: { fr: 'Un circuit ouvert, c’est comme un pont levé : les trains ne passent plus.', en: 'An open circuit is like a raised bridge: no train can get across.' },
  },
  {
    title: { fr: 'Conducteurs et isolants', en: 'Conductors and insulators' },
    body: {
      fr: 'Certains matériaux laissent passer le courant : ce sont des <b>conducteurs</b>, comme les métaux. D’autres l’arrêtent : ce sont des <b>isolants</b>, comme le plastique. C’est pour ça que les fils sont en cuivre, entouré de plastique.',
      en: 'Some materials let the current through: they are <b>conductors</b>, like metals. Others stop it: they are <b>insulators</b>, like plastic. That is why wires are made of copper wrapped in plastic.',
    },
    visual: lang => <Materials lang={lang} />,
    note: { fr: 'Surprise : la mine d’un crayon (du graphite) conduit le courant, même si ce n’est pas un métal.', en: 'Surprise: a pencil lead (graphite) conducts current, even though it is not a metal.' },
  },
  {
    title: { fr: 'Deux ampoules à la suite', en: 'Two bulbs in a row' },
    body: {
      fr: 'Quand deux ampoules sont l’une après l’autre sur le même chemin, on dit qu’elles sont <b>en série</b>. Le courant traverse les deux. Si une ampoule grille, le chemin est coupé et l’autre s’éteint aussi. Dans un montage <b>en parallèle</b>, chaque ampoule a son propre chemin : l’autre reste allumée.',
      en: 'When two bulbs are one after the other on the same path, they are <b>in series</b>. The current goes through both. If one bulb blows, the path is cut and the other goes out too. In a <b>parallel</b> circuit, each bulb has its own path, so the other stays lit.',
    },
    visual: lang => <Circuit lang={lang} series />,
  },
  {
    title: { fr: 'Étienne, un circuit sur lequel on roule', en: 'Étienne, a circuit you can ride' },
    body: {
      fr: 'Étienne, la locomotive électrique, prend le courant dans le fil au-dessus des rails grâce à son pantographe. Le courant traverse ses moteurs, puis revient par les roues et les rails. Le train fait partie du circuit !',
      en: 'Étienne the electric engine picks up current from the wire above the track with his pantograph. The current goes through his motors, then back through the wheels and the rails. The train is part of the circuit!',
    },
    visual: img('/Physics-for-kids/Electricity/etienne.jpg?v=7'),
    note: { fr: 'Ne joue jamais avec l’électricité des prises ou des fils du train : elle est très dangereuse. Les piles, elles, ne risquent rien.', en: 'Never play with the electricity of sockets or railway wires: it is very dangerous. Batteries are safe.' },
  },
];

export function ElectricityLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'L’électricité', en: 'Electricity' }} color={science.color} steps={ELECTRICITY}
    links={linkTo('topic=electricity')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Magnets

function Magnets({ lang }: { lang: Lang }) {
  const [flip, setFlip] = useState(false);
  const right = flip ? ['S', 'N'] : ['N', 'S'];
  const attract = right[0] === 'S';   // the left magnet shows its N pole on the right
  const col = (p: string) => (p === 'N' ? '#e23b2e' : '#2464d6');
  const bar = (x: number, a: string, b: string) => (
    <g>
      <rect x={x} y="40" width="70" height="46" fill={col(a)} stroke={INK} strokeWidth={3} />
      <rect x={x + 70} y="40" width="70" height="46" fill={col(b)} stroke={INK} strokeWidth={3} />
      <text x={x + 35} y="71" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff">{a}</text>
      <text x={x + 105} y="71" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff">{b}</text>
    </g>
  );
  const gap = attract ? 6 : 70;
  return (
    <div className="text-center">
      <svg viewBox="0 0 420 120" className="w-full max-w-md mx-auto block" role="img"
        aria-label={lang === 'fr' ? (attract ? 'Les pôles N et S se font face : les aimants s’attirent' : 'Deux pôles N se font face : les aimants se repoussent') : (attract ? 'N faces S: the magnets attract' : 'N faces N: the magnets repel')}>
        {bar(60 - gap / 2, 'S', 'N')}
        {bar(200 + gap / 2, right[0], right[1])}
        <text x="210" y="112" textAnchor="middle" fontSize="18" fontWeight="800" fill={attract ? '#1c7a55' : '#b3261e'}>
          {lang === 'fr' ? (attract ? 'ils s’attirent' : 'ils se repoussent') : (attract ? 'they attract' : 'they repel')}
        </text>
      </svg>
      <button onClick={() => setFlip(!flip)} className="chunky go mt-1">{lang === 'fr' ? 'Retourner l’aimant de droite' : 'Turn the right magnet round'}</button>
    </div>
  );
}

const MAGNETS: LessonStep[] = [
  {
    title: { fr: 'Deux pôles : nord et sud', en: 'Two poles: north and south' },
    body: {
      fr: 'Un aimant a deux bouts, ses <b>pôles</b> : le pôle nord (N) et le pôle sud (S). Approche deux aimants : des pôles différents <b>s’attirent</b>, des pôles pareils <b>se repoussent</b>. Retourne l’aimant pour voir !',
      en: 'A magnet has two ends, its <b>poles</b>: the north pole (N) and the south pole (S). Bring two magnets together: opposite poles <b>attract</b>, like poles <b>repel</b>. Turn the magnet round to see!',
    },
    visual: lang => <Magnets lang={lang} />,
    note: { fr: 'N et S s’attirent ; N et N, ou S et S, se repoussent.', en: 'N and S attract; N and N, or S and S, repel.' },
  },
  {
    title: { fr: 'Ce qu’un aimant attire', en: 'What a magnet attracts' },
    body: {
      fr: 'Un aimant n’attire pas tous les métaux ! Il attire le <b>fer</b>, le <b>nickel</b> et le <b>cobalt</b>, et donc l’<b>acier</b>, qui est surtout fait de fer : un clou, un trombone, une capsule. Il n’attire pas l’aluminium d’une canette, le cuivre, l’or, le bois ni le plastique.',
      en: 'A magnet does not attract every metal! It attracts <b>iron</b>, <b>nickel</b> and <b>cobalt</b>, and so <b>steel</b>, which is mostly iron: a nail, a paper clip, a bottle cap. It does not attract the aluminium of a can, copper, gold, wood or plastic.',
    },
    visual: img('/Physics-for-kids/cards/magnets.jpg'),
  },
  {
    title: { fr: 'L’électroaimant de la grue', en: 'The crane’s electromagnet' },
    body: {
      fr: 'Enroule un fil autour d’un clou et fais-y passer du courant : le clou devient un aimant ! C’est un <b>électroaimant</b>. Son grand avantage : on l’arrête en coupant le courant. Au dépôt de ferraille, la grue soulève les morceaux de fer, puis les lâche juste au bon endroit.',
      en: 'Wind a wire round a nail and send a current through it: the nail becomes a magnet! This is an <b>electromagnet</b>. Its great trick: it stops when the current is switched off. At the scrapyard, the crane lifts the iron, then drops it in just the right place.',
    },
    note: { fr: 'Plus il y a de tours de fil ou de courant, plus l’électroaimant est fort.', en: 'More turns of wire, or more current, make the electromagnet stronger.' },
  },
  {
    title: { fr: 'La Terre est un grand aimant', en: 'The Earth is a giant magnet' },
    body: {
      fr: 'L’aiguille d’une boussole est un petit aimant. Elle se tourne toujours vers le nord, parce que la Terre elle-même se comporte comme un aimant géant. Les marins et les explorateurs s’en servent depuis des siècles pour trouver leur chemin.',
      en: 'A compass needle is a little magnet. It always turns to point north, because the Earth itself acts like a giant magnet. Sailors and explorers have used it for centuries to find their way.',
    },
  },
];

export function MagnetsLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les aimants', en: 'Magnets' }} color={science.color} steps={MAGNETS}
    links={linkTo('topic=magnets')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Gears

function gearPath(teeth: number, r: number) {
  const pts: string[] = [];
  const rIn = r - 7, rOut = r + 4;
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * 2 * Math.PI, w = (Math.PI / teeth) * 0.55;
    const P = (rad: number, ang: number) => `${(rad * Math.cos(ang)).toFixed(1)},${(rad * Math.sin(ang)).toFixed(1)}`;
    pts.push(P(rIn, a - w * 1.4), P(rOut, a - w), P(rOut, a + w), P(rIn, a + w * 1.4));
  }
  return 'M ' + pts.join(' L ') + ' Z';
}

function Gears({ lang }: { lang: Lang }) {
  const [big, setBig] = useState(24);
  const small = 12;
  const rS = small * 2.2, rB = big * 2.2;
  const durS = 3, durB = (durS * big) / small;   // the bigger gear turns more slowly
  return (
    <div className="text-center">
      <style>{`@keyframes sodor-cw{to{transform:rotate(360deg)}}@keyframes sodor-ccw{to{transform:rotate(-360deg)}}
        @media (prefers-reduced-motion: reduce){.sodor-gear{animation:none!important}}`}</style>
      <svg viewBox={`0 0 ${rS * 2 + rB * 2 + 40} ${rB * 2 + 30}`} className="w-full max-w-md mx-auto block" role="img"
        aria-label={lang === 'fr' ? `Une roue de ${small} dents et une roue de ${big} dents qui tournent en sens contraires` : `A ${small}-tooth gear and a ${big}-tooth gear turning opposite ways`}>
        <g transform={`translate(${rS + 10} ${rB + 15})`}>
          <g className="sodor-gear" style={{ animation: `sodor-cw ${durS}s linear infinite` }}>
            <path d={gearPath(small, rS)} fill="#ffd23f" stroke={INK} strokeWidth={3} />
            <circle r={5} fill={INK} /><line x1={0} y1={0} x2={rS - 10} y2={0} stroke={INK} strokeWidth={3} />
          </g>
        </g>
        <g transform={`translate(${rS * 2 + rB + 12} ${rB + 15})`}>
          <g className="sodor-gear" style={{ animation: `sodor-ccw ${durB}s linear infinite` }}>
            <path d={gearPath(big, rB)} fill="#2464d6" stroke={INK} strokeWidth={3} />
            <circle r={6} fill={INK} /><line x1={0} y1={0} x2={rB - 10} y2={0} stroke="#fff" strokeWidth={3} />
          </g>
        </g>
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2" role="group">
        {[12, 24, 36].map(z => (
          <button key={z} onClick={() => setBig(z)} aria-pressed={big === z} className="chunky">{lang === 'fr' ? `${z} dents` : `${z} teeth`}</button>
        ))}
      </div>
      <p className="mt-3 mb-0 font-bold">
        {lang === 'fr'
          ? `Quand la roue jaune (${small} dents) fait ${big / small === 1 ? 'un tour' : `${big / small} tours`}, la roue bleue (${big} dents) en fait un.`
          : `When the yellow gear (${small} teeth) makes ${big / small === 1 ? 'one turn' : `${big / small} turns`}, the blue gear (${big} teeth) makes one.`}
      </p>
    </div>
  );
}

const GEARS: LessonStep[] = [
  {
    title: { fr: 'Des roues qui ont des dents', en: 'Wheels with teeth' },
    body: {
      fr: 'Un <b>engrenage</b>, c’est deux roues dentées dont les dents s’emboîtent. Quand l’une tourne, elle pousse l’autre. Regarde bien : les deux roues tournent dans des <b>sens contraires</b>.',
      en: 'A pair of <b>gears</b> is two toothed wheels whose teeth fit together. When one turns, it pushes the other. Look closely: the two wheels turn in <b>opposite directions</b>.',
    },
    visual: lang => <Gears lang={lang} />,
    note: { fr: 'Dans une rangée de roues, les sens alternent : horaire, antihoraire, horaire…', en: 'In a row of gears, the directions alternate: clockwise, anticlockwise, clockwise…' },
  },
  {
    title: { fr: 'La petite roue tourne plus vite', en: 'The small gear turns faster' },
    body: {
      fr: 'Choisis une grande roue bleue. À chaque tour, la petite roue fait passer 12 dents. Si la grande en a 36, il faut 3 tours de la petite pour qu’elle fasse un tour. Tours × dents, c’est pareil pour les deux roues.',
      en: 'Pick a big blue gear. Each turn, the small gear moves 12 teeth along. If the big one has 36, the small one needs 3 turns for it to make one turn. Turns × teeth is the same for both gears.',
    },
    visual: lang => <Gears lang={lang} />,
    note: { fr: 'Petite roue qui entraîne une grande : moins vite, mais plus de force. Grande roue qui entraîne une petite : plus vite, mais moins de force.', en: 'A small gear driving a big one: slower, but more force. A big gear driving a small one: faster, but less force.' },
  },
  {
    title: { fr: 'Le train à crémaillère', en: 'The rack railway' },
    body: {
      fr: 'Sur une montagne très raide, les roues d’un train glisseraient. Le train de la montagne de Culdee Fell a une roue dentée sous la locomotive, qui s’accroche à un rail à dents entre les rails : la <b>crémaillère</b>. Le train grimpe comme sur une échelle !',
      en: 'On a very steep mountain, a train’s wheels would slip. The Culdee Fell mountain railway has a toothed wheel under the engine that grips a toothed rail between the rails: the <b>rack</b>. The train climbs as if on a ladder!',
    },
    visual: img('/Physics-for-kids/cards/gears.jpg'),
    note: { fr: 'On trouve aussi des engrenages dans les vélos, les horloges et les batteurs à œufs.', en: 'Gears are also found in bicycles, clocks and egg beaters.' },
  },
];

export function GearsLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les engrenages', en: 'Gears' }} color={science.color} steps={GEARS}
    links={linkTo('topic=gears')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- The solar system

const PLANETS = [
  { fr: 'Mercure', en: 'Mercury', r: 2440, c: '#9aa5b8' }, { fr: 'Vénus', en: 'Venus', r: 6052, c: '#e8c27a' },
  { fr: 'Terre', en: 'Earth', r: 6371, c: '#2464d6' }, { fr: 'Mars', en: 'Mars', r: 3390, c: '#e2683c' },
  { fr: 'Jupiter', en: 'Jupiter', r: 69911, c: '#c8925a' }, { fr: 'Saturne', en: 'Saturn', r: 58232, c: '#e3c97f' },
  { fr: 'Uranus', en: 'Uranus', r: 25362, c: '#7fd3dd' }, { fr: 'Neptune', en: 'Neptune', r: 24622, c: '#3f63d6' },
];

function PlanetSizes({ lang }: { lang: Lang }) {
  const scale = 46 / 69911;
  let x = 6;
  // A small planet still gets room for its name.
  const items = PLANETS.map(p => { const r = Math.max(2.5, p.r * scale); const slot = Math.max(2 * r, 52); const cx = x + slot / 2; x += slot + 10; return { p, r, cx }; });
  return (
    <svg viewBox={`0 0 ${x} 130`} className="w-full block" role="img"
      aria-label={lang === 'fr' ? 'Les huit planètes à la même échelle, de Mercure à Neptune' : 'The eight planets to the same scale, from Mercury to Neptune'}>
      {items.map(({ p, r, cx }) => (
        <g key={p.en}>
          <circle cx={cx} cy={56} r={r} fill={p.c} stroke={INK} strokeWidth={2} />
          {p.en === 'Saturn' && <ellipse cx={cx} cy={56} rx={r * 1.7} ry={r * 0.35} fill="none" stroke={INK} strokeWidth={2} />}
          <text x={cx} y={122} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>{lang === 'fr' ? p.fr : p.en}</text>
        </g>
      ))}
    </svg>
  );
}

// After the unit « Notre système solaire » of the pupil's science book: the order with its
// sentence, the two families, the astronomical unit, days and years, dwarf planets and moons.
const SOLAR: LessonStep[] = [
  {
    title: { fr: 'Le Soleil et ses huit planètes', en: 'The Sun and its eight planets' },
    body: {
      fr: 'Le Soleil est une <b>étoile</b> : il brille par lui-même. Huit planètes tournent autour de lui, de la plus proche à la plus lointaine : Mercure, Vénus, la Terre, Mars, puis la ceinture d’astéroïdes, puis Jupiter, Saturne, Uranus et Neptune.',
      en: 'The Sun is a <b>star</b>: it shines by itself. Eight planets travel around it, from the nearest to the farthest: Mercury, Venus, Earth, Mars, then the asteroid belt, then Jupiter, Saturn, Uranus and Neptune.',
    },
    visual: img('/Physics-for-kids/cards/solar-system.jpg'),
    note: { fr: 'Pour retenir l’ordre : quatre petites planètes telluriques, puis la ceinture d’astéroïdes, puis quatre géantes. La Terre est la troisième, Neptune la huitième et la dernière.', en: 'To remember the order: four small rocky planets, then the asteroid belt, then four giants. The Earth is the third, Neptune the eighth and the last.' },
  },
  {
    title: { fr: 'Deux familles de planètes', en: 'Two families of planets' },
    body: {
      fr: 'Les quatre planètes proches du Soleil sont les <b>planètes telluriques</b> : petites, faites de roches et de métaux, avec une surface solide. Les quatre lointaines sont les <b>planètes joviennes</b> : des géantes faites surtout de gaz, sans surface solide. Jupiter est la plus grosse : on pourrait y ranger plus de 1&nbsp;000 Terres !',
      en: 'The four planets near the Sun are the <b>rocky planets</b>: small, made of rock and metal, with a solid surface. The four far ones are the <b>giant planets</b>: made mostly of gas, with no solid surface. Jupiter is the biggest: more than 1,000 Earths could fit inside it!',
    },
    visual: lang => <PlanetSizes lang={lang} />,
    note: { fr: 'Pour les distances, on utilise l’<b>unité astronomique</b> : 1&nbsp;UA, c’est la distance Terre–Soleil, environ 150 millions de km. Neptune est à 30&nbsp;UA.', en: 'For distances, astronomers use the <b>astronomical unit</b>: 1 AU is the Earth–Sun distance, about 150 million km. Neptune is 30 AU away.' },
  },
  {
    title: { fr: 'Un jour, une année', en: 'A day, a year' },
    body: {
      fr: 'Une planète tourne sur elle-même : c’est sa <b>rotation</b>, un tour fait un <b>jour</b>. Elle tourne aussi autour du Soleil : c’est sa <b>révolution</b>, un tour fait une <b>année</b>. Mercure, toute proche, fait le tour du Soleil en 88 jours ; Neptune, très loin, met environ 165 ans !',
      en: 'A planet spins on itself: that is its <b>rotation</b>, one turn is a <b>day</b>. It also goes around the Sun: that is its <b>revolution</b>, one trip is a <b>year</b>. Mercury, very close, goes round in 88 days; Neptune, very far, takes about 165 years!',
    },
    note: { fr: 'Plus une planète est loin du Soleil, plus son année est longue. Et Vénus tourne si lentement sur elle-même que son jour est plus long que son année !', en: 'The farther a planet is from the Sun, the longer its year. And Venus spins so slowly that its day is longer than its year!' },
  },
  {
    title: { fr: 'Planètes naines et satellites', en: 'Dwarf planets and moons' },
    body: {
      fr: 'Une <b>planète naine</b> tourne autour du Soleil et elle est ronde, mais elle partage son orbite avec d’autres astres : Cérès, Pluton, Éris, Makémaké et Hauméa. Pluton était une planète jusqu’en 2006. Un <b>satellite naturel</b> tourne autour d’une planète : la Lune autour de la Terre, Titan autour de Saturne, Io et Europe autour de Jupiter.',
      en: 'A <b>dwarf planet</b> goes around the Sun and is round, but it shares its orbit with other bodies: Ceres, Pluto, Eris, Makemake and Haumea. Pluto was a planet until 2006. A <b>moon</b> goes around a planet: the Moon around the Earth, Titan around Saturn, Io and Europa around Jupiter.',
    },
    note: { fr: 'La leçon « Notre système solaire » de slashbin.net donne une fiche pour chaque planète.', en: 'The “Our Solar System” lesson on slashbin.net has a fact sheet for each planet.' },
  },
];

export function SolarSystemLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Le système solaire', en: 'The Solar System' }} color={science.color} steps={SOLAR}
    links={linkTo('topic=solar-system')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Acids and bases

const PH_COLORS = ['#e2231a', '#ef3b24', '#f3612a', '#f7892e', '#fbb034', '#fdd43a', '#d8e23d', '#6cc04a', '#2fae6b', '#1aa59a', '#1b8fc6', '#2a6ed1', '#4b52c6', '#6a3fb6', '#7b2a9e'];
const PH_ITEMS: Record<number, { fr: string; en: string }> = {
  0: { fr: 'acide de batterie', en: 'battery acid' }, 2: { fr: 'jus de citron', en: 'lemon juice' }, 3: { fr: 'vinaigre', en: 'vinegar' },
  5: { fr: 'café', en: 'coffee' }, 7: { fr: 'eau pure', en: 'pure water' }, 8: { fr: 'eau de mer', en: 'sea water' },
  9: { fr: 'bicarbonate de soude', en: 'baking soda' }, 10: { fr: 'savon', en: 'soap' }, 12: { fr: 'eau de Javel', en: 'bleach' },
};

function PhScale({ lang }: { lang: Lang }) {
  const [ph, setPh] = useState(7);
  const kind = ph < 7 ? (lang === 'fr' ? 'acide' : 'acidic') : ph > 7 ? (lang === 'fr' ? 'basique' : 'basic') : (lang === 'fr' ? 'neutre' : 'neutral');
  return (
    <div>
      <div className="flex rounded-xl overflow-hidden border-[3px] border-ink" role="group" aria-label={lang === 'fr' ? 'L’échelle de pH' : 'The pH scale'}>
        {PH_COLORS.map((c, i) => (
          <button key={i} onClick={() => setPh(i)} aria-pressed={ph === i} aria-label={`pH ${i}`}
            className={`flex-1 h-12 text-xs sm:text-sm font-extrabold text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)] ${ph === i ? 'outline-4 outline-ink -outline-offset-4' : ''}`}
            style={{ background: c }}>{i}</button>
        ))}
      </div>
      <p className="mt-3 mb-0 text-lg text-center">
        pH <b>{ph}</b> : <b>{kind}</b>{PH_ITEMS[ph] && <> — {lang === 'fr' ? PH_ITEMS[ph].fr : PH_ITEMS[ph].en}</>}
      </p>
    </div>
  );
}

const ACIDS: LessonStep[] = [
  {
    title: { fr: 'L’échelle de pH', en: 'The pH scale' },
    body: {
      fr: 'Le <b>pH</b> dit si un liquide est <b>acide</b>, <b>neutre</b> ou <b>basique</b>. Il va de 0 à 14 : sous 7, c’est acide ; à 7, c’est neutre, comme l’eau pure ; au-dessus de 7, c’est basique. Clique sur l’échelle !',
      en: '<b>pH</b> tells whether a liquid is <b>acidic</b>, <b>neutral</b> or <b>basic</b>. It goes from 0 to 14: below 7 is acidic; 7 is neutral, like pure water; above 7 is basic. Click on the scale!',
    },
    visual: lang => <PhScale lang={lang} />,
    note: { fr: 'Plus le pH est loin de 7, plus le liquide est fort… et dangereux.', en: 'The farther the pH is from 7, the stronger the liquid… and the more dangerous.' },
  },
  {
    title: { fr: 'Dans la cuisine et la salle de bain', en: 'In the kitchen and the bathroom' },
    body: {
      fr: 'Les acides ont souvent un goût aigre : le jus de citron et le vinaigre. Les bases sont souvent glissantes : le savon, le bicarbonate de soude, l’eau de Javel. Thomas en lunettes de protection te montre leur pH.',
      en: 'Acids often taste sour: lemon juice and vinegar. Bases often feel slippery: soap, baking soda, bleach. Thomas, in his safety goggles, shows you their pH.',
    },
    visual: img('/Chemistry-for-kids/thomas-ph.jpg'),
    note: { fr: 'On ne goûte jamais un produit pour savoir s’il est acide, et on ne mélange jamais des produits ménagers.', en: 'Never taste a product to find out if it is acidic, and never mix household products.' },
  },
  {
    title: { fr: 'Le papier de tournesol', en: 'Litmus paper' },
    body: {
      fr: 'Pour mesurer sans danger, les chimistes trempent un papier spécial, le <b>papier de tournesol</b>. Il devient <b>rouge</b> dans un acide et <b>bleu</b> dans une base. Quand on verse une base dans un acide, ils se neutralisent : on obtient de l’eau et un sel.',
      en: 'To test safely, chemists dip a special paper, <b>litmus paper</b>. It turns <b>red</b> in an acid and <b>blue</b> in a base. When a base is poured into an acid, they cancel each other out: you get water and a salt.',
    },
    note: { fr: 'Acide → rouge. Base → bleu.', en: 'Acid → red. Base → blue.' },
  },
];

export function AcidsBasesLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les acides et les bases', en: 'Acids and Bases' }} color={science.color} steps={ACIDS}
    links={linkTo('Chemistry-for-kids')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}
