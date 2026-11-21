import { Text } from './i18n';

export interface StoryQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  questions: StoryQuestion[];
  thumbnail: string;
}

export type Grade = 'Primary' | 'Secondary';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  rewardType: 'badge' | 'engine' | 'coin' | 'video';
  perm?: number[];   // in a quiz: the shuffled options, as positions in the bank's order
}

export interface MusicNote {
  keyIndex: number;
  time: number; // in seconds
  duration?: number;
}

export interface MusicScore {
  id: string;
  title: string;
  thumbnail: string;
  notes: MusicNote[];
}

export interface UserStats {
  score: number;
  completedLessons: number;
  enginesCollected: string[];
  videosUnlocked: string[];
  currentGrade: Grade;
  fractionExercisesCompleted?: string[];
  completedStories?: string[];
  unlockedMusic?: string[];
  preferences?: {
    questionsPerSubject?: Record<string, number>;
  };
}

export interface Video {
  id: string;
  title: Text;
  filename: string;
  poster: string;
  description: Text;
}

// The films of the Sodor Cinema, in media/; their posters are in media/posters/.
export const VIDEOS: Video[] = [
  {
    id: 'welcome',
    title: { fr: 'Bienvenue à Sodor !', en: 'Welcome to Sodor!' },
    filename: 'Thomas_and_Sir_Topham_Hatt_wel.mp4',
    poster: 'posters/welcome.jpg',
    description: { fr: 'Sir Topham Hatt t’accueille à l’Académie.', en: 'Sir Topham Hatt welcomes you to the Academy.' },
  },
  {
    id: 'steam-congrats',
    title: { fr: 'Bravo en vapeur', en: 'Congratulations in Steam' },
    filename: 'Thomas_is_using_is_whistle_to.mp4',
    poster: 'posters/steam-congrats.jpg',
    description: { fr: 'Thomas écrit « Congratulations! » dans le ciel avec sa vapeur.', en: 'Thomas writes “Congratulations!” in the sky with his steam.' },
  },
  {
    id: 'thomas-sharing',
    title: { fr: 'La fête à la gare', en: 'A Party at the Station' },
    filename: 'Thomas_likes_to_share.mp4',
    poster: 'posters/thomas-sharing.jpg',
    description: { fr: 'Thomas partage des gâteaux avec ses amis.', en: 'Thomas shares cakes with his friends.' },
  },
];

export const ENGINES = [
  { id: 'thomas', name: 'Thomas', number: '1', color: '#1565c0', description: { fr: 'La locomotive bleue numéro 1.', en: 'The number 1 blue engine.' } },
  { id: 'percy', name: 'Percy', number: '6', color: '#2e7d32', description: { fr: 'La petite locomotive verte du courrier.', en: 'The little green mail engine.' } },
  { id: 'james', name: 'James', number: '5', color: '#c62828', description: { fr: 'La splendide locomotive rouge.', en: 'The splendid red engine.' } },
  { id: 'gordon', name: 'Gordon', number: '4', color: '#1e3a8a', description: { fr: 'La grande locomotive de l’express.', en: 'The big express engine.' } },
  { id: 'emily', name: 'Emily', number: '', color: '#00695c', description: { fr: 'La locomotive émeraude.', en: 'The emerald engine.' } },
];
