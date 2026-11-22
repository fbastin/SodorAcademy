import React, { useState } from 'react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from '../components/LessonPlayer';
import { STATIONS } from '../content/stations';
import { Engine } from '../components/ui';

// The lessons of the Steamworks, one per lesson of the JavaScript course of
// slashbin.net (Programming/): what a program is, variables, decisions, loops,
// functions, arrays and objects, and Euclid's algorithm. Each one leads to the
// matching topic of the Practice Room and links to its page of the course, where the
// programs can be changed and run.

type LessonProps = { onCancel: () => void; onStartExercise?: () => void };
const programming = STATIONS.find(s => s.id === 'programming')!;
// The page of the course for a lesson (01-…, 02-…), and the Practice Room.
const linksFor = (...files: string[]) => programming.links.filter(l => files.some(f => l.href.includes(f)) || l.href.startsWith('/Practice/'));
type Two = { fr: string; en: string };
const pick = (t: string | Two, lang: Lang) => (typeof t === 'string' ? t : t[lang]);

// What a program prints: the lessons' programs are run, so the output shown is always
// the real one.
function run(src: string): string {
  const out: string[] = [];
  try {
    // eslint-disable-next-line no-new-func
    new Function('console', src)({ log: (...a: unknown[]) => out.push(a.map(String).join(' ')) });
  } catch (e) {
    out.push(String(e));
  }
  return out.join('\n');
}

// A program and what it prints.
const Code = ({ code, out, lang }: { code: string; out?: string; lang: Lang }) => (
  <div className="grid sm:grid-cols-[3fr_2fr] gap-3">
    <pre className="m-0 p-4 rounded-2xl bg-ink text-[#e8edf5] font-mono text-[15px] leading-6 overflow-x-auto"><code>{code}</code></pre>
    <div className="rounded-2xl border-[2.5px] border-ink bg-white p-3">
      <p className="label-caps m-0 mb-1">{lang === 'fr' ? 'Ce qui s’affiche' : 'What it prints'}</p>
      <pre className="m-0 font-mono text-[15px] leading-6 whitespace-pre-wrap">{out ?? run(code)}</pre>
    </div>
  </div>
);
const code = (src: string | Two) => (lang: Lang) => <Code lang={lang} code={pick(src, lang)} />;

// A program run one line at a time: the line that runs, the boxes of the variables and
// what is printed so far.
type Snap = { line: number; vars: Record<string, string | number>; out?: string };
function Stepper({ lines, snaps, lang }: { lines: string[]; snaps: Snap[]; lang: Lang }) {
  const [k, setK] = useState(0);
  const snap = snaps[k];
  const printed = snaps.slice(0, k + 1).map(s => s.out).filter(Boolean);
  return (
    <div className="flex flex-wrap gap-4 items-start">
      <ol className="m-0 p-4 rounded-2xl bg-ink text-[#e8edf5] font-mono text-[15px] leading-7 list-none min-w-[14rem] flex-1"
        aria-label={lang === 'fr' ? 'Le programme' : 'The program'}>
        {lines.map((t, i) => (
          <li key={i} className={`px-2 rounded whitespace-pre ${i === snap.line ? 'bg-[#0e7c86]' : ''}`}><span className="text-white/40 mr-3">{i + 1}</span>{t}</li>
        ))}
      </ol>
      <div className="flex-1 min-w-[12rem]">
        <p className="label-caps m-0 mb-1">{lang === 'fr' ? 'Les boîtes' : 'The boxes'}</p>
        <div className="flex flex-wrap gap-2 mb-3" aria-live="polite">
          {Object.entries(snap.vars).map(([n, v]) => (
            <div key={n} className="rounded-xl border-[2.5px] border-ink bg-white px-3 py-1.5 text-center min-w-[4.5rem] shadow-[0_3px_0_#17233d]">
              <div className="font-mono text-[13px] text-ink/60">{n}</div>
              <div className="font-mono text-xl font-extrabold">{v}</div>
            </div>
          ))}
        </div>
        <p className="label-caps m-0 mb-1">{lang === 'fr' ? 'Ce qui s’affiche' : 'What it prints'}</p>
        <pre className="m-0 mb-3 min-h-[2rem] rounded-xl border-2 border-ink bg-white px-3 py-1 font-mono text-[15px] whitespace-pre-wrap">{printed.join('\n')}</pre>
        <div className="flex gap-2">
          <button className="chunky go" disabled={k >= snaps.length - 1} onClick={() => setK(k + 1)}>{lang === 'fr' ? 'Ligne suivante' : 'Next line'}</button>
          <button className="chunky" onClick={() => setK(0)}>{lang === 'fr' ? 'Recommencer' : 'Start again'}</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- What a program is

function ThomasProgram({ lang }: { lang: Lang }) {
  const prog = lang === 'fr'
    ? ['avancer()', 'avancer()', 'siffler()', 'avancer()', 'arreter()']
    : ['forward()', 'forward()', 'whistle()', 'forward()', 'stop()'];
  const [pc, setPc] = useState(0);
  const pos = prog.slice(0, pc).filter(p => p.startsWith(lang === 'fr' ? 'avancer' : 'forward')).length;
  const whistled = pc >= 3;
  return (
    <div className="flex flex-wrap gap-5 items-start">
      <ol className="m-0 p-4 rounded-2xl bg-ink text-[#e8edf5] font-mono text-[15px] leading-7 list-none min-w-[12rem]" aria-label={lang === 'fr' ? 'Le programme de Thomas' : 'Thomas’s program'}>
        {prog.map((p, i) => (
          <li key={i} className={`px-2 rounded ${i === pc - 1 ? 'bg-[#2464d6]' : ''}`}><span className="text-white/40 mr-3">{i + 1}</span>{p}</li>
        ))}
      </ol>
      <div className="flex-1 min-w-[15rem]">
        <div className="relative h-16 rounded-xl border-[2.5px] border-ink bg-sky overflow-hidden">
          <div className="absolute left-0 right-0 bottom-2 h-1 bg-ink" />
          <div className="absolute right-2 bottom-3 w-12 h-10 rounded bg-white border-2 border-ink text-xs font-extrabold flex items-center justify-center">{lang === 'fr' ? 'GARE' : 'STATION'}</div>
          <div className="absolute bottom-2 transition-all duration-500" style={{ left: `${4 + pos * 22}%` }}><Engine size={56} number="1" /></div>
          {whistled && pc === 3 && <span className="absolute top-1 font-extrabold text-[#e23b2e]" style={{ left: `${8 + pos * 22}%` }}>{lang === 'fr' ? 'Tchou !' : 'Toot!'}</span>}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="chunky go" disabled={pc >= prog.length} onClick={() => setPc(pc + 1)}>{lang === 'fr' ? 'Instruction suivante' : 'Next instruction'}</button>
          <button className="chunky" onClick={() => setPc(0)}>{lang === 'fr' ? 'Recommencer' : 'Start again'}</button>
        </div>
      </div>
    </div>
  );
}

const PROGRAM: LessonStep[] = [
  {
    title: { fr: 'Un programme, c’est une liste d’instructions', en: 'A program is a list of instructions' },
    body: {
      fr: 'Le Gros Contrôleur donne à Thomas une liste d’ordres, et Thomas les suit <b>un par un, dans l’ordre</b>, sans en sauter. Un ordinateur fait pareil avec un <b>programme</b>. Exécute le programme de Thomas !',
      en: 'The Fat Controller gives Thomas a list of orders, and Thomas follows them <b>one at a time, in order</b>, without skipping any. A computer does the same with a <b>program</b>. Run Thomas’s program!',
    },
    visual: lang => <ThomasProgram lang={lang} />,
    note: { fr: 'L’ordinateur fait exactement ce qui est écrit, ni plus ni moins.', en: 'The computer does exactly what is written, no more and no less.' },
  },
  {
    title: { fr: 'Afficher et calculer', en: 'Printing and calculating' },
    body: {
      fr: 'En JavaScript, <b>console.log</b> affiche un texte ou un nombre. Le texte va entre guillemets ; un calcul, non : l’ordinateur le fait lui-même. L’étoile * veut dire « fois ».',
      en: 'In JavaScript, <b>console.log</b> prints a text or a number. Text goes between quotes; a calculation does not: the computer works it out. The star * means “times”.',
    },
    visual: lang => <Code lang={lang} code={lang === 'fr' ? 'console.log("Bonjour Sodor !");\nconsole.log(6 * 7);' : 'console.log("Hello Sodor!");\nconsole.log(6 * 7);'} out={lang === 'fr' ? 'Bonjour Sodor !\n42' : 'Hello Sodor!\n42'} />,
  },
  {
    title: { fr: 'Les variables : des wagons qui portent un nom', en: 'Variables: trucks with a name' },
    body: {
      fr: 'Une <b>variable</b> est une boîte qui porte un nom et garde une valeur. On peut la changer : ici, 3 passagers montent, et la variable passe de 12 à 15.',
      en: 'A <b>variable</b> is a box with a name that keeps a value. You can change it: here 3 passengers get on, and the variable goes from 12 to 15.',
    },
    visual: lang => <Code lang={lang} code={lang === 'fr' ? 'let passagers = 12;\npassagers = passagers + 3;\nconsole.log(passagers);' : 'let passengers = 12;\npassengers = passengers + 3;\nconsole.log(passengers);'} out="15" />,
  },
  {
    title: { fr: 'Répéter avec une boucle', en: 'Repeating with a loop' },
    body: {
      fr: 'Pour siffler trois fois, inutile d’écrire trois lignes : une <b>boucle for</b> répète les instructions entre accolades. Ici, i vaut 1, puis 2, puis 3, et la boucle s’arrête.',
      en: 'To whistle three times, no need to write three lines: a <b>for loop</b> repeats the instructions between the braces. Here i is 1, then 2, then 3, and the loop stops.',
    },
    visual: lang => <Code lang={lang} code={'for (let i = 1; i <= 3; i++) {\n  console.log(' + (lang === 'fr' ? '"Tchou tchou ! " + i' : '"Toot toot! " + i') + ');\n}'}
      out={lang === 'fr' ? 'Tchou tchou ! 1\nTchou tchou ! 2\nTchou tchou ! 3' : 'Toot toot! 1\nToot toot! 2\nToot toot! 3'} />,
    note: { fr: 'Le cours de programmation de slashbin.net te fait écrire et exécuter ces programmes toi-même.', en: 'The programming course on slashbin.net lets you write and run these programs yourself.' },
  },
];

export function FirstProgramLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Qu’est-ce qu’un programme ?', en: 'What Is a Program?' }} color={programming.color} steps={PROGRAM}
    links={programming.links.filter(l => /0[12]-|Practice/.test(l.href))} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Variables

const SWAP_LINES = ['let a = 3;', 'let b = 8;', 'let temp = a;', 'a = b;', 'b = temp;', 'console.log(a, b);'];
const SWAP_SNAPS: Snap[] = [
  { line: 0, vars: { a: 3 } }, { line: 1, vars: { a: 3, b: 8 } }, { line: 2, vars: { a: 3, b: 8, temp: 3 } },
  { line: 3, vars: { a: 8, b: 8, temp: 3 } }, { line: 4, vars: { a: 8, b: 3, temp: 3 } }, { line: 5, vars: { a: 8, b: 3, temp: 3 }, out: '8 3' },
];

const VARIABLES: LessonStep[] = [
  {
    title: { fr: 'Une boîte avec un nom', en: 'A box with a name' },
    body: {
      fr: 'Une <b>variable</b> est une boîte qui porte un nom et garde une valeur. <b>let</b> crée la boîte et y range sa première valeur ; ensuite, le nom suffit pour s’en servir, autant de fois qu’on veut.',
      en: 'A <b>variable</b> is a box with a name that keeps a value. <b>let</b> creates the box and puts its first value in it; after that, the name is enough to use it, as often as you like.',
    },
    visual: code({ fr: 'let wagons = 5;\nconsole.log(wagons);\nconsole.log(wagons * 2);', en: 'let trucks = 5;\nconsole.log(trucks);\nconsole.log(trucks * 2);' }),
  },
  {
    title: { fr: 'Changer le contenu', en: 'Changing what is inside' },
    body: {
      fr: 'Le signe <b>=</b> range une nouvelle valeur dans la boîte : l’ancienne est remplacée. <code>score = score + 10</code> se lit « prends score, ajoute 10, et range le résultat dans score ». <code>score += 5</code> est un raccourci pour la même chose.',
      en: 'The <b>=</b> sign puts a new value in the box: the old one is replaced. <code>score = score + 10</code> reads “take score, add 10, and put the result in score”. <code>score += 5</code> is a shortcut for the same thing.',
    },
    visual: code('let score = 0;\nscore = score + 10;\nscore += 5;\nconsole.log(score);'),
  },
  {
    title: { fr: 'Les constantes, et coller du texte', en: 'Constants, and joining text' },
    body: {
      fr: '<b>const</b> crée une boîte qu’on ne peut plus changer : une <b>constante</b>. Le signe <b>+</b> entre du texte et un nombre les colle bout à bout.',
      en: '<b>const</b> creates a box that can no longer change: a <b>constant</b>. The <b>+</b> sign between text and a number glues them end to end.',
    },
    visual: code({ fr: 'const nom = "Percy";\nlet age = 9;\nconsole.log(nom + " a " + age + " ans.");', en: 'const name = "Percy";\nlet age = 9;\nconsole.log(name + " is " + age + ".");' }),
  },
  {
    title: { fr: 'Échanger deux variables', en: 'Swapping two variables' },
    body: {
      fr: 'Pour échanger deux wagons, on en gare un sur une voie de garage. Pour échanger deux variables, il faut de même une troisième boîte, <b>temp</b>. Avance ligne par ligne et regarde les boîtes.',
      en: 'To swap two trucks, one waits on a siding. To swap two variables, you likewise need a third box, <b>temp</b>. Go line by line and watch the boxes.',
    },
    visual: lang => <Stepper lang={lang} lines={SWAP_LINES} snaps={SWAP_SNAPS} />,
    note: { fr: 'Sans temp, <code>a = b</code> efface l’ancienne valeur de a : elle est perdue.', en: 'Without temp, <code>a = b</code> wipes out the old value of a: it is lost.' },
  },
];

export function VariablesLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les variables', en: 'Variables' }} color={programming.color} steps={VARIABLES}
    links={linksFor('02-')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Decisions

// Change the number of passengers and see which branch of the if runs.
function IfPlayground({ lang }: { lang: Lang }) {
  const [n, setN] = useState(25);
  const fr = lang === 'fr';
  const lines = fr
    ? [`let passagers = ${n};`, 'if (passagers > 40) {', '  console.log("Ajoute un wagon!");', '} else {', '  console.log("Tout le monde est assis.");', '}']
    : [`let passengers = ${n};`, 'if (passengers > 40) {', '  console.log("Add a coach!");', '} else {', '  console.log("Everyone has a seat.");', '}'];
  const ran = n > 40 ? 2 : 4;
  return (
    <div className="flex flex-wrap gap-4 items-start">
      <ol className="m-0 p-4 rounded-2xl bg-ink text-[#e8edf5] font-mono text-[15px] leading-7 list-none min-w-[15rem] flex-1">
        {lines.map((t, i) => (
          <li key={i} className={`px-2 rounded whitespace-pre ${i === ran ? 'bg-[#0e7c86]' : i === 2 || i === 4 ? 'opacity-50' : ''}`}>{t}</li>
        ))}
      </ol>
      <div className="flex-1 min-w-[12rem]">
        <label className="block font-extrabold mb-1" htmlFor="if-n">{fr ? `Passagers : ${n}` : `Passengers: ${n}`}</label>
        <input id="if-n" type="range" min={0} max={60} value={n} onChange={e => setN(+e.target.value)} className="w-full accent-[#0e7c86]" />
        <p className="m-0 mt-2">{fr ? `${n} > 40 est ` : `${n} > 40 is `}<b>{n > 40 ? 'true' : 'false'}</b>{fr ? (n > 40 ? ' (vrai)' : ' (faux)') : ''}</p>
        <pre className="m-0 mt-2 rounded-xl border-2 border-ink bg-white px-3 py-1 font-mono text-[15px] whitespace-pre-wrap">{run(lines.join('\n'))}</pre>
      </div>
    </div>
  );
}

const CONDITIONS: LessonStep[] = [
  {
    title: { fr: 'Vrai ou faux', en: 'True or false' },
    body: {
      fr: 'Une <b>comparaison</b> vaut <code>true</code> (vrai) ou <code>false</code> (faux). On compare avec <code>&gt;</code> plus grand, <code>&lt;</code> plus petit, <code>&gt;=</code> et <code>&lt;=</code>, <code>===</code> égal et <code>!==</code> différent.',
      en: 'A <b>comparison</b> is <code>true</code> or <code>false</code>. You compare with <code>&gt;</code> greater, <code>&lt;</code> less, <code>&gt;=</code> and <code>&lt;=</code>, <code>===</code> equal and <code>!==</code> different.',
    },
    visual: code('console.log(7 > 3);\nconsole.log(5 === 8);\nconsole.log(10 % 2 === 0);'),
    note: { fr: 'Un seul = range une valeur ; trois === comparent.', en: 'One = puts a value in a box; three === compare.' },
  },
  {
    title: { fr: 'Si…, sinon…', en: 'If…, otherwise…' },
    body: {
      fr: '<b>if</b> exécute les lignes entre ses accolades seulement si la condition est vraie ; sinon, ce sont celles de <b>else</b>. Change le nombre de passagers pour voir quelle branche s’exécute.',
      en: '<b>if</b> runs the lines between its braces only when the condition is true; otherwise, those of <b>else</b> run. Change the number of passengers to see which branch runs.',
    },
    visual: lang => <IfPlayground lang={lang} />,
  },
  {
    title: { fr: 'Plusieurs cas', en: 'Several cases' },
    body: {
      fr: 'Avec <b>else if</b>, on teste plusieurs conditions. L’ordinateur les essaie dans l’ordre et s’arrête à la <b>première vraie</b> ; si aucune ne l’est, il exécute le else.',
      en: 'With <b>else if</b>, you test several conditions. The computer tries them in order and stops at the <b>first true one</b>; if none is true, it runs the else.',
    },
    visual: code({
      fr: 'let vitesse = 50;\nif (vitesse < 30) {\n  console.log("Tout doux.");\n} else if (vitesse < 60) {\n  console.log("Bonne allure.");\n} else {\n  console.log("Trop vite!");\n}',
      en: 'let speed = 50;\nif (speed < 30) {\n  console.log("Nice and slow.");\n} else if (speed < 60) {\n  console.log("Good speed.");\n} else {\n  console.log("Too fast!");\n}',
    }),
  },
  {
    title: { fr: 'Et, ou', en: 'And, or' },
    body: {
      fr: '<code>&amp;&amp;</code> veut dire <b>et</b> : les deux conditions doivent être vraies. <code>||</code> veut dire <b>ou</b> : une seule suffit.',
      en: '<code>&amp;&amp;</code> means <b>and</b>: both conditions must be true. <code>||</code> means <b>or</b>: one is enough.',
    },
    visual: code({
      fr: 'let age = 70;\nif (age < 6 || age >= 65) {\n  console.log("Voyage gratuit!");\n} else {\n  console.log("Billet : 5 $.");\n}',
      en: 'let age = 70;\nif (age < 6 || age >= 65) {\n  console.log("Free trip!");\n} else {\n  console.log("Ticket: $5.");\n}',
    }),
  },
];

export function ConditionsLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les conditions', en: 'Making Decisions' }} color={programming.color} steps={CONDITIONS}
    links={linksFor('03-')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Loops

const SUM_LINES = ['let total = 0;', 'for (let i = 1; i <= 4; i++) {', '  total += i;', '}', 'console.log(total);'];
const SUM_SNAPS: Snap[] = (() => {
  const s: Snap[] = [{ line: 0, vars: { total: 0 } }];
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    s.push({ line: 1, vars: { total, i } });
    if (i > 4) break;
    total += i;
    s.push({ line: 2, vars: { total, i } });
  }
  s.push({ line: 4, vars: { total, i: 5 }, out: String(total) });
  return s;
})();

const LOOPS: LessonStep[] = [
  {
    title: { fr: 'Tant que…', en: 'As long as…' },
    body: {
      fr: '<b>while</b> répète les lignes entre ses accolades <b>tant que</b> la condition est vraie. Ici, il reste du charbon, alors la locomotive avance ; à chaque tour, il y en a un sac de moins.',
      en: '<b>while</b> repeats the lines between its braces <b>as long as</b> the condition is true. Here, while there is coal left, the engine goes on; at each turn there is one bag less.',
    },
    visual: code({
      fr: 'let charbon = 3;\nwhile (charbon > 0) {\n  console.log("Tchou! Sacs de charbon : " + charbon);\n  charbon--;\n}\nconsole.log("Plus de charbon.");',
      en: 'let coal = 3;\nwhile (coal > 0) {\n  console.log("Toot! Bags of coal: " + coal);\n  coal--;\n}\nconsole.log("Out of coal.");',
    }),
    note: { fr: 'Si la condition ne devient jamais fausse, la boucle ne s’arrête jamais !', en: 'If the condition never becomes false, the loop never stops!' },
  },
  {
    title: { fr: 'La boucle for', en: 'The for loop' },
    body: {
      fr: 'La boucle <b>for</b> réunit trois choses sur une ligne : le départ (<code>let i = 1</code>), la condition pour continuer (<code>i &lt;= 5</code>) et le pas (<code>i++</code>, ajouter 1).',
      en: 'The <b>for</b> loop puts three things on one line: the start (<code>let i = 1</code>), the condition to go on (<code>i &lt;= 5</code>) and the step (<code>i++</code>, add 1).',
    },
    visual: code({ fr: 'for (let i = 1; i <= 5; i++) {\n  console.log("Wagon " + i);\n}', en: 'for (let i = 1; i <= 5; i++) {\n  console.log("Truck " + i);\n}' }),
  },
  {
    title: { fr: 'Accumuler', en: 'Adding up' },
    body: {
      fr: 'Pour additionner beaucoup de nombres, on garde le total dans une boîte et la boucle y ajoute un nombre à chaque tour. Avance ligne par ligne.',
      en: 'To add up many numbers, keep the total in a box and let the loop add one number to it at each turn. Go line by line.',
    },
    visual: lang => <Stepper lang={lang} lines={SUM_LINES} snaps={SUM_SNAPS} />,
  },
  {
    title: { fr: 'Une condition dans une boucle', en: 'A condition inside a loop' },
    body: {
      fr: 'Une boucle peut contenir un if. Celle-ci essaie chaque nombre de 1 à 12 et n’affiche que ceux qui divisent 12 : ses <b>diviseurs</b>.',
      en: 'A loop can hold an if. This one tries each number from 1 to 12 and prints only those that divide 12: its <b>divisors</b>.',
    },
    visual: code('for (let d = 1; d <= 12; d++) {\n  if (12 % d === 0) {\n    console.log(d);\n  }\n}'),
  },
];

export function LoopsLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les boucles', en: 'Loops' }} color={programming.color} steps={LOOPS}
    links={linksFor('04-')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Functions

const FUNCTIONS: LessonStep[] = [
  {
    title: { fr: 'Donner un nom à un morceau de programme', en: 'Giving a piece of program a name' },
    body: {
      fr: '<b>function</b> donne un nom à quelques lignes. Elles ne s’exécutent pas tout de suite : seulement quand on <b>appelle</b> la fonction, avec son nom et des parenthèses, autant de fois qu’on veut.',
      en: '<b>function</b> gives a name to a few lines. They do not run straight away: only when you <b>call</b> the function, with its name and brackets, as often as you like.',
    },
    visual: code({ fr: 'function siffler() {\n  console.log("Tchou tchou!");\n}\nsiffler();\nsiffler();', en: 'function whistle() {\n  console.log("Toot toot!");\n}\nwhistle();\nwhistle();' }),
  },
  {
    title: { fr: 'Les paramètres', en: 'Parameters' },
    body: {
      fr: 'Entre les parenthèses, une fonction peut recevoir des valeurs : ses <b>paramètres</b>. À chaque appel, le paramètre <code>nom</code> prend la valeur donnée.',
      en: 'Between the brackets, a function can receive values: its <b>parameters</b>. At each call, the parameter <code>name</code> takes the value given.',
    },
    visual: code({ fr: 'function saluer(nom) {\n  console.log("Bonjour, " + nom + "!");\n}\nsaluer("Thomas");\nsaluer("Percy");', en: 'function greet(name) {\n  console.log("Hello, " + name + "!");\n}\ngreet("Thomas");\ngreet("Percy");' }),
  },
  {
    title: { fr: 'Renvoyer une réponse', en: 'Giving back an answer' },
    body: {
      fr: '<b>return</b> renvoie une réponse et arrête la fonction. L’appel est alors remplacé par cette réponse : <code>carre(3) + carre(4)</code> devient 9 + 16.',
      en: '<b>return</b> gives back an answer and stops the function. The call is then replaced by that answer: <code>square(3) + square(4)</code> becomes 9 + 16.',
    },
    visual: code({ fr: 'function carre(n) {\n  return n * n;\n}\nconsole.log(carre(7));\nconsole.log(carre(3) + carre(4));', en: 'function square(n) {\n  return n * n;\n}\nconsole.log(square(7));\nconsole.log(square(3) + square(4));' }),
  },
  {
    title: { fr: 'Les fonctions de Math', en: 'The Math functions' },
    body: {
      fr: 'JavaScript a déjà des fonctions toutes faites : <b>Math.max</b> renvoie le plus grand nombre, <b>Math.min</b> le plus petit, <b>Math.floor</b> arrondit vers le bas (17 / 5 = 3,4 devient 3, le quotient), et <b>Math.abs</b> enlève le signe moins.',
      en: 'JavaScript already has ready-made functions: <b>Math.max</b> returns the largest number, <b>Math.min</b> the smallest, <b>Math.floor</b> rounds down (17 / 5 = 3.4 becomes 3, the quotient), and <b>Math.abs</b> removes the minus sign.',
    },
    visual: code('console.log(Math.max(4, 9, 2));\nconsole.log(Math.min(4, 9, 2));\nconsole.log(Math.floor(17 / 5));\nconsole.log(Math.abs(3 - 10));'),
  },
];

export function FunctionsLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les fonctions', en: 'Functions' }} color={programming.color} steps={FUNCTIONS}
    links={linksFor('05-')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Arrays and objects

const ARRAYS: LessonStep[] = [
  {
    title: { fr: 'Une liste de valeurs', en: 'A list of values' },
    body: {
      fr: 'Un <b>tableau</b> range plusieurs valeurs, dans l’ordre, entre crochets. On les compte à partir de <b>0</b> : <code>wagons[0]</code> est la première. <code>length</code> donne le nombre de valeurs, et <code>push</code> en ajoute une à la fin.',
      en: 'An <b>array</b> keeps several values, in order, between square brackets. They are counted from <b>0</b>: <code>trucks[0]</code> is the first. <code>length</code> gives the number of values, and <code>push</code> adds one at the end.',
    },
    visual: code({
      fr: 'let wagons = ["charbon", "lait", "courrier"];\nconsole.log(wagons[0]);\nconsole.log(wagons.length);\nwagons.push("bois");\nconsole.log(wagons.length);',
      en: 'let trucks = ["coal", "milk", "mail"];\nconsole.log(trucks[0]);\nconsole.log(trucks.length);\ntrucks.push("wood");\nconsole.log(trucks.length);',
    }),
  },
  {
    title: { fr: 'Parcourir un tableau', en: 'Going through an array' },
    body: {
      fr: '<code>for (const p of passagers)</code> passe sur chaque valeur du tableau, une à une : p vaut 12, puis 7, puis 20, puis 5. Ici, la boucle les additionne.',
      en: '<code>for (const p of passengers)</code> goes over each value of the array, one by one: p is 12, then 7, then 20, then 5. Here the loop adds them up.',
    },
    visual: code({
      fr: 'let passagers = [12, 7, 20, 5];\nlet total = 0;\nfor (const p of passagers) {\n  total += p;\n}\nconsole.log(total);',
      en: 'let passengers = [12, 7, 20, 5];\nlet total = 0;\nfor (const p of passengers) {\n  total += p;\n}\nconsole.log(total);',
    }),
  },
  {
    title: { fr: 'Le plus grand', en: 'The largest' },
    body: {
      fr: 'Pour trouver la plus grande valeur, on garde la première dans une boîte, puis la boucle la remplace par chaque valeur plus grande qu’elle rencontre.',
      en: 'To find the largest value, keep the first one in a box, then let the loop replace it with each larger value it meets.',
    },
    visual: code({
      fr: 'let vitesses = [40, 65, 30, 55];\nlet max = vitesses[0];\nfor (const v of vitesses) {\n  if (v > max) {\n    max = v;\n  }\n}\nconsole.log(max);',
      en: 'let speeds = [40, 65, 30, 55];\nlet max = speeds[0];\nfor (const v of speeds) {\n  if (v > max) {\n    max = v;\n  }\n}\nconsole.log(max);',
    }),
  },
  {
    title: { fr: 'Les objets', en: 'Objects' },
    body: {
      fr: 'Un <b>objet</b> range des valeurs sous des noms, entre accolades. On lit une valeur avec un point : <code>train.nom</code>. On la change de la même façon.',
      en: 'An <b>object</b> keeps values under names, between braces. You read a value with a dot: <code>train.name</code>. You change it the same way.',
    },
    visual: code({
      fr: 'let train = { nom: "Thomas", numero: 1, wagons: 3 };\nconsole.log(train.nom + " porte le numéro " + train.numero);\ntrain.wagons += 2;\nconsole.log(train.wagons);',
      en: 'let train = { name: "Thomas", number: 1, trucks: 3 };\nconsole.log(train.name + " is number " + train.number);\ntrain.trucks += 2;\nconsole.log(train.trucks);',
    }),
  },
];

export function ArraysLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les tableaux et les objets', en: 'Arrays and Objects' }} color={programming.color} steps={ARRAYS}
    links={linksFor('06-')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Euclid's algorithm

const EUCLID_ROWS = [[252, 105, 42], [105, 42, 21], [42, 21, 0]];
function EuclidTable({ lang }: { lang: Lang }) {
  return (
    <div className="flex justify-center">
      <table className="border-collapse font-mono text-lg" aria-label={lang === 'fr' ? 'Les étapes d’Euclide pour 252 et 105' : 'Euclid’s steps for 252 and 105'}>
        <thead><tr>{['a', 'b', 'a % b'].map(h => <th key={h} className="px-5 py-1.5 border-b-[3px] border-ink">{h}</th>)}</tr></thead>
        <tbody>
          {EUCLID_ROWS.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="px-5 py-1.5 text-center border-b border-ink/20">{v}</td>)}</tr>)}
          <tr><td className="px-5 py-1.5 text-center font-extrabold bg-[#fff3c4] rounded">21</td><td className="px-5 py-1.5 text-center">0</td><td /></tr>
        </tbody>
      </table>
    </div>
  );
}

const GCD_FR = 'function pgcd(a, b) {\n  while (b !== 0) {\n    let r = a % b;\n    a = b;\n    b = r;\n  }\n  return a;\n}';
const GCD_EN = GCD_FR.replace('pgcd', 'gcd');

const EUCLID: LessonStep[] = [
  {
    title: { fr: 'Le but', en: 'The goal' },
    body: {
      fr: 'Le <b>PGCD</b> de deux nombres est le plus grand nombre qui les divise tous les deux : pour 12 et 18, c’est 6. Une première idée : essayer tous les nombres en descendant, à partir du plus petit des deux. Ça marche, mais c’est lent.',
      en: 'The <b>GCD</b> of two numbers is the largest number that divides both: for 12 and 18, it is 6. A first idea: try every number going down, from the smaller of the two. It works, but it is slow.',
    },
    visual: code({
      fr: 'let a = 12;\nlet b = 18;\nlet d = Math.min(a, b);\nwhile (a % d !== 0 || b % d !== 0) {\n  d--;\n}\nconsole.log(d);',
      en: 'let a = 12;\nlet b = 18;\nlet d = Math.min(a, b);\nwhile (a % d !== 0 || b % d !== 0) {\n  d--;\n}\nconsole.log(d);',
    }),
  },
  {
    title: { fr: 'L’idée d’Euclide', en: 'Euclid’s idea' },
    body: {
      fr: 'Il y a environ 2300 ans, Euclide a remarqué que le PGCD de a et b est aussi celui de b et du reste <code>a % b</code>. On recommence avec des nombres de plus en plus petits ; quand le reste vaut 0, le PGCD est le dernier a.',
      en: 'About 2,300 years ago, Euclid noticed that the GCD of a and b is also the GCD of b and the remainder <code>a % b</code>. You start again with smaller and smaller numbers; when the remainder is 0, the GCD is the last a.',
    },
    visual: lang => <EuclidTable lang={lang} />,
  },
  {
    title: { fr: 'Le code', en: 'The code' },
    body: {
      fr: 'Chaque ligne du tableau devient un tour de boucle : <code>let r = a % b; a = b; b = r;</code>, l’échange des variables avec une boîte de plus. La boucle tourne <b>tant que</b> b n’est pas 0.',
      en: 'Each row of the table becomes one turn of the loop: <code>let r = a % b; a = b; b = r;</code>, the swap of variables with one more box. The loop turns <b>as long as</b> b is not 0.',
    },
    visual: code({ fr: `${GCD_FR}\nconsole.log(pgcd(252, 105));`, en: `${GCD_EN}\nconsole.log(gcd(252, 105));` }),
  },
  {
    title: { fr: 'La course', en: 'The race' },
    body: {
      fr: 'Pour deux grands nombres, la recherche lente essaie des centaines de nombres ; Euclide trouve en quelques tours. Ce programme compte les tours des deux méthodes.',
      en: 'For two big numbers, the slow search tries hundreds of numbers; Euclid finds the answer in a few turns. This program counts the turns of both methods.',
    },
    visual: code({
      fr: 'let a = 1071, b = 462;\nlet lent = 0;\nlet d = Math.min(a, b);\nwhile (a % d !== 0 || b % d !== 0) {\n  d--;\n  lent++;\n}\nlet euclide = 0;\nwhile (b !== 0) {\n  let r = a % b;\n  a = b;\n  b = r;\n  euclide++;\n}\nconsole.log("PGCD : " + a);\nconsole.log("Recherche lente : " + lent + " tours");\nconsole.log("Euclide : " + euclide + " tours");',
      en: 'let a = 1071, b = 462;\nlet slow = 0;\nlet d = Math.min(a, b);\nwhile (a % d !== 0 || b % d !== 0) {\n  d--;\n  slow++;\n}\nlet euclid = 0;\nwhile (b !== 0) {\n  let r = a % b;\n  a = b;\n  b = r;\n  euclid++;\n}\nconsole.log("GCD: " + a);\nconsole.log("Slow search: " + slow + " turns");\nconsole.log("Euclid: " + euclid + " turns");',
    }),
  },
  {
    title: { fr: 'Simplifier une fraction', en: 'Simplifying a fraction' },
    body: {
      fr: 'Le PGCD sert à simplifier les fractions : on divise le haut et le bas par leur PGCD. 12/18, divisé en haut et en bas par 6, devient 2/3.',
      en: 'The GCD is used to simplify fractions: divide the top and the bottom by their GCD. 12/18, divided top and bottom by 6, becomes 2/3.',
    },
    visual: code({ fr: `${GCD_FR}\nlet g = pgcd(12, 18);\nconsole.log(12 / g + "/" + 18 / g);`, en: `${GCD_EN}\nlet g = gcd(12, 18);\nconsole.log(12 / g + "/" + 18 / g);` }),
  },
];

export function EuclidLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'L’algorithme d’Euclide', en: 'Euclid’s Algorithm' }} color={programming.color} steps={EUCLID}
    links={linksFor('07-')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}
