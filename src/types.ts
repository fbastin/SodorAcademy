import { LucideIcon, Train, BookOpen, Calculator, History, MapPin, Trophy, PlayCircle, Music } from 'lucide-react';

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

export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: 'quiz' | 'custom';
  component?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  station?: string;
  x?: number; // percentage on map
  y?: number; // percentage on map
  exercises?: Exercise[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  rewardType: 'badge' | 'engine' | 'coin' | 'video';
}

export interface UserStats {
  score: number;
  completedLessons: number;
  enginesCollected: string[];
  videosUnlocked: string[];
  currentGrade: Grade;
  fractionExercisesCompleted?: string[];
  completedStories?: string[];
}

export interface Video {
  id: string;
  title: string;
  filename: string;
  thumbnail: string;
  description: string;
}

export const VIDEOS: Video[] = [
  {
    id: 'welcome',
    title: 'Welcome to Sodor!',
    filename: 'Thomas_and_Sir_Topham_Hatt_wel.mp4',
    thumbnail: '🚂',
    description: 'Sir Topham Hatt welcomes you to the Academy.'
  },
  {
    id: 'steam-power',
    title: 'Steam Power Secrets',
    filename: 'Steam_Power_Secrets.mp4',
    thumbnail: '💨',
    description: 'Learn how steam makes the engines move.'
  },
  {
    id: 'knapford-busy',
    title: 'Busy Day at Knapford',
    filename: 'Knapford_Busy_Day.mp4',
    thumbnail: '🚉',
    description: 'Watch Thomas handle the express!'
  },
  {
    id: 'thomas-sharing',
    title: 'Thomas Likes to Share',
    filename: 'Thomas_is_using_is_whistle_to.mp4',
    thumbnail: '🍎',
    description: 'Thomas learns the importance of sharing with his friends.'
  }
];

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: Calculator,
    color: 'bg-blue-600',
    description: 'Calculate coal loads and track distances.',
    station: 'Knapford Station',
    x: 24,
    y: 65,
    exercises: [
      { id: 'math-quiz', name: 'Knapford Quiz', description: 'Test your general math skills!', type: 'quiz' },
      { id: 'math-fractions-mult', name: 'Fraction Multiplication', description: 'Help Thomas multiply fractions!', type: 'custom', component: 'FractionMultiplication' },
      { id: 'math-fractions-add', name: 'Fraction Addition', description: 'Help Percy add fraction loads!', type: 'custom', component: 'FractionAddition' }
    ]
  },
  {
    id: 'english',
    name: 'English',
    icon: BookOpen,
    color: 'bg-red-600',
    description: 'Master spelling and station announcements.',
    station: 'Tidmouth Sheds',
    x: 14,
    y: 45,
    exercises: [
      { id: 'eng-stories', name: 'Story Adventure', description: 'Read a story and answer questions!', type: 'custom', component: 'StoryExercise' }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: Train,
    color: 'bg-green-600',
    description: 'Learn how steam and engines work.',
    station: 'Vicarstown',
    x: 91,
    y: 40,
    exercises: [
      { id: 'sci-quiz', name: 'Vicarstown Quiz', description: 'Discover the science of steam power!', type: 'quiz' }
    ]
  },
  {
    id: 'history',
    name: 'History',
    icon: History,
    color: 'bg-purple-600',
    description: 'Discover the heritage of Sodor.',
    station: 'Wellsworth',
    x: 44,
    y: 72,
    exercises: [
      { id: 'his-quiz', name: 'Wellsworth Quiz', description: 'Explore the history of the railway!', type: 'quiz' }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: MapPin,
    color: 'bg-orange-600',
    description: 'Navigate the tracks and hills.',
    station: 'Peel Godred',
    x: 52,
    y: 28,
    exercises: [
      { id: 'geo-quiz', name: 'Peel Godred Quiz', description: 'Master the map of Sodor!', type: 'quiz' }
    ]
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    color: 'bg-pink-600',
    description: 'Listen to the whistles and bells.',
    station: "Crovan's Gate",
    x: 72,
    y: 48,
    exercises: [
      { id: 'mus-quiz', name: "Crovan's Gate Quiz", description: 'Identify the sounds of the engines!', type: 'quiz' }
    ]
  }
];

export const ENGINES = [
  { id: 'thomas', name: 'Thomas', color: '#1E40AF', description: 'The Number 1 Blue Engine.' },
  { id: 'percy', name: 'Percy', color: '#166534', description: 'The Green Post Train.' },
  { id: 'james', name: 'James', color: '#991B1B', description: 'The Splendid Red Engine.' },
  { id: 'gordon', name: 'Gordon', color: '#1E3A8A', description: 'The Big Express Engine.' },
  { id: 'emily', name: 'Emily', color: '#065F46', description: 'The Emerald Engine.' }
];
