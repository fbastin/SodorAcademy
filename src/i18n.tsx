import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Sodor Academy speaks French and English, like the pages of "Pour les enfants"
// on slashbin.net. The language comes from ?lang=fr|en (the site's links add it),
// then from the last choice made here, then from the site's `lang` cookie, then
// from the browser.
//
// A text written in both languages is an object { fr, en }; a plain string is the
// same in both (or still English only: see `enOnly`).

export type Lang = 'fr' | 'en';
export type Text = string | { fr: string; en: string };

const STORAGE_KEY = 'sodor_academy_lang';

function detectLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'fr' || q === 'en') {
      localStorage.setItem(STORAGE_KEY, q);
      return q;
    }
  } catch { /* storage blocked */ }
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === 'fr' || s === 'en') return s;
  } catch { /* storage blocked */ }
  const c = document.cookie.match(/(?:^|;\s*)lang=(fr|en)(?:;|$)/);
  if (c) return c[1] as Lang;
  return /^fr\b/i.test(navigator.language || '') ? 'fr' : 'en';
}

// French typography: a non-breaking space before : ; ! ? and inside « ».
export const frTypo = (s: string) =>
  s.replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');

export function pick(text: Text | undefined, lang: Lang): string {
  if (text === undefined) return '';
  if (typeof text === 'string') return text;
  const v = text[lang] ?? text.en;
  return lang === 'fr' ? frTypo(v) : v;
}

// Interface strings. A value may be a function of a few arguments.
type Entry = string | ((...a: any[]) => string);
const UI: Record<Lang, Record<string, Entry>> = {
  en: {
    doc_title: 'Sodor Academy',
    lang_btn: 'FR', lang_label: 'Passer en français',
    back_kids: '← For kids',
    back_kids_title: 'Back to the pages for kids on slashbin.net',
    home: 'Sodor map',
    search: 'Find a lesson…', search_short: 'Search',
    points: 'Points', engines_collected: 'Engines collected',
    settings: 'Settings', logout: 'Log out', login: 'Log in', admin: 'Admin panel',
    guest_name: 'Explorer',
    welcome_guest: 'Welcome to Sodor!',
    welcome_back: (n: string) => `Welcome back, ${n}!`,
    pick_station: 'Pick a station on the map to start a lesson, an exercise or a quiz.',
    guest_note: 'Your progress is kept in this browser. Log in to keep it on every device.',
    level: 'Level', primary: 'Primary', secondary: 'Secondary',
    lesson_length: 'Quiz length',
    stations: 'Stations',
    lessons_n: (n: number) => `${n} lesson${n > 1 ? 's' : ''}`,
    activities_n: (n: number) => `${n} activit${n > 1 ? 'ies' : 'y'}`,
    site_pages_n: (n: number) => `${n} page${n > 1 ? 's' : ''} on slashbin.net`,
    lessons: 'Lessons', exercises: 'Exercises', quiz: 'Quiz',
    on_site: 'More on slashbin.net',
    on_site_intro: 'Lessons, games and labs from the pages for kids, on the same topics.',
    english_only: 'in English',
    station_of: (s: string) => s,
    all_stations: '← All stations',
    back_station: '← Back to the station',
    cinema: 'Sodor Cinema', library: 'The Library', concert: 'Concert Hall', roundhouse: 'The Roundhouse',
    open: 'Open →', locked: 'Locked', collected: 'Collected',
    locked_video: 'Keep learning to unlock!',
    locked_story: 'Locked story', locked_melody: 'Locked melody',
    collect_hint: 'Finish lessons to collect this engine',
    unlocked_of: (a: number, b: number) => `${a} of ${b} unlocked`,
    footer: 'Sodor Academy is part of the pages for kids on slashbin.net.',
    // Quiz
    loading: 'Stoking the fire…',
    listen: 'Listen', wrong_title: 'Cinders and ashes!', another: 'Try another one',
    next: 'Next station', correct: 'Well done!',
    quiz_name: (s: string) => `The ${s} quiz`,
    quiz_desc: 'Questions from the whole station, at your level.',
    question_of: (a: number, b: number) => `Question ${a} of ${b}`,
    start: 'Sheds', finish: 'Station',
    // Rewards
    reward_title: 'Well done!', reward_text: 'You reached the station and earned a reward!',
    story_unlocked: 'Story unlocked!', see_library: 'Look in the Library',
    melody_unlocked: 'Melody unlocked!', see_concert: 'Visit the Concert Hall',
    new_video: 'New video unlocked', new_engine: 'New engine collected',
    watch_now: 'Watch now', add_collection: 'Add to my collection',
    close: 'Close',
    // Search
    topics: 'Find a lesson', search_placeholder: 'A lesson, an exercise, a quiz…', all_topics: 'All',
    lesson_tag: 'Lesson', exercise_tag: 'Exercise', quiz_tag: 'Quiz', nothing_found: 'Nothing found.',
    // Library and concert
    all_stories: '← All stories', read_aloud: 'Read aloud', read_story: 'Read the story →',
    no_stories: 'No story unlocked yet.', no_stories_hint: 'Finish a story adventure at the English station to add it here.',
    concert_intro: 'Play the melodies you unlocked on the grand piano.',
    ready: 'Ready to play', keep_learning: 'Keep learning to unlock',
    // Settings
    prefs_title: 'Quiz length', prefs_intro: 'How many right answers to reach the station, for each station.',
    prefs_saved: 'Saved automatically.',
  },
  fr: {
    doc_title: 'Sodor Academy',
    lang_btn: 'EN', lang_label: 'Switch to English',
    back_kids: '← Pour les enfants',
    back_kids_title: 'Retour aux pages pour les enfants de slashbin.net',
    home: 'Carte de Sodor',
    search: 'Trouver une leçon…', search_short: 'Chercher',
    points: 'Points', engines_collected: 'Locomotives collectionnées',
    settings: 'Réglages', logout: 'Se déconnecter', login: 'Se connecter', admin: 'Administration',
    guest_name: 'Explorateur',
    welcome_guest: 'Bienvenue à Sodor !',
    welcome_back: (n: string) => `Bon retour, ${n} !`,
    pick_station: 'Choisis une gare sur la carte pour commencer une leçon, un exercice ou un quiz.',
    guest_note: 'Ta progression est gardée dans ce navigateur. Connecte-toi pour la retrouver sur tous tes appareils.',
    level: 'Niveau', primary: 'Primaire', secondary: 'Secondaire',
    lesson_length: 'Longueur des quiz',
    stations: 'Les gares',
    lessons_n: (n: number) => `${n} leçon${n > 1 ? 's' : ''}`,
    activities_n: (n: number) => `${n} activité${n > 1 ? 's' : ''}`,
    site_pages_n: (n: number) => `${n} page${n > 1 ? 's' : ''} sur slashbin.net`,
    lessons: 'Leçons', exercises: 'Exercices', quiz: 'Quiz',
    on_site: 'Pour aller plus loin sur slashbin.net',
    on_site_intro: 'Des leçons, des jeux et des labos des pages pour les enfants, sur les mêmes sujets.',
    english_only: 'en anglais',
    station_of: (s: string) => s,
    all_stations: '← Toutes les gares',
    back_station: '← Retour à la gare',
    cinema: 'Le cinéma de Sodor', library: 'La bibliothèque', concert: 'La salle de concert', roundhouse: 'La rotonde',
    open: 'Ouvrir →', locked: 'Verrouillé', collected: 'Collectionnée',
    locked_video: 'Continue d’apprendre pour la débloquer !',
    locked_story: 'Histoire verrouillée', locked_melody: 'Mélodie verrouillée',
    collect_hint: 'Termine des leçons pour collectionner cette locomotive',
    unlocked_of: (a: number, b: number) => `${a} sur ${b} débloqués`,
    footer: 'Sodor Academy fait partie des pages pour les enfants de slashbin.net.',
    loading: 'On met du charbon dans la chaudière…',
    listen: 'Écouter', wrong_title: 'Escarbilles et cendres !', another: 'Essayer une autre question',
    next: 'Gare suivante', correct: 'Bravo !',
    quiz_name: (s: string) => `Le quiz de la gare : ${s}`,
    quiz_desc: 'Des questions sur toute la gare, à ton niveau.',
    question_of: (a: number, b: number) => `Question ${a} sur ${b}`,
    start: 'Dépôt', finish: 'Gare',
    reward_title: 'Bravo !', reward_text: 'Te voilà à la gare, avec une récompense !',
    story_unlocked: 'Histoire débloquée !', see_library: 'Va voir à la bibliothèque',
    melody_unlocked: 'Mélodie débloquée !', see_concert: 'Va à la salle de concert',
    new_video: 'Nouvelle vidéo débloquée', new_engine: 'Nouvelle locomotive collectionnée',
    watch_now: 'Regarder', add_collection: 'Ajouter à ma collection',
    close: 'Fermer',
    topics: 'Trouver une leçon', search_placeholder: 'Une leçon, un exercice, un quiz…', all_topics: 'Toutes',
    lesson_tag: 'Leçon', exercise_tag: 'Exercice', quiz_tag: 'Quiz', nothing_found: 'Rien trouvé.',
    all_stories: '← Toutes les histoires', read_aloud: 'Lire à voix haute', read_story: 'Lire l’histoire →',
    no_stories: 'Aucune histoire débloquée pour l’instant.', no_stories_hint: 'Termine une aventure à la gare English pour l’ajouter ici.',
    concert_intro: 'Joue au piano les mélodies que tu as débloquées.',
    ready: 'Prête à jouer', keep_learning: 'Continue d’apprendre pour la débloquer',
    prefs_title: 'Longueur des quiz', prefs_intro: 'Le nombre de bonnes réponses pour arriver à la gare, gare par gare.',
    prefs_saved: 'Enregistré automatiquement.',
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, ...args: any[]) => string;
  tr: (text: Text | undefined) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* storage blocked */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = (UI[lang].doc_title as string);
  }, [lang]);

  const value = useMemo<LangContextValue>(() => ({
    lang,
    setLang,
    t: (key, ...args) => {
      let v = UI[lang][key] ?? UI.en[key];
      if (v === undefined) return key;
      if (typeof v === 'function') v = v(...args);
      return lang === 'fr' ? frTypo(v as string) : (v as string);
    },
    tr: (text) => pick(text, lang),
  }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang outside LangProvider');
  return ctx;
}

// A link to a page of slashbin.net, in the language chosen here: {lang} in the
// address is replaced, otherwise ?lang= is added (before any #fragment).
export function withLang(href: string, lang: Lang): string {
  if (href.includes('{lang}')) return href.split('{lang}').join(lang);
  const [path, hash] = href.split('#');
  return path + (path.includes('?') ? '&' : '?') + 'lang=' + lang + (hash !== undefined ? '#' + hash : '');
}
