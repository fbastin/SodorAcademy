import React, { useEffect, useState } from 'react';
import { Lang, Text } from '../i18n';
import LessonPlayer, { LessonStep } from '../components/LessonPlayer';
import { STATIONS, SiteLink } from '../content/stations';
import { loadPractice } from '../practice/bank';

// The music theory lessons of the Music station, after the music theory guides of
// slashbin.net (/musique/theorie/): reading notes, rhythm, intervals and scales,
// chords. Each one leads to the matching topic of the Practice Room and links to
// its guides. The staves are drawn by the Practice Room's own engraver
// (Practice/skills-musique.js, loaded with the exercises), with the glyphs of
// LilyPond's Emmentaler font, like the guides.

const INK = '#17233d';
const music = STATIONS.find(s => s.id === 'music')!;
const PRACTICE = music.links.filter(l => l.href.startsWith('/Practice/'));
type LessonProps = { onCancel: () => void; onStartExercise?: () => void };

// A guide of /musique/theorie/, as a link at the end of a lesson.
const guide = (file: string, title: Text, desc: { fr: string; en: string }): SiteLink => ({
  href: `/musique/theorie/${file}.pdf`, card: '/musique/cards/theorie.jpg',
  title, desc: { fr: desc.fr, en: `${desc.en} (in French)` },
});

// ---------------------------------------------------------------- the staff

type Item = Record<string, unknown>;
type Spec = { clef?: string; key?: number; time?: unknown; noClef?: boolean; zoom?: number; items: Item[] };

function Staff({ spec, lang }: { spec: Spec; lang: Lang }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let live = true;
    loadPractice()
      .then(() => {
        const M = (window as any).MUSIC_STAFF;
        if (live && M) setSvg(M.score(spec)(lang));
      })
      .catch(() => undefined);
    return () => { live = false; };
  }, [lang]);
  return (
    <div className="min-h-[110px] text-center [&_svg]:inline-block [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
const staff = (spec: Spec) => (lang: Lang) => <Staff spec={spec} lang={lang} />;
const twoStaves = (a: Spec, b: Spec) => (lang: Lang) => (
  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2"><Staff spec={a} lang={lang} /><Staff spec={b} lang={lang} /></div>
);

// Notes written 'c4', 'f#4', 'bb3' (c4 is middle C), and their names under the staff.
const FR: Record<string, string> = { c: 'do', d: 'ré', e: 'mi', f: 'fa', g: 'sol', a: 'la', b: 'si' };
const SIGN: Record<string, string> = { '': '', '#': '♯', b: '♭' };
const nameOf = (p: string): Text => {
  const m = /^([a-g])(#|b)?/.exec(p)!;
  return { fr: FR[m[1]] + SIGN[m[2] || ''], en: m[1].toUpperCase() + SIGN[m[2] || ''] };
};
const row = (list: string, d = 'w', named = true, gap = 0): Item[] =>
  list.split(' ').map(p => ({ notes: [p], d, gap, ...(named ? { text: nameOf(p) } : {}) }));
const chord = (list: string, text?: Text | string, d = 'w', gap = 10): Item => ({ notes: list.split(' '), d, gap, text });

// ---------------------------------------------------------------- Reading notes

const READ: LessonStep[] = [
  {
    title: { fr: 'La portée', en: 'The staff' },
    body: {
      fr: 'La musique s’écrit sur une <b>portée</b> : cinq lignes, que l’on compte de bas en haut, et les quatre <b>interlignes</b> entre elles. Une note se pose sur une ligne ou dans un interligne. Plus elle est haute sur la portée, plus le son est aigu.',
      en: 'Music is written on a <b>staff</b>: five lines, counted from the bottom up, and the four <b>spaces</b> between them. A note sits on a line or in a space. The higher it is on the staff, the higher the sound.',
    },
    visual: staff({ noClef: true, items: row('e4 f4 g4 a4 b4 c5 d5 e5 f5', 'w', false, -4) }),
  },
  {
    title: { fr: 'La clé de sol', en: 'The treble clef' },
    body: {
      fr: 'La <b>clé</b>, au début de la portée, donne leur nom aux notes. La <b>clé de sol</b> s’enroule autour de la 2<sup>e</sup> ligne : la note de cette ligne est un sol. Les autres suivent, une par ligne et une par interligne.',
      en: 'The <b>clef</b>, at the start of the staff, gives the notes their names. The <b>treble clef</b>, or G clef, curls around the 2nd line: the note on that line is a G. The others follow, one per line and one per space.',
    },
    visual: staff({ items: row('c4 d4 e4 f4 g4 a4 b4 c5', 'w', true, 2) }),
    note: { fr: 'En montant : do, ré, mi, fa, sol, la, si, puis do encore, une octave plus haut.', en: 'Going up: C, D, E, F, G, A, B, then C again, an octave higher.' },
  },
  {
    title: { fr: 'La clé de fa', en: 'The bass clef' },
    body: {
      fr: 'Pour les sons graves, comme ceux de la main gauche au piano, on écrit en <b>clé de fa</b>. Ses deux points entourent la 4<sup>e</sup> ligne : la note de cette ligne est un fa.',
      en: 'For low sounds, like those of the left hand on the piano, music is written in the <b>bass clef</b>, or F clef. Its two dots sit on either side of the 4th line: the note on that line is an F.',
    },
    visual: staff({ clef: 'F', items: row('c3 d3 e3 f3 g3 a3 b3 c4', 'w', true, 2) }),
  },
  {
    title: { fr: 'Le do central', en: 'Middle C' },
    body: {
      fr: 'Le <b>do central</b>, au milieu du clavier du piano, s’écrit sur une petite <b>ligne supplémentaire</b> : sous la portée en clé de sol, au-dessus en clé de fa. Les deux portées réunies forment la grande portée du piano.',
      en: '<b>Middle C</b>, in the middle of the piano keyboard, is written on a short <b>ledger line</b>: below the staff in the treble clef, above it in the bass clef. Together, the two staves make the piano’s grand staff.',
    },
    visual: twoStaves(
      { items: [{ notes: ['c4'], d: 'w', gap: 12, text: { fr: 'do central', en: 'middle C' } }] },
      { clef: 'F', items: [{ notes: ['c4'], d: 'w', gap: 12, text: { fr: 'do central', en: 'middle C' } }] },
    ),
  },
  {
    title: { fr: 'Les altérations', en: 'Sharps and flats' },
    body: {
      fr: 'Le <b>dièse</b> (♯) hausse la note d’un demi-ton, le <b>bémol</b> (♭) la baisse d’un demi-ton, et le <b>bécarre</b> (♮) la rend naturelle. Le signe s’écrit devant la note, mais se dit après : « fa dièse ».',
      en: 'The <b>sharp</b> (♯) raises the note by a semitone, the <b>flat</b> (♭) lowers it by a semitone, and the <b>natural</b> (♮) makes it natural again. The sign is written before the note: F♯, B♭.',
    },
    visual: staff({ items: [
      { notes: ['f4'], d: 'w', gap: 8, text: { fr: 'fa', en: 'F' } }, { notes: ['f#4'], d: 'w', gap: 8, text: { fr: 'fa♯', en: 'F♯' } },
      { notes: ['bb4'], d: 'w', gap: 8, text: { fr: 'si♭', en: 'B♭' } }, { notes: ['b4'], d: 'w', gap: 8, text: { fr: 'si♮', en: 'B♮' } },
    ] }),
    note: { fr: 'Un signe écrit devant une note vaut jusqu’à la barre de mesure. Ceux de l’armure, juste après la clé, valent pour tout le morceau.', en: 'A sign written before a note lasts until the bar line. Those of the key signature, just after the clef, last for the whole piece.' },
  },
];

export function ReadingNotesLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Lire les notes', en: 'Reading Notes' }} color={music.color} steps={READ}
    links={[guide('lecture', { fr: 'Lire les notes', en: 'Reading notes' }, { fr: 'Le guide complet : la portée, les sept clés, le do central et les altérations, avec des exercices corrigés.', en: 'The full guide: the staff, the seven clefs, middle C and accidentals, with answered exercises' }), ...PRACTICE]}
    onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Rhythm

const RHYTHM: LessonStep[] = [
  {
    title: { fr: 'Les figures de notes', en: 'Note values' },
    body: {
      fr: 'La forme d’une note dit sa durée. La <b>ronde</b> dure le plus longtemps ; la <b>blanche</b>, moitié moins ; puis viennent la <b>noire</b>, la <b>croche</b> et la <b>double croche</b>. Chaque figure vaut deux fois la suivante.',
      en: 'The shape of a note tells how long it lasts. The <b>whole note</b> lasts longest; the <b>half note</b>, half as long; then come the <b>quarter note</b>, the <b>eighth note</b> and the <b>sixteenth note</b>. Each one is worth two of the next.',
    },
    visual: staff({ noClef: true, items: [
      { notes: ['g4'], d: 'w', gap: 18, text: { fr: 'ronde', en: 'whole' } }, { notes: ['g4'], d: 'h', gap: 18, text: { fr: 'blanche', en: 'half' } },
      { notes: ['g4'], d: 'q', gap: 18, text: { fr: 'noire', en: 'quarter' } }, { notes: ['g4'], d: 'e', gap: 18, text: { fr: 'croche', en: 'eighth' } },
      { notes: ['g4'], d: 's', gap: 18, text: { fr: 'double croche', en: 'sixteenth' } },
    ] }),
    note: { fr: '1 ronde = 2 blanches = 4 noires = 8 croches = 16 doubles croches.', en: '1 whole note = 2 half notes = 4 quarter notes = 8 eighth notes = 16 sixteenth notes.' },
  },
  {
    title: { fr: 'Les silences', en: 'Rests' },
    body: {
      fr: 'Chaque figure a son <b>silence</b>, qui dure autant qu’elle : la <b>pause</b> comme la ronde, la <b>demi-pause</b> comme la blanche, le <b>soupir</b> comme la noire, le <b>demi-soupir</b> comme la croche, le <b>quart de soupir</b> comme la double croche.',
      en: 'Each note has its <b>rest</b>, which lasts just as long: the <b>whole rest</b> like the whole note, the <b>half rest</b> like the half note, the <b>quarter rest</b>, the <b>eighth rest</b> and the <b>sixteenth rest</b>.',
    },
    visual: staff({ noClef: true, items: [
      { t: 'r', d: 'w', gap: 22, text: { fr: 'pause', en: 'whole' } }, { t: 'r', d: 'h', gap: 22, text: { fr: 'demi-pause', en: 'half' } },
      { t: 'r', d: 'q', gap: 22, text: { fr: 'soupir', en: 'quarter' } }, { t: 'r', d: 'e', gap: 22, text: { fr: 'demi-soupir', en: 'eighth' } },
      { t: 'r', d: 's', gap: 22, text: { fr: 'quart de soupir', en: 'sixteenth' } },
    ] }),
    note: { fr: 'La pause pend sous la 4<sup>e</sup> ligne ; la demi-pause est posée sur la 3<sup>e</sup>.', en: 'The whole rest hangs below the 4th line; the half rest sits on the 3rd.' },
  },
  {
    title: { fr: 'Le point et la liaison', en: 'Dots and ties' },
    body: {
      fr: 'Le <b>point</b>, à droite d’une note, ajoute la moitié de sa valeur : une blanche pointée dure 2 + 1 = 3 noires. La <b>liaison</b> qui relie deux notes de même hauteur additionne leurs valeurs : on joue la première, et on la tient.',
      en: 'A <b>dot</b>, to the right of a note, adds half its value: a dotted half note lasts 2 + 1 = 3 quarter notes. A <b>tie</b> joining two notes of the same pitch adds their values: you play the first one and hold it.',
    },
    visual: staff({ noClef: true, items: [
      { notes: ['g4'], d: 'h', dot: 1, gap: 26, text: { fr: '2 + 1 = 3 temps', en: '2 + 1 = 3 beats' } },
      { notes: ['g4'], d: 'h', tie: true, text: { fr: '2 + 1 = 3 temps', en: '2 + 1 = 3 beats' } }, { notes: ['g4'], d: 'q' },
    ] }),
  },
  {
    title: { fr: 'La mesure', en: 'Bars and time signatures' },
    body: {
      fr: 'Les <b>barres de mesure</b> découpent la musique en <b>mesures</b> de même durée. Au début, deux chiffres : celui du haut compte les <b>temps</b> de chaque mesure, celui du bas dit quelle figure fait un temps (4 : la noire, 2 : la blanche, 8 : la croche). En 3/4, trois noires par mesure.',
      en: '<b>Bar lines</b> cut the music into <b>bars</b> of equal length. At the start, two numbers: the top one counts the <b>beats</b> in each bar, the bottom one says which note is one beat (4: the quarter note, 2: the half note, 8: the eighth note). In 3/4, three quarter notes per bar.',
    },
    visual: staff({ time: [3, 4], items: [
      { notes: ['g4'], d: 'q', text: '1' }, { notes: ['b4'], d: 'q', text: '2' }, { notes: ['d5'], d: 'q', text: '3' }, { t: 'bar' },
      { notes: ['c5'], d: 'h', gap: 8, text: '1 – 2' }, { notes: ['a4'], d: 'q', text: '3' }, { t: 'bar' },
      { notes: ['g4'], d: 'h', dot: 1, text: '1 – 2 – 3' }, { t: 'end' },
    ] }),
    note: { fr: 'Le premier temps de chaque mesure est le plus fort.', en: 'The first beat of each bar is the strongest.' },
  },
  {
    title: { fr: 'Les mesures composées', en: 'Compound time' },
    body: {
      fr: 'Dans une mesure <b>composée</b>, comme 6/8, chaque temps se partage en trois : le temps est une noire pointée, qui vaut trois croches. Le 6/8 compte donc deux temps, et non six.',
      en: 'In <b>compound time</b>, such as 6/8, each beat splits into three: the beat is a dotted quarter note, worth three eighth notes. So 6/8 has two beats, not six.',
    },
    visual: staff({ time: [6, 8], items: [
      { notes: ['g4'], d: 'q', dot: 1, gap: 6, text: '1' }, { notes: ['b4'], d: 'q', dot: 1, gap: 6, text: '2' }, { t: 'bar' },
      { notes: ['d5'], d: 'q', dot: 1, gap: 6, text: '1' }, { notes: ['g4'], d: 'q', dot: 1, gap: 6, text: '2' }, { t: 'end' },
    ] }),
  },
];

export function RhythmLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Le rythme', en: 'Rhythm' }} color={music.color} steps={RHYTHM}
    links={[
      guide('valeurs', { fr: 'Les valeurs', en: 'Note values' }, { fr: 'De la ronde aux groupes irréguliers, avec le point et la liaison.', en: 'From the whole note to tuplets, with dots and ties' }),
      guide('mesure', { fr: 'La mesure', en: 'Metre' }, { fr: 'Du temps aux mesures composées, la syncope et le contretemps.', en: 'From the beat to compound time, syncopation and off-beats' }),
      ...PRACTICE,
    ]}
    onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Intervals and scales

// One octave of a keyboard, with the semitones between E and F and between B and C.
function Keyboard({ lang }: { lang: Lang }) {
  const names = lang === 'fr' ? ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si', 'do'] : ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
  const W = 46, blacks = [0, 1, 3, 4, 5];
  return (
    <svg viewBox="0 0 380 190" className="w-full max-w-md mx-auto block" role="img"
      aria-label={lang === 'fr' ? 'Un clavier de do à do : pas de touche noire entre mi et fa, ni entre si et do' : 'A keyboard from C to C: no black key between E and F, or between B and C'}>
      {names.map((n, i) => (
        <g key={i}>
          <rect x={6 + i * W} y={36} width={W} height={120} rx={5} fill={i === 2 || i === 3 || i === 6 || i === 7 ? '#fde3f0' : '#fff'} stroke={INK} strokeWidth={2.5} />
          <text x={6 + i * W + W / 2} y={145} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK}>{n}</text>
        </g>
      ))}
      {blacks.map(i => <rect key={i} x={6 + (i + 1) * W - 14} y={36} width={28} height={74} rx={3} fill={INK} />)}
      {[3, 7].map(i => (
        <g key={i}>
          <path d={`M ${6 + i * W - 18} 28 Q ${6 + i * W} 12 ${6 + i * W + 18} 28`} fill="none" stroke="#c2368a" strokeWidth={3} />
          <text x={6 + i * W} y={14} textAnchor="middle" fontSize={15} fontWeight={800} fill="#c2368a">½</text>
        </g>
      ))}
      <text x={190} y={182} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>
        {lang === 'fr' ? 'mi–fa et si–do : un demi-ton' : 'E–F and B–C: a semitone'}
      </text>
    </svg>
  );
}

const SCALES: LessonStep[] = [
  {
    title: { fr: 'Ton et demi-ton', en: 'Tones and semitones' },
    body: {
      fr: 'Sur un clavier, d’une touche à sa voisine, blanche ou noire, il y a un <b>demi-ton</b>. Deux demi-tons font un <b>ton</b>. Entre mi et fa, et entre si et do, il n’y a pas de touche noire : ces notes ne sont qu’à un demi-ton.',
      en: 'On a keyboard, from one key to the very next, white or black, is a <b>semitone</b>. Two semitones make a <b>tone</b>. Between E and F, and between B and C, there is no black key: those notes are only a semitone apart.',
    },
    visual: lang => <Keyboard lang={lang} />,
  },
  {
    title: { fr: 'Les intervalles', en: 'Intervals' },
    body: {
      fr: 'Un <b>intervalle</b> est l’écart entre deux notes. On le nomme en comptant les notes, la première et la dernière comprises : de do à mi, do, ré, mi, trois notes, une <b>tierce</b>. Viennent ainsi la seconde, la tierce, la quarte, la quinte, la sixte, la septième et l’octave.',
      en: 'An <b>interval</b> is the distance between two notes. It is named by counting the notes, the first and the last included: from C to E, C, D, E, three notes, a <b>third</b>. So come the second, third, fourth, fifth, sixth, seventh and octave.',
    },
    visual: staff({ items: [
      chord('c4 d4', { fr: '2de', en: '2nd' }), chord('c4 e4', { fr: '3ce', en: '3rd' }), chord('c4 f4', { fr: '4te', en: '4th' }), chord('c4 g4', { fr: '5te', en: '5th' }),
      chord('c4 a4', { fr: '6te', en: '6th' }), chord('c4 b4', { fr: '7e', en: '7th' }), chord('c4 c5', { fr: '8ve', en: '8ve' }),
    ] }),
    note: { fr: 'La qualité se trouve en comptant les demi-tons : une tierce de 4 demi-tons est majeure, de 3, mineure.', en: 'The quality comes from counting semitones: a third of 4 semitones is major, of 3, minor.' },
  },
  {
    title: { fr: 'La gamme majeure', en: 'The major scale' },
    body: {
      fr: 'La gamme de <b>do majeur</b> monte de do à do par les touches blanches : ton, ton, demi-ton, ton, ton, ton, demi-ton. Toute gamme majeure suit ce modèle : deux groupes de quatre notes pareils, les <b>tétracordes</b>, séparés par un ton.',
      en: 'The <b>C major</b> scale goes up from C to C on the white keys: tone, tone, semitone, tone, tone, tone, semitone. Every major scale follows this pattern: two matching groups of four notes, the <b>tetrachords</b>, a tone apart.',
    },
    visual: staff({ items: row('c4 d4 e4 f4 g4 a4 b4 c5', 'w', true, 2) }),
    note: { fr: 'Ton, ton, demi-ton — ton — ton, ton, demi-ton.', en: 'Tone, tone, semitone — tone — tone, tone, semitone.' },
  },
  {
    title: { fr: 'Les armures', en: 'Key signatures' },
    body: {
      fr: 'Pour garder ce modèle à partir d’une autre note, il faut des dièses ou des bémols. La gamme de <b>sol majeur</b> a besoin d’un fa dièse. On l’écrit une fois pour toutes après la clé : c’est l’<b>armure</b>.',
      en: 'To keep this pattern from another note, sharps or flats are needed. The <b>G major</b> scale needs an F♯. It is written once and for all after the clef: the <b>key signature</b>.',
    },
    visual: staff({ key: 1, items: row('g4 a4 b4 c5 d5 e5 f#5 g5', 'w', true, 2) }),
    note: { fr: 'Les dièses s’ajoutent toujours dans le même ordre : fa, do, sol, ré, la, mi, si. Les bémols, à l’envers : si, mi, la, ré, sol, do, fa.', en: 'Sharps are always added in the same order: F, C, G, D, A, E, B. Flats, the other way round: B, E, A, D, G, C, F.' },
  },
  {
    title: { fr: 'Les gammes mineures', en: 'Minor scales' },
    body: {
      fr: 'Chaque gamme majeure a une <b>relative mineure</b>, de même armure, une tierce mineure plus bas : <b>la mineur</b> pour do majeur. La mineure <b>harmonique</b> hausse son 7<sup>e</sup> degré, pour qu’il monte vers la tonique : sol dièse, en la mineur.',
      en: 'Each major scale has a <b>relative minor</b>, with the same key signature, a minor third lower: <b>A minor</b> for C major. The <b>harmonic</b> minor raises its 7th degree so that it leads up to the tonic: G♯, in A minor.',
    },
    visual: staff({ items: row('a4 b4 c5 d5 e5 f5 g#5 a5', 'w', true, 2) }),
    note: { fr: 'La mineure mélodique, en montant, hausse le 6<sup>e</sup> et le 7<sup>e</sup> degré ; en descendant, elle reprend la mineure naturelle.', en: 'The melodic minor raises the 6th and 7th degrees going up; going down, it is the natural minor again.' },
  },
];

export function IntervalsScalesLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Intervalles et gammes', en: 'Intervals and Scales' }} color={music.color} steps={SCALES}
    links={[
      guide('intervalles', { fr: 'Les intervalles', en: 'Intervals' }, { fr: 'Du demi-ton à l’octave : nommer, compter, renverser.', en: 'From the semitone to the octave: naming, counting, inverting' }),
      guide('gammes', { fr: 'Les gammes', en: 'Scales' }, { fr: 'Les gammes construites par tétracordes, les armures et les quinze tonalités.', en: 'Scales built from tetrachords, key signatures and the fifteen keys' }),
      ...PRACTICE,
    ]}
    onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Chords

const CHORDS: LessonStep[] = [
  {
    title: { fr: 'Un accord', en: 'A chord' },
    body: {
      fr: 'Trois notes ou plus jouées ensemble font un <b>accord</b>. L’accord de trois sons empile deux tierces sur sa note de base, la <b>fondamentale</b> : do, mi, sol.',
      en: 'Three or more notes played together make a <b>chord</b>. The three-note chord, or triad, stacks two thirds on its base note, the <b>root</b>: C, E, G.',
    },
    visual: staff({ items: [...row('c4 e4 g4', 'q', true, 6), { t: 'bar' }, chord('c4 e4 g4', { fr: 'do mi sol', en: 'C E G' }, 'w', 30), { t: 'end' }] }),
  },
  {
    title: { fr: 'Majeur ou mineur', en: 'Major or minor' },
    body: {
      fr: 'Si la tierce du bas est majeure (4 demi-tons), l’accord parfait est <b>majeur</b> : do, mi, sol, un son lumineux. Si elle est mineure (3 demi-tons), il est <b>mineur</b> : la, do, mi, un son plus sombre.',
      en: 'If the lower third is major (4 semitones), the triad is <b>major</b>: C, E, G, a bright sound. If it is minor (3 semitones), the triad is <b>minor</b>: A, C, E, a darker sound.',
    },
    visual: staff({ items: [chord('c4 e4 g4', { fr: 'do majeur', en: 'C major' }, 'w', 34), chord('a4 c5 e5', { fr: 'la mineur', en: 'A minor' }, 'w', 34)] }),
  },
  {
    title: { fr: 'Les accords des degrés', en: 'Chords on each degree' },
    body: {
      fr: 'Sur chaque note de la gamme, on bâtit un accord avec les notes de la gamme. En majeur, les accords de I, IV et V sont majeurs ; ceux de II, III et VI, mineurs ; celui de VII est de quinte diminuée.',
      en: 'On each note of the scale, a triad can be built from the notes of the scale. In major, the triads on I, IV and V are major; on II, III and VI, minor; on VII, diminished.',
    },
    visual: staff({ items: ['c4 e4 g4', 'd4 f4 a4', 'e4 g4 b4', 'f4 a4 c5', 'g4 b4 d5', 'a4 c5 e5', 'b4 d5 f5'].map((c, i) => chord(c, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i], 'w', 6)) }),
  },
  {
    title: { fr: 'Les renversements', en: 'Inversions' },
    body: {
      fr: 'Un accord est <b>renversé</b> quand sa note la plus grave, la <b>basse</b>, n’est plus la fondamentale. La tierce à la basse, c’est le premier renversement, chiffré 6 ; la quinte, le deuxième, chiffré 6/4.',
      en: 'A chord is <b>inverted</b> when its lowest note, the <b>bass</b>, is no longer the root. The third in the bass is the first inversion, figured 6; the fifth, the second inversion, figured 6/4.',
    },
    visual: staff({ items: [chord('c4 e4 g4', '5', 'w', 26), chord('e4 g4 c5', '6', 'w', 26), chord('g4 c5 e5', '6/4', 'w', 26)] }),
  },
  {
    title: { fr: 'La cadence parfaite', en: 'The perfect cadence' },
    body: {
      fr: 'Sur le 5<sup>e</sup> degré, on ajoute une septième aux trois sons : sol, si, ré, fa, l’accord de <b>septième de dominante</b> de do majeur. Il appelle l’accord de do : V7 puis I, c’est la <b>cadence parfaite</b>, la conclusion la plus nette.',
      en: 'On the 5th degree, a seventh is added to the three notes: G, B, D, F, the <b>dominant seventh</b> chord of C major. It calls for the C chord: V7 then I is the <b>perfect cadence</b>, the clearest ending.',
    },
    visual: staff({ items: [chord('g4 b4 d5 f5', 'V7', 'w', 30), chord('c5 e5 g5', 'I', 'w', 30), { t: 'end' }] }),
    note: { fr: 'Les cadences ponctuent la musique comme les points et les virgules ponctuent une phrase.', en: 'Cadences punctuate music the way full stops and commas punctuate a sentence.' },
  },
];

export function ChordsLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les accords', en: 'Chords' }} color={music.color} steps={CHORDS}
    links={[
      guide('accords', { fr: 'Les accords', en: 'Chords' }, { fr: 'De l’accord parfait à la septième diminuée, les renversements et leur chiffrage.', en: 'From the triad to the diminished seventh, inversions and figured bass' }),
      guide('cadences', { fr: 'Les cadences', en: 'Cadences' }, { fr: 'Parfaite, imparfaite, plagale, demi-cadence et cadence rompue, au clavier.', en: 'Perfect, imperfect, plagal, half and deceptive cadences, at the keyboard' }),
      ...PRACTICE,
    ]}
    onStartExercise={onStartExercise} onCancel={onCancel} />;
}
