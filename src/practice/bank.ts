import { Lang, frTypo } from '../i18n';

// The exercises of Sodor Academy that follow the programme of the pages for kids
// come from the Practice Room of slashbin.net (/Practice/): the same skills, the
// same question generators and the same explanations, played here on the rails of
// Sodor. The Practice Room's files are loaded as they are, so a skill improved
// there is improved here too.
//
// Each skill file declares subject(), topic() and skill() (see Practice/engine.js):
//   a topic   { id, subject, letter, title, lesson }
//   a skill   { id, topic, title, gen(level) → question }, level 0, 1 or 2
//   a question { key, prompt, visual?, type: 'num' | 'choice' | 'pair', answer,
//                choices?, keep?, labels?, frac?, tol?, unit?, show?, check?, explain }
// A text there is a string, { fr, en } or a function (lang) → string; prompts and
// explanations are HTML written by the site.

export type PText = string | { fr: string; en: string } | ((l: Lang) => string);

export interface PQuestion {
  key: string;
  prompt: PText;
  visual?: PText;
  type: 'num' | 'choice' | 'pair';
  answer: any;
  choices?: PText[];
  keep?: boolean;
  labels?: PText[];
  frac?: boolean;
  tol?: number;
  unit?: PText;
  show?: PText;
  check?: (v: number[]) => boolean;
  explain: PText;
}

export interface PSkill { id: string; topic: string; title: { fr: string; en: string }; lesson?: string; gen: (level: number) => PQuestion }
export interface PTopic { id: string; subject: string; letter: string; title: { fr: string; en: string }; lesson?: string }
export interface PracticeBank { topics: PTopic[]; skills: PSkill[] }

const FILES = [
  '/vendor/highlight.js/11.9.0/highlight.min.js',
  '/Practice/engine.js',
  '/Practice/bank-physics.js',
  '/Practice/skills-maths.js',
  '/Practice/skills-sciences.js',
  '/Practice/skills-code.js',
  '/Practice/music-glyphs.js',
  '/Practice/skills-musique.js',
];

let loading: Promise<PracticeBank> | null = null;
const loaded = new Set<string>();   // a file declares constants: never load it twice

function addScript(src: string): Promise<void> {
  if (loaded.has(src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = () => { loaded.add(src); resolve(); };
    s.onerror = () => reject(new Error('Could not load ' + src));
    document.head.appendChild(s);
  });
}

export function loadPractice(): Promise<PracticeBank> {
  if (!loading) {
    loading = (async () => {
      // highlight.js only colours the code questions: go on without it.
      await addScript(FILES[0]).catch(() => undefined);
      for (const f of FILES.slice(1)) await addScript(f);
      // The files declare SUBJECTS, TOPICS and SKILLS with const: a classic script
      // reads them and hands them over.
      const bridge = document.createElement('script');
      bridge.text = 'window.__sodorPractice = { topics: TOPICS, skills: SKILLS };';
      document.head.appendChild(bridge);
      const bank = (window as any).__sodorPractice as PracticeBank | undefined;
      if (!bank || !bank.skills?.length) throw new Error('The Practice Room bank is empty');
      return bank;
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

// A text of the bank in the chosen language.
export function res(v: PText | undefined, lang: Lang): string {
  if (v === undefined || v === null) return '';
  let s: string;
  if (typeof v === 'function') s = v(lang);
  else if (typeof v === 'object') s = (v as any)[lang] ?? (v as any).en;
  else s = String(v);
  return lang === 'fr' ? frTypo(String(s)) : String(s);
}

// A number as typed: 3,5 or 3.5; 1 000, 1,000 (in English) or 1000.
export function parseNum(raw: string, lang: Lang): number {
  let s = String(raw).trim().replace(/[\s  ]/g, '').replace(/^\+/, '').replace(/−/g, '-');
  if (s === '') return NaN;
  if (/^-?\d{1,3}(,\d{3})+$/.test(s) && lang === 'en') s = s.replace(/,/g, '');
  else s = s.replace(',', '.');
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}

export const fmtNum = (n: number, lang: Lang) =>
  Number(n).toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 3 });

// The right answer, written out.
export function answerText(q: PQuestion, v: any, lang: Lang): string {
  if (q.type === 'choice') return res(q.choices![v], lang);
  if (q.type === 'pair') {
    return q.frac
      ? `${fmtNum(v[0], lang)}/${fmtNum(v[1], lang)}`
      : `${res(q.labels![0], lang)} ${fmtNum(v[0], lang)}, ${res(q.labels![1], lang)} ${fmtNum(v[1], lang)}`;
  }
  return fmtNum(v, lang) + (q.unit ? ' ' + res(q.unit, lang) : '');
}

// The lesson of a topic, as an address of the site (the bank writes them from /Practice/).
// A skill can have a lesson of its own; otherwise it is its topic's.
export const lessonHref = (t: { lesson?: string }) => (t.lesson ? t.lesson.replace(/^\.\.\//, '/') : undefined);
