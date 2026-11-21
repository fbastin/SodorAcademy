import React, { useState } from 'react';
import { Lang } from '../i18n';
import LessonPlayer, { LessonStep } from '../components/LessonPlayer';
import { STATIONS } from '../content/stations';

// The lessons of Knapford (Mathematics) that follow the activities of the pages for
// kids (Mathematics/): the times tables and long division. Each leads to the
// matching exercise of the Practice Room and links to the activity on the site.

const maths = STATIONS.find(s => s.id === 'math')!;
const linkTo = (part: string) => maths.links.filter(l => l.href.includes(part) || l.href.includes('/Practice/'));
const num = (n: number, lang: Lang) => n.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA');

type LessonProps = { onCancel: () => void; onStartExercise?: () => void };

// ---------------------------------------------------------------- Times tables

// Coaches with passengers: rows × columns of dots.
function Coaches({ lang, initRows = 3, initCols = 4, fixed = false }: { lang: Lang; initRows?: number; initCols?: number; fixed?: boolean }) {
  const [rows, setRows] = useState(initRows);
  const [cols, setCols] = useState(initCols);
  const stepper = (label: string, v: number, set: (n: number) => void) => (
    <span className="flex items-center gap-1.5 font-bold">
      {label}
      <button className="chunky p-0! w-9 h-9" onClick={() => set(Math.max(1, v - 1))} aria-label={`${label} −1`}>−</button>
      <span className="w-6 text-center tabular-nums">{v}</span>
      <button className="chunky p-0! w-9 h-9" onClick={() => set(Math.min(9, v + 1))} aria-label={`${label} +1`}>+</button>
    </span>
  );
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-sky p-4">
      {!fixed && (
        <div className="flex flex-wrap gap-4 mb-3">
          {stepper(lang === 'fr' ? 'Voitures' : 'Coaches', rows, setRows)}
          {stepper(lang === 'fr' ? 'Passagers par voiture' : 'Passengers per coach', cols, setCols)}
        </div>
      )}
      <div className="flex flex-col gap-1.5" role="img" aria-label={`${rows} × ${cols} = ${rows * cols}`}>
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-1.5">
            <span className="flex gap-1.5 px-2 py-1.5 rounded-lg bg-[#c62828] border-[2.5px] border-ink">
              {Array.from({ length: cols }, (_, c) => <span key={c} className="w-4 h-4 rounded-full bg-sticker border-2 border-ink" />)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 mb-0 text-xl font-extrabold tabular-nums">
        {rows} × {cols} = {Array.from({ length: rows }, () => cols).join(' + ')} = <span className="px-1.5 rounded bg-note">{rows * cols}</span>
      </p>
    </div>
  );
}

function NineTrick({ lang }: { lang: Lang }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-xl">
      {[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <div key={n} className="rounded-xl border-[2.5px] border-ink bg-white px-2 py-1.5 text-center font-extrabold tabular-nums">
          9 × {n} = <span className="text-[#2464d6]">{n - 1}</span><span className="text-[#e23b2e]">{10 - n}</span>
        </div>
      ))}
      <p className="col-span-full m-0 text-sm text-ink/70">
        {lang === 'fr' ? 'En bleu : un de moins que le nombre. En rouge : ce qui manque pour faire 9.' : 'Blue: one less than the number. Red: what is missing to make 9.'}
      </p>
    </div>
  );
}

const TABLES: LessonStep[] = [
  {
    title: { fr: 'Multiplier, c’est compter des paquets pareils', en: 'Multiplying is counting equal groups' },
    body: {
      fr: 'Annie et Clarabel emmènent des voyageurs. S’il y a 3 voitures avec 4 passagers dans chacune, il y a 4 + 4 + 4 = 12 passagers. On l’écrit plus vite : <b>3 × 4 = 12</b>. Change le nombre de voitures et de passagers !',
      en: 'Annie and Clarabel are carrying passengers. If there are 3 coaches with 4 passengers in each, there are 4 + 4 + 4 = 12 passengers. A quicker way to write it: <b>3 × 4 = 12</b>. Change the number of coaches and passengers!',
    },
    visual: lang => <Coaches lang={lang} />,
    note: { fr: 'Une multiplication, c’est une addition répétée.', en: 'A multiplication is a repeated addition.' },
  },
  {
    title: { fr: 'L’ordre ne change rien', en: 'The order does not matter' },
    body: {
      fr: '3 voitures de 4 passagers, ou 4 voitures de 3 passagers : c’est toujours 12 passagers. <b>3 × 4 = 4 × 3</b>. Bonne nouvelle : si tu connais 3 × 8, tu connais aussi 8 × 3 !',
      en: '3 coaches of 4 passengers, or 4 coaches of 3 passengers: it is still 12 passengers. <b>3 × 4 = 4 × 3</b>. Good news: if you know 3 × 8, you also know 8 × 3!',
    },
    visual: lang => <Coaches lang={lang} initRows={4} initCols={3} fixed />,
    note: { fr: 'Grâce à ça, il n’y a que la moitié des tables à apprendre.', en: 'Thanks to this, there is only half of the tables to learn.' },
  },
  {
    title: { fr: 'Les tables faciles : 2, 5 et 10', en: 'The easy tables: 2, 5 and 10' },
    body: {
      fr: 'Fois 2, c’est le double : 2 × 7 = 7 + 7 = 14. Fois 10, on ajoute un zéro : 10 × 7 = 70. Fois 5, c’est la moitié de fois 10 : 5 × 7 = 35, la moitié de 70.',
      en: 'Times 2 is double: 2 × 7 = 7 + 7 = 14. Times 10, add a zero: 10 × 7 = 70. Times 5 is half of times 10: 5 × 7 = 35, half of 70.',
    },
    note: { fr: 'Les résultats de la table de 5 finissent toujours par 0 ou 5.', en: 'The answers in the 5 times table always end in 0 or 5.' },
  },
  {
    title: { fr: 'Le truc du 9', en: 'The 9 trick' },
    body: {
      fr: 'Pour 9 × 7 : le chiffre des dizaines vaut un de moins que 7, donc 6 ; et les deux chiffres font 9 ensemble, donc 3. <b>9 × 7 = 63</b>. Ça marche pour toute la table de 9 !',
      en: 'For 9 × 7: the tens digit is one less than 7, so 6; and the two digits add up to 9, so 3. <b>9 × 7 = 63</b>. It works for the whole 9 times table!',
    },
    visual: lang => <NineTrick lang={lang} />,
  },
  {
    title: { fr: 'Les plus coriaces', en: 'The tricky ones' },
    body: {
      fr: 'Quelques résultats sont plus durs à retenir : <b>6 × 7 = 42</b>, <b>6 × 8 = 48</b>, <b>7 × 7 = 49</b> et <b>7 × 8 = 56</b>. Pour le dernier, lis « 5, 6, 7, 8 » : 56 = 7 × 8.',
      en: 'A few answers are harder to remember: <b>6 × 7 = 42</b>, <b>6 × 8 = 48</b>, <b>7 × 7 = 49</b> and <b>7 × 8 = 56</b>. For the last one, read “5, 6, 7, 8”: 56 = 7 × 8.',
    },
    note: { fr: 'Un peu chaque jour vaut mieux que beaucoup une fois : la salle d’entraînement est là pour ça.', en: 'A little every day is better than a lot once: that is what the Practice Room is for.' },
  },
];

export function TimesTablesLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'Les tables de multiplication', en: 'The Times Tables' }} color={maths.color} steps={TABLES}
    links={linkTo('times-tables')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}

// ---------------------------------------------------------------- Division

function Share({ lang, total, groups }: { lang: Lang; total: number; groups: number }) {
  const each = Math.floor(total / groups), rest = total % groups;
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-sky p-4">
      <div className="flex flex-wrap gap-3 items-end" role="img"
        aria-label={lang === 'fr' ? `${total} sacs partagés entre ${groups} wagons : ${each} chacun${rest ? `, il en reste ${rest}` : ''}` : `${total} sacks shared among ${groups} trucks: ${each} each${rest ? `, ${rest} left over` : ''}`}>
        {Array.from({ length: groups }, (_, g) => (
          <div key={g} className="flex flex-col items-center">
            <div className="flex flex-wrap gap-1 w-[4.6rem] justify-center mb-1">
              {Array.from({ length: each }, (_, k) => <span key={k} className="w-4 h-4 rounded bg-[#8a5a32] border-2 border-ink" />)}
            </div>
            <span className="w-20 h-7 rounded-md bg-[#6d4c41] border-[2.5px] border-ink" />
          </div>
        ))}
        {rest > 0 && (
          <div className="flex flex-col items-center ml-2">
            <div className="flex gap-1 mb-1">{Array.from({ length: rest }, (_, k) => <span key={k} className="w-4 h-4 rounded bg-[#e23b2e] border-2 border-ink" />)}</div>
            <span className="label-caps">{lang === 'fr' ? 'reste' : 'left over'}</span>
          </div>
        )}
      </div>
      <p className="mt-3 mb-0 text-xl font-extrabold tabular-nums">
        {total} ÷ {groups} = {each}{rest ? (lang === 'fr' ? `, reste ${rest}` : ` remainder ${rest}`) : ''}
      </p>
    </div>
  );
}

// 7 896 ÷ 24, one gesture at a time.
function LongDivision({ lang }: { lang: Lang }) {
  const rows = lang === 'fr' ? [
    ['Diviser', '78 ÷ 24 → 3', 'On écrit 3 au quotient.'],
    ['Multiplier', '3 × 24 = 72', ''],
    ['Soustraire', '78 − 72 = 6', ''],
    ['Abaisser', '69', 'On descend le 9.'],
    ['Diviser', '69 ÷ 24 → 2', '2 × 24 = 48, et 69 − 48 = 21.'],
    ['Abaisser', '216', 'On descend le 6.'],
    ['Diviser', '216 ÷ 24 → 9', '9 × 24 = 216, et 216 − 216 = 0.'],
  ] : [
    ['Divide', '78 ÷ 24 → 3', 'Write 3 in the quotient.'],
    ['Multiply', '3 × 24 = 72', ''],
    ['Subtract', '78 − 72 = 6', ''],
    ['Bring down', '69', 'Bring the 9 down.'],
    ['Divide', '69 ÷ 24 → 2', '2 × 24 = 48, and 69 − 48 = 21.'],
    ['Bring down', '216', 'Bring the 6 down.'],
    ['Divide', '216 ÷ 24 → 9', '9 × 24 = 216, and 216 − 216 = 0.'],
  ];
  const [n, setN] = useState(1);
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-4">
      <ol className="m-0 p-0 list-none space-y-1.5">
        {rows.slice(0, n).map(([g, calc, hint], i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-3">
            <span className="chip bg-note!">{g}</span>
            <span className="font-extrabold text-lg tabular-nums">{calc}</span>
            {hint && <span className="text-ink/65">{hint}</span>}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {n < rows.length
          ? <button className="chunky go" onClick={() => setN(n + 1)}>{lang === 'fr' ? 'Geste suivant' : 'Next step'}</button>
          : <p className="m-0 text-xl font-extrabold">{num(7896, lang)} ÷ 24 = <span className="px-1.5 rounded bg-mint">329</span></p>}
        {n > 1 && <button className="chunky" onClick={() => setN(1)}>{lang === 'fr' ? 'Recommencer' : 'Start again'}</button>}
      </div>
    </div>
  );
}

const DIVISION: LessonStep[] = [
  {
    title: { fr: 'Diviser, c’est partager en parts égales', en: 'Dividing is sharing equally' },
    body: {
      fr: 'Percy doit répartir 12 sacs de courrier dans 3 wagons, autant dans chacun. Chaque wagon en reçoit 4 : <b>12 ÷ 3 = 4</b>. La division est le contraire de la multiplication : 12 ÷ 3 = 4 parce que 3 × 4 = 12.',
      en: 'Percy must share 12 mail sacks among 3 trucks, the same number in each. Each truck gets 4: <b>12 ÷ 3 = 4</b>. Division is the opposite of multiplication: 12 ÷ 3 = 4 because 3 × 4 = 12.',
    },
    visual: lang => <Share lang={lang} total={12} groups={3} />,
    note: { fr: 'Pour diviser, cherche dans la table : 3 fois combien font 12 ?', en: 'To divide, look in the table: 3 times what makes 12?' },
  },
  {
    title: { fr: 'Quand il en reste', en: 'When some are left over' },
    body: {
      fr: 'Avec 14 sacs et 4 wagons, chaque wagon en reçoit 3, et il en reste 2 qui ne peuvent pas être partagés également. On écrit <b>14 ÷ 4 = 3, reste 2</b>. Le reste est toujours plus petit que le diviseur.',
      en: 'With 14 sacks and 4 trucks, each truck gets 3, and 2 are left over that cannot be shared equally. We write <b>14 ÷ 4 = 3 remainder 2</b>. The remainder is always smaller than the divisor.',
    },
    visual: lang => <Share lang={lang} total={14} groups={4} />,
    note: { fr: 'Pour vérifier : 3 × 4 + 2 = 14.', en: 'To check: 3 × 4 + 2 = 14.' },
  },
  {
    title: { fr: 'D’abord, estimer', en: 'First, estimate' },
    body: {
      fr: 'Pour diviser 7&nbsp;896 par 24, arrondis d’abord : 24, c’est presque 25, et 7&nbsp;896, c’est presque 8&nbsp;000. Comme 8&nbsp;000 ÷ 25 = 320, la réponse sera proche de 320. Si tu trouves 30 ou 3&nbsp;000, tu sauras qu’il y a une erreur.',
      en: 'To divide 7,896 by 24, round first: 24 is nearly 25, and 7,896 is nearly 8,000. Since 8,000 ÷ 25 = 320, the answer will be close to 320. If you get 30 or 3,000, you will know something went wrong.',
    },
    note: { fr: 'Une bonne estimation, c’est un filet de sécurité.', en: 'A good estimate is a safety net.' },
  },
  {
    title: { fr: 'Les quatre gestes de la division posée', en: 'The four moves of long division' },
    body: {
      fr: 'Pour chaque chiffre du quotient, les mêmes gestes reviennent : <b>diviser</b>, <b>multiplier</b>, <b>soustraire</b>, <b>abaisser</b>. On commence avec 78, car 7 est plus petit que 24. Avance geste par geste.',
      en: 'For each digit of the quotient, the same moves come back: <b>divide</b>, <b>multiply</b>, <b>subtract</b>, <b>bring down</b>. Start with 78, as 7 is smaller than 24. Go one move at a time.',
    },
    visual: lang => <LongDivision lang={lang} />,
    note: { fr: '329 est bien proche de 320 : l’estimation l’avait prévu. Vérifie : 329 × 24 = 7&nbsp;896.', en: '329 is indeed close to 320, as the estimate said. Check: 329 × 24 = 7,896.' },
  },
];

export function DivisionLesson({ onCancel, onStartExercise }: LessonProps) {
  return <LessonPlayer title={{ fr: 'La division', en: 'Division' }} color={maths.color} steps={DIVISION}
    links={linkTo('long-division')} onStartExercise={onStartExercise} onCancel={onCancel} />;
}
