import { LucideIcon, Calculator, BookOpen, FlaskConical, History, Globe2, Music, Code2 } from 'lucide-react';
import { Text } from '../i18n';

// The stations of Sodor Academy: one per subject, placed on the map of Sodor.
//
// A station holds its activities (lessons, exercises and the quiz of its question
// bank) and links to the pages for kids on slashbin.net on the same topics, so the
// Academy and those pages follow one programme. An activity still written in
// English only is marked `enOnly`; the interface says so in French.

export type ActivityKind = 'lesson' | 'exercise' | 'quiz';

export interface Activity {
  id: string;
  kind: ActivityKind;
  component?: string;        // the component that runs it; none for the quiz
  title: Text;
  desc: Text;
  enOnly?: boolean;
  next?: string;             // after a lesson, the exercise it leads to
  practice?: string;         // an exercise on a topic of the Practice Room (practice/bank.ts)
}

export interface SiteLink {
  href: string;              // an address of slashbin.net; {lang} becomes fr or en
  card: string;              // a 16:9 thumbnail
  title: Text;
  desc: Text;
  enOnly?: boolean;
}

export interface Station {
  id: string;
  bank: string;              // the name of its question bank and of its quiz settings
  title: Text;
  place: Text;
  desc: Text;
  color: string;
  icon: LucideIcon;
  x: number;                 // position on the map, in percent
  y: number;
  activities: Activity[];
  links: SiteLink[];
}

const PHYS = (topic: string) => `/Physics-for-kids/index.php?topic=${topic}`;
const MATHS = (path: string) => `/Mathematics/${path}?lang={lang}`;
const PROG = (file: string) => `/Programming/${file}?lang={lang}`;

const PRACTICE: SiteLink = {
  href: '/Practice/index.html?lang={lang}', card: '/Practice/cards/practice.jpg',
  title: { fr: 'La salle d’entraînement', en: 'The Practice Room' },
  desc: {
    fr: 'Des exercices à volonté sur tout le programme, avec un score de maîtrise par compétence.',
    en: 'Endless practice on the whole programme, with a mastery score for each skill.',
  },
};

export const STATIONS: Station[] = [
  {
    id: 'math', bank: 'Mathematics', color: '#2464d6', icon: Calculator, x: 24, y: 65,
    title: { fr: 'Mathématiques', en: 'Mathematics' },
    place: { fr: 'Gare de Knapford', en: 'Knapford Station' },
    desc: {
      fr: 'Les nombres, le calcul, les tables, la division, les formes et les fractions, avec les locomotives de Sodor.',
      en: 'Numbers, sums, times tables, division, shapes and fractions, with the engines of Sodor.',
    },
    activities: [
      { id: 'math-tables-lesson', kind: 'lesson', component: 'TimesTablesLesson', next: 'math-practice-mult',
        title: { fr: 'Les tables de multiplication', en: 'The Times Tables' },
        desc: { fr: 'Des voitures pleines de passagers, et un truc pour chaque table.', en: 'Coaches full of passengers, and a trick for each table.' } },
      { id: 'math-division-lesson', kind: 'lesson', component: 'DivisionLesson', next: 'math-practice-div',
        title: { fr: 'La division', en: 'Division' },
        desc: { fr: 'Partager en parts égales, le reste, et la division posée geste par geste.', en: 'Sharing equally, remainders, and long division one move at a time.' } },
      { id: 'math-mean-lesson', kind: 'lesson', component: 'ArithmeticMeanLesson', next: 'math-mean-exercise',
        title: { fr: 'La moyenne', en: 'The Average' },
        desc: { fr: 'Calculer une moyenne avec les wagons de Gordon.', en: 'Work out an average with Gordon’s trucks.' } },
      { id: 'math-fractions-add-lesson', kind: 'lesson', component: 'FractionAdditionLesson', next: 'math-fractions-add',
        title: { fr: 'Additionner des fractions', en: 'Adding Fractions' },
        desc: { fr: 'Additionner des fractions avec Percy.', en: 'Add fractions with Percy.' } },
      { id: 'math-lcm-lesson', kind: 'lesson', component: 'LCMLesson', next: 'math-lcm',
        title: { fr: 'Le plus petit commun multiple', en: 'The Least Common Multiple' },
        desc: { fr: 'Le plus petit nombre que deux nombres divisent, avec Thomas.', en: 'The smallest number two numbers both divide, with Thomas.' } },
      { id: 'math-prisms-lesson', kind: 'lesson', component: 'PrismsLesson',
        title: { fr: 'Les prismes et les pyramides', en: 'Prisms and Pyramids' },
        desc: { fr: 'Les solides : faces, arêtes et sommets.', en: 'Solids: faces, edges and corners.' } },
      { id: 'math-practice-num', kind: 'exercise', practice: 'm-num',
        title: { fr: 'Les nombres', en: 'Numbers' },
        desc: { fr: 'Pair ou impair, la valeur des chiffres, la droite numérique, les nombres premiers et les multiples.', en: 'Even and odd, place value, the number line, prime numbers and multiples.' } },
      { id: 'math-practice-add', kind: 'exercise', practice: 'm-add',
        title: { fr: 'Additionner et soustraire', en: 'Adding and Subtracting' },
        desc: { fr: 'Jusqu’à 20, puis 100, puis 1 000, et faire 10 et 100.', en: 'Up to 20, then 100, then 1,000, and making 10 and 100.' } },
      { id: 'math-practice-mult', kind: 'exercise', practice: 'm-mult',
        title: { fr: 'Les tables de multiplication', en: 'Times Tables' },
        desc: { fr: 'Les tables de 2 à 12, le facteur manquant et les rangées de points.', en: 'The tables from 2 to 12, the missing factor and rows of dots.' } },
      { id: 'math-practice-div', kind: 'exercise', practice: 'm-div',
        title: { fr: 'Diviser', en: 'Dividing' },
        desc: { fr: 'Les faits de division, estimer un quotient, la division posée et le reste.', en: 'Division facts, estimating a quotient, long division and remainders.' } },
      { id: 'math-practice-shapes', kind: 'exercise', practice: 'm-shapes',
        title: { fr: 'Les formes', en: 'Shapes' },
        desc: { fr: 'Nommer les formes, compter côtés et sommets, la symétrie et les angles.', en: 'Naming shapes, counting sides and corners, symmetry and angles.' } },
      { id: 'math-practice-gcd', kind: 'exercise', practice: 'm-gcd',
        title: { fr: 'Les diviseurs et le PGCD', en: 'Divisors and the GCD' },
        desc: { fr: 'Trouver les diviseurs, puis suivre l’algorithme d’Euclide.', en: 'Find the divisors, then follow Euclid’s algorithm.' } },
      { id: 'math-practice-frac', kind: 'exercise', practice: 'm-frac',
        title: { fr: 'Les fractions', en: 'Fractions' },
        desc: { fr: 'Fractions équivalentes, simplifier, multiplier, et une fraction d’un nombre.', en: 'Equivalent fractions, simplifying, multiplying, and a fraction of a number.' } },
      { id: 'math-mean-exercise', kind: 'exercise', component: 'ArithmeticMeanExercise',
        title: { fr: 'La moyenne : premiers pas', en: 'Averages: First Steps' },
        desc: { fr: 'Des moyennes simples pour commencer.', en: 'Simple averages to start with.' } },
      { id: 'math-mean-mastery', kind: 'exercise', component: 'ArithmeticMeanMastery',
        title: { fr: 'La moyenne : maîtrise', en: 'Averages: Mastery' },
        desc: { fr: 'Des moyennes avec plus ou moins de wagons.', en: 'Averages with more or fewer trucks.' } },
      { id: 'math-mean-word-problems', kind: 'exercise', component: 'ArithmeticMeanWordProblems',
        title: { fr: 'La moyenne : problèmes', en: 'Averages: Word Problems' },
        desc: { fr: 'Des problèmes de moyenne à lire et à résoudre.', en: 'Average problems to read and solve.' } },
      { id: 'math-fractions-simple', kind: 'exercise', component: 'SimpleFractionAddition',
        title: { fr: 'Fractions de même dénominateur', en: 'Fractions with the Same Denominator' },
        desc: { fr: 'Additionner des fractions qui ont le même dénominateur.', en: 'Add fractions that share a denominator.' } },
      { id: 'math-fractions-add', kind: 'exercise', component: 'FractionAddition',
        title: { fr: 'Additionner des fractions', en: 'Adding Fractions' },
        desc: { fr: 'Aider Percy à additionner ses chargements.', en: 'Help Percy add up his loads.' } },
      { id: 'math-fraction-int', kind: 'exercise', component: 'FractionIntegerAddition',
        title: { fr: 'Un entier plus une fraction', en: 'A Whole Number Plus a Fraction' },
        desc: { fr: 'Aider Gordon à additionner entiers et fractions.', en: 'Help Gordon add whole numbers and fractions.' } },
      { id: 'math-fractions-mult', kind: 'exercise', component: 'FractionMultiplication',
        title: { fr: 'Multiplier des fractions', en: 'Multiplying Fractions' },
        desc: { fr: 'Aider Thomas à multiplier des fractions.', en: 'Help Thomas multiply fractions.' } },
      { id: 'math-lcm', kind: 'exercise', component: 'LCMExercise',
        title: { fr: 'Le défi du PPCM', en: 'The LCM Challenge' },
        desc: { fr: 'Trouver le plus petit commun multiple des locomotives.', en: 'Find the least common multiple for the engines.' } },
      { id: 'math-quiz', kind: 'quiz',
        title: { fr: 'Le quiz de Knapford', en: 'The Knapford Quiz' },
        desc: { fr: 'Calcul, heures, nombres et géométrie, à ton niveau.', en: 'Sums, time, numbers and geometry, at your level.' } },
    ],
    links: [
      { href: MATHS('numbers/number-line.html'), card: '/Mathematics/cards/number-line.jpg',
        title: { fr: 'La droite numérique', en: 'Number Line Explorer' },
        desc: { fr: 'Compter, ranger et décomposer les nombres.', en: 'Counting, order and place value.' } },
      { href: MATHS('arithmetic/add-subtract.html'), card: '/Mathematics/cards/add-subtract.jpg',
        title: { fr: 'Le train du calcul', en: 'Add & Subtract Express' },
        desc: { fr: 'Additions et soustractions, à quatre niveaux.', en: 'Addition and subtraction, at four levels.' } },
      { href: MATHS('multiplication/times-tables.html'), card: '/Mathematics/cards/times-tables.jpg',
        title: { fr: 'Les tables de multiplication', en: 'Times Tables Explorer' },
        desc: { fr: 'Les tables de 1 à 12, en rangées de points.', en: 'The tables from 1 to 12, as rows of dots.' } },
      { href: MATHS('division/long-division.html'), card: '/Mathematics/cards/long-division.jpg',
        title: { fr: 'Diviser par un nombre à deux chiffres', en: 'Dividing by a 2-Digit Number' },
        desc: { fr: 'La division posée, pas à pas.', en: 'Long division, step by step.' } },
      { href: MATHS('shapes/shapes.html'), card: '/Mathematics/cards/shapes.jpg',
        title: { fr: 'La ville des formes', en: 'Shape Town' },
        desc: { fr: 'Côtés, sommets et axes de symétrie.', en: 'Sides, corners and lines of symmetry.' } },
      { href: MATHS('euclid/euclid.html'), card: '/Mathematics/cards/euclid.jpg',
        title: { fr: 'L’algorithme d’Euclide', en: 'Euclid’s Algorithm' },
        desc: { fr: 'Le plus grand commun diviseur.', en: 'The greatest common divisor.' } },
      { href: MATHS('fractions/multiplying-fractions.html'), card: '/Mathematics/cards/multiplying-fractions.jpg',
        title: { fr: 'L’express des fractions', en: 'Fraction Express' },
        desc: { fr: 'Multiplier, puis simplifier, pour faire avancer Thomas.', en: 'Multiply, then simplify, to move Thomas along.' } },
      PRACTICE,
    ],
  },
  {
    id: 'english', bank: 'English', color: '#e23b2e', icon: BookOpen, x: 14, y: 45,
    title: { fr: 'English', en: 'English' },
    place: { fr: 'Dépôt de Tidmouth', en: 'Tidmouth Sheds' },
    desc: {
      fr: 'Lire des histoires en anglais et répondre aux questions.',
      en: 'Read stories and answer questions about them.',
    },
    activities: [
      { id: 'eng-stories', kind: 'exercise', component: 'StoryExercise', enOnly: true,
        title: { fr: 'Les histoires de Sodor', en: 'Story Adventures' },
        desc: { fr: 'Lire une histoire, puis répondre aux questions.', en: 'Read a story, then answer the questions.' } },
      { id: 'eng-quiz', kind: 'quiz', enOnly: true,
        title: { fr: 'Le quiz de Tidmouth', en: 'The Tidmouth Quiz' },
        desc: { fr: 'Orthographe, grammaire et vocabulaire.', en: 'Spelling, grammar and vocabulary.' } },
    ],
    links: [],
  },
  {
    id: 'science', bank: 'Science', color: '#1c7a55', icon: FlaskConical, x: 91, y: 40,
    title: { fr: 'Sciences', en: 'Science' },
    place: { fr: 'Gare de Vicarstown', en: 'Vicarstown' },
    desc: {
      fr: 'Les forces, la vapeur, l’électricité, les aimants et la chimie.',
      en: 'Forces, steam, electricity, magnets and chemistry.',
    },
    activities: [
      { id: 'sci-force-lesson', kind: 'lesson', component: 'ForceLesson', next: 'sci-practice-forces',
        title: { fr: 'Les forces et la gravité', en: 'Forces and Gravity' },
        desc: { fr: 'Pousser, tirer, tomber : la 2e loi de Newton avec Thomas.', en: 'Pushes, pulls and falling: Newton’s second law with Thomas.' } },
      { id: 'sci-elec-lesson', kind: 'lesson', component: 'ElectricityLesson', next: 'sci-practice-elec',
        title: { fr: 'L’électricité', en: 'Electricity' },
        desc: { fr: 'Le courant, les circuits, les conducteurs et Étienne.', en: 'Current, circuits, conductors and Étienne.' } },
      { id: 'sci-magnets-lesson', kind: 'lesson', component: 'MagnetsLesson', next: 'sci-practice-magnets',
        title: { fr: 'Les aimants', en: 'Magnets' },
        desc: { fr: 'Les pôles, ce qu’un aimant attire et l’électroaimant de la grue.', en: 'Poles, what a magnet attracts and the crane’s electromagnet.' } },
      { id: 'sci-gears-lesson', kind: 'lesson', component: 'GearsLesson', next: 'sci-practice-gears',
        title: { fr: 'Les engrenages', en: 'Gears' },
        desc: { fr: 'Des roues qui tournent en sens contraires, et le train à crémaillère.', en: 'Wheels turning opposite ways, and the rack railway.' } },
      { id: 'sci-solar-lesson', kind: 'lesson', component: 'SolarSystemLesson', next: 'sci-practice-solar',
        title: { fr: 'Le système solaire', en: 'The Solar System' },
        desc: { fr: 'Les huit planètes et leurs deux familles, l’unité astronomique, le jour et l’année, les planètes naines et les satellites.', en: 'The eight planets and their two families, the astronomical unit, days and years, dwarf planets and moons.' } },
      { id: 'sci-ph-lesson', kind: 'lesson', component: 'AcidsBasesLesson', next: 'sci-practice-ph',
        title: { fr: 'Les acides et les bases', en: 'Acids and Bases' },
        desc: { fr: 'L’échelle de pH, les produits de la maison et le papier de tournesol.', en: 'The pH scale, household products and litmus paper.' } },
      { id: 'sci-practice-forces', kind: 'exercise', practice: 's-forces',
        title: { fr: 'Les forces et la gravité', en: 'Forces and Gravity' },
        desc: { fr: 'F = m × a et la chute des objets.', en: 'F = m × a and how things fall.' } },
      { id: 'sci-practice-elec', kind: 'exercise', practice: 's-elec',
        title: { fr: 'L’électricité', en: 'Electricity' },
        desc: { fr: 'Conducteurs, isolants et matériaux qui laissent passer le courant.', en: 'Conductors, insulators and materials that let current through.' } },
      { id: 'sci-practice-magnets', kind: 'exercise', practice: 's-magnets',
        title: { fr: 'Les aimants', en: 'Magnets' },
        desc: { fr: 'Attirer ou repousser, ce qu’un aimant attire, les électroaimants.', en: 'Attract or repel, what a magnet attracts, electromagnets.' } },
      { id: 'sci-practice-gears', kind: 'exercise', practice: 's-gears',
        title: { fr: 'Les engrenages', en: 'Gears' },
        desc: { fr: 'Le sens de rotation, compter les tours, les machines à engrenages.', en: 'Which way it turns, counting turns, machines with gears.' } },
      { id: 'sci-practice-solar', kind: 'exercise', practice: 's-solar',
        title: { fr: 'Le système solaire', en: 'The Solar System' },
        desc: { fr: 'L’ordre et la taille des planètes, et leur tour du Soleil.', en: 'The order and size of the planets, and their trip around the Sun.' } },
      { id: 'sci-practice-ph', kind: 'exercise', practice: 's-ph',
        title: { fr: 'Les acides et les bases', en: 'Acids and Bases' },
        desc: { fr: 'Lire l’échelle de pH et classer les produits de la maison.', en: 'Read the pH scale and sort household products.' } },
      { id: 'sci-quiz', kind: 'quiz',
        title: { fr: 'Le quiz de Vicarstown', en: 'The Vicarstown Quiz' },
        desc: { fr: 'L’eau, les plantes, les aimants, l’électricité et l’énergie, à ton niveau.', en: 'Water, plants, magnets, electricity and energy, at your level.' } },
    ],
    links: [
      { href: PHYS('newton'), card: '/Physics-for-kids/cards/newton.jpg',
        title: { fr: 'La 2e loi de Newton', en: '2nd Newton Law' },
        desc: { fr: 'F = m·a et la gravité, avec des simulations.', en: 'F = m·a and gravity, with simulations.' } },
      { href: PHYS('electricity'), card: '/Physics-for-kids/cards/electricity.jpg',
        title: { fr: 'L’électricité', en: 'Electricity' },
        desc: { fr: 'Courant, conducteurs et circuits, et le circuit d’Étienne.', en: 'Current, conductors and circuits, and Étienne’s circuit.' } },
      { href: PHYS('magnets'), card: '/Physics-for-kids/cards/magnets.jpg',
        title: { fr: 'Les aimants', en: 'Magnets' },
        desc: { fr: 'Pôles, domaines et électroaimants.', en: 'Poles, domains and electromagnets.' } },
      { href: PHYS('gears'), card: '/Physics-for-kids/cards/gears.jpg',
        title: { fr: 'Les engrenages', en: 'Gears' },
        desc: { fr: 'Dents, vitesse et force, jusqu’au train à crémaillère.', en: 'Teeth, speed and force, up to the rack railway.' } },
      { href: PHYS('solar-system'), card: '/Physics-for-kids/cards/solar-system.jpg',
        title: { fr: 'Le système solaire', en: 'The Solar System' },
        desc: { fr: 'Une leçon sur les planètes, leurs familles et leurs satellites, et une simulation sur les vraies orbites.', en: 'A lesson on the planets, their families and their moons, and a simulation on the real orbits.' } },
      { href: '/Chemistry-for-kids/index.php', card: '/Chemistry-for-kids/cards/ph.jpg',
        title: { fr: 'La chimie : acides, bases et pH', en: 'Chemistry: Acids, Bases & pH' },
        desc: { fr: 'L’échelle de pH, le papier de tournesol et le titrage.', en: 'The pH scale, litmus paper and titration.' } },
      PRACTICE,
    ],
  },
  {
    id: 'history', bank: 'History', color: '#7a62c9', icon: History, x: 44, y: 72,
    title: { fr: 'Histoire', en: 'History' },
    place: { fr: 'Wellsworth', en: 'Wellsworth' },
    desc: {
      fr: 'Des Romains aux chemins de fer : les grandes dates de l’histoire.',
      en: 'From the Romans to the railways: the great dates of history.',
    },
    activities: [
      { id: 'his-quiz', kind: 'quiz',
        title: { fr: 'Le quiz de Wellsworth', en: 'The Wellsworth Quiz' },
        desc: { fr: 'Des Romains aux chemins de fer britanniques, à ton niveau.', en: 'From the Romans to Britain’s railways, at your level.' } },
    ],
    links: [],
  },
  {
    id: 'geography', bank: 'Geography', color: '#ff8a1f', icon: Globe2, x: 52, y: 28,
    title: { fr: 'Géographie', en: 'Geography' },
    place: { fr: 'Peel Godred', en: 'Peel Godred' },
    desc: {
      fr: 'Les continents, les océans, la Terre qui tourne et les saisons.',
      en: 'Continents, oceans, the turning Earth and the seasons.',
    },
    activities: [
      { id: 'geo-earth-lesson', kind: 'lesson', component: 'EarthLesson', next: 'geo-quiz',
        title: { fr: 'La Terre qui tourne', en: 'The Turning Earth' },
        desc: { fr: 'Le jour et la nuit, les fuseaux horaires et les saisons.', en: 'Day and night, time zones and the seasons.' } },
      { id: 'geo-continents-lesson', kind: 'lesson', component: 'ContinentsLesson', next: 'geo-continents-exercise',
        title: { fr: 'Les 7 continents', en: 'The 7 Continents' },
        desc: { fr: 'Les grandes terres du monde.', en: 'The great lands of the world.' } },
      { id: 'geo-continents-exercise', kind: 'exercise', component: 'ContinentsExercise',
        title: { fr: 'Le défi des continents', en: 'The Continents Challenge' },
        desc: { fr: 'Reconnaître chaque continent.', en: 'Recognise each continent.' } },
      { id: 'geo-quiz', kind: 'quiz',
        title: { fr: 'Le quiz de Peel Godred', en: 'The Peel Godred Quiz' },
        desc: { fr: 'Capitales, points cardinaux, rivières et climat, à ton niveau.', en: 'Capitals, compass points, rivers and weather, at your level.' } },
    ],
    links: [
      { href: PHYS('earth'), card: '/Physics-for-kids/cards/earth.jpg',
        title: { fr: 'La Terre', en: 'Earth' },
        desc: { fr: 'Un globe en 3D : le jour et la nuit, les fuseaux horaires, les saisons.', en: 'A 3D globe: day and night, time zones, the seasons.' } },
    ],
  },
  {
    id: 'music', bank: 'Music', color: '#c2368a', icon: Music, x: 72, y: 48,
    title: { fr: 'Musique', en: 'Music' },
    place: { fr: 'Crovan’s Gate', en: 'Crovan’s Gate' },
    desc: {
      fr: 'Lire et comprendre la musique : les notes, le rythme, les intervalles, les gammes et les accords. Et les sons, l’oreille et le piano.',
      en: 'Reading and understanding music: notes, rhythm, intervals, scales and chords. And sound, ear training and the piano.',
    },
    activities: [
      { id: 'mus-read-lesson', kind: 'lesson', component: 'ReadingNotesLesson', next: 'mus-practice-read',
        title: { fr: 'Lire les notes', en: 'Reading Notes' },
        desc: { fr: 'La portée, la clé de sol et la clé de fa, le do central, les dièses et les bémols.', en: 'The staff, the treble and bass clefs, middle C, sharps and flats.' } },
      { id: 'mus-practice-read', kind: 'exercise', practice: 'mu-read',
        title: { fr: 'Les notes sur la portée', en: 'Notes on the Staff' },
        desc: { fr: 'Nommer les notes en clé de sol, de fa et d’ut, avec leurs altérations, à ton niveau.', en: 'Name the notes in the treble, bass and C clefs, with their accidentals, at your level.' } },
      { id: 'mus-rhythm-lesson', kind: 'lesson', component: 'RhythmLesson', next: 'mus-practice-values',
        title: { fr: 'Le rythme', en: 'Rhythm' },
        desc: { fr: 'Les figures de notes et les silences, le point et la liaison, la mesure.', en: 'Note values and rests, dots and ties, bars and time signatures.' } },
      { id: 'mus-practice-values', kind: 'exercise', practice: 'mu-values',
        title: { fr: 'Les valeurs des notes', en: 'Note Values' },
        desc: { fr: 'Reconnaître les figures et les silences, et compter leurs durées.', en: 'Recognise notes and rests, and count how long they last.' } },
      { id: 'mus-practice-metre', kind: 'exercise', practice: 'mu-metre',
        title: { fr: 'La mesure', en: 'Metre' },
        desc: { fr: 'Lire les chiffres indicateurs et compléter une mesure.', en: 'Read time signatures and complete a bar.' } },
      { id: 'mus-scales-lesson', kind: 'lesson', component: 'IntervalsScalesLesson', next: 'mus-practice-intervals',
        title: { fr: 'Intervalles et gammes', en: 'Intervals and Scales' },
        desc: { fr: 'Le ton et le demi-ton, les intervalles, la gamme majeure, les armures et les gammes mineures.', en: 'Tones and semitones, intervals, the major scale, key signatures and minor scales.' } },
      { id: 'mus-practice-intervals', kind: 'exercise', practice: 'mu-int',
        title: { fr: 'Les intervalles', en: 'Intervals' },
        desc: { fr: 'Nommer un intervalle, trouver sa qualité et son renversement.', en: 'Name an interval, find its quality and its inversion.' } },
      { id: 'mus-practice-scales', kind: 'exercise', practice: 'mu-scales',
        title: { fr: 'Les gammes et les tonalités', en: 'Scales and Keys' },
        desc: { fr: 'Les armures, l’ordre des dièses et des bémols, les degrés et les gammes mineures.', en: 'Key signatures, the order of sharps and flats, scale degrees and minor scales.' } },
      { id: 'mus-chords-lesson', kind: 'lesson', component: 'ChordsLesson', next: 'mus-practice-chords',
        title: { fr: 'Les accords', en: 'Chords' },
        desc: { fr: 'L’accord parfait, majeur ou mineur, les accords des degrés, les renversements et la cadence parfaite.', en: 'Major and minor triads, chords on each degree, inversions and the perfect cadence.' } },
      { id: 'mus-practice-chords', kind: 'exercise', practice: 'mu-chords',
        title: { fr: 'Les accords et les cadences', en: 'Chords and Cadences' },
        desc: { fr: 'La nature des accords, leurs renversements, la septième de dominante et les cadences.', en: 'Triad qualities, inversions, the dominant seventh and cadences.' } },
      { id: 'mus-practice-perf', kind: 'exercise', practice: 'mu-perf',
        title: { fr: 'L’interprétation', en: 'Performance Markings' },
        desc: { fr: 'Les mouvements, les nuances, les articulations et les ornements.', en: 'Tempo markings, dynamics, articulations and ornaments.' } },
      { id: 'mus-waves-lesson', kind: 'lesson', component: 'SoundWavesLesson', next: 'mus-ear-training',
        title: { fr: 'Les ondes sonores', en: 'Sound Waves' },
        desc: { fr: 'Fréquence, amplitude et forme des ondes.', en: 'Frequency, amplitude and waveforms.' } },
      { id: 'mus-ear-training', kind: 'exercise', component: 'PianoSequence',
        title: { fr: 'L’oreille musicale', en: 'Ear Training' },
        desc: { fr: 'Écouter trois notes et les retrouver au piano.', en: 'Listen to three notes and find them on the piano.' } },
      { id: 'mus-piano', kind: 'exercise', component: 'Piano', enOnly: true,
        title: { fr: 'Le grand piano', en: 'The Grand Piano' },
        desc: { fr: 'Jouer tes morceaux préférés sur 88 touches.', en: 'Play your favourite tunes on 88 keys.' } },
      { id: 'mus-quiz', kind: 'quiz',
        title: { fr: 'Le quiz de Crovan’s Gate', en: 'The Crovan’s Gate Quiz' },
        desc: { fr: 'Les notes, le rythme, les intervalles et les compositeurs.', en: 'Notes, rhythm, intervals and composers.' } },
    ],
    links: [
      { href: '/musique/index.php?lang={lang}', card: '/musique/cards/theorie.jpg',
        title: { fr: 'Les guides de théorie musicale', en: 'Music theory guides' },
        desc: { fr: 'Douze guides en PDF, de la lecture des notes aux cadences, avec leurs partitions à écouter.', en: 'Twelve PDF guides, from reading notes to cadences, with their scores to listen to (in French).' } },
      PRACTICE,
    ],
  },
  {
    id: 'programming', bank: 'Programming', color: '#0e7c86', icon: Code2, x: 80, y: 63,
    title: { fr: 'Programmation', en: 'Programming' },
    place: { fr: 'Les ateliers de Sodor', en: 'The Steamworks' },
    desc: {
      fr: 'Un cours de JavaScript en sept leçons, jusqu’à l’algorithme d’Euclide.',
      en: 'A JavaScript course in seven lessons, up to Euclid’s algorithm.',
    },
    activities: [
      { id: 'code-first-lesson', kind: 'lesson', component: 'FirstProgramLesson', next: 'code-practice-basics',
        title: { fr: 'Qu’est-ce qu’un programme ?', en: 'What Is a Program?' },
        desc: { fr: 'Des instructions dans l’ordre, afficher, les variables et les boucles.', en: 'Instructions in order, printing, variables and loops.' } },
      { id: 'code-practice-basics', kind: 'exercise', practice: 'c-basics',
        title: { fr: 'Les calculs et les variables', en: 'Calculations and Variables' },
        desc: { fr: 'La priorité des opérations, suivre une variable, coller du texte et des nombres.', en: 'Order of operations, following a variable, joining text and numbers.' } },
      { id: 'code-practice-flow', kind: 'exercise', practice: 'c-flow',
        title: { fr: 'Les conditions et les boucles', en: 'Conditions and Loops' },
        desc: { fr: 'Suivre un if, ce que calcule une boucle, combien de lignes s’affichent.', en: 'Following an if, what a loop works out, how many lines are printed.' } },
      { id: 'code-practice-func', kind: 'exercise', practice: 'c-func',
        title: { fr: 'Les fonctions et les tableaux', en: 'Functions and Arrays' },
        desc: { fr: 'Ce que renvoie une fonction, lire un tableau.', en: 'What a function returns, reading an array.' } },
      { id: 'code-practice-euclid', kind: 'exercise', practice: 'c-euclid',
        title: { fr: 'L’algorithme d’Euclide en code', en: 'Euclid’s Algorithm in Code' },
        desc: { fr: 'Suivre la boucle d’Euclide pas à pas.', en: 'Follow Euclid’s loop step by step.' } },
    ],
    links: [
      { href: PROG('01-first-program.html'), card: '/Programming/cards/01-first-program.jpg',
        title: { fr: '1. Ton premier programme', en: '1. Your first program' },
        desc: { fr: 'Afficher, calculer, et le reste de la division.', en: 'Printing, calculating, and the remainder.' } },
      { href: PROG('02-variables.html'), card: '/Programming/cards/02-variables.jpg',
        title: { fr: '2. Les variables', en: '2. Variables' },
        desc: { fr: 'Des boîtes qui portent un nom.', en: 'Boxes with a name.' } },
      { href: PROG('03-conditions.html'), card: '/Programming/cards/03-conditions.jpg',
        title: { fr: '3. Les conditions', en: '3. Making decisions' },
        desc: { fr: 'Choisir quoi faire avec if et else.', en: 'Choosing what to do with if and else.' } },
      { href: PROG('04-loops.html'), card: '/Programming/cards/04-loops.jpg',
        title: { fr: '4. Les boucles', en: '4. Loops' },
        desc: { fr: 'Répéter avec while et for.', en: 'Repeating with while and for.' } },
      { href: PROG('05-functions.html'), card: '/Programming/cards/05-functions.jpg',
        title: { fr: '5. Les fonctions', en: '5. Functions' },
        desc: { fr: 'Nommer un morceau de programme.', en: 'Naming a piece of program.' } },
      { href: PROG('06-arrays.html'), card: '/Programming/cards/06-arrays.jpg',
        title: { fr: '6. Les tableaux et les objets', en: '6. Arrays and objects' },
        desc: { fr: 'Des listes de valeurs et des valeurs avec un nom.', en: 'Lists of values and values with a name.' } },
      { href: PROG('07-euclid.html'), card: '/Programming/cards/07-euclid.jpg',
        title: { fr: '7. Projet : l’algorithme d’Euclide', en: '7. Project: Euclid’s algorithm' },
        desc: { fr: 'Écrire soi-même le code d’Euclide.', en: 'Write Euclid’s code yourself.' } },
      PRACTICE,
    ],
  },
];

export const stationById = (id?: string) => STATIONS.find(s => s.id === id);

export function activityById(station: Station | undefined, id?: string): Activity | undefined {
  return station?.activities.find(a => a.id === id);
}
