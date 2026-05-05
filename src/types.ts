import { LucideIcon, Train, BookOpen, Calculator, History, MapPin, Trophy, PlayCircle } from 'lucide-react';

export type Grade = 'Primary' | 'Secondary';

export interface Subject {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
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
  }
];

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Number Lines',
    icon: Calculator,
    color: 'bg-blue-500',
    description: 'Calculate coal loads and track distances.'
  },
  {
    id: 'english',
    name: 'Station Names',
    icon: BookOpen,
    color: 'bg-red-500',
    description: 'Master spelling and station announcements.'
  },
  {
    id: 'science',
    name: 'Steam Power',
    icon: Train,
    color: 'bg-green-500',
    description: 'Learn how engines and geography work together.'
  },
  {
    id: 'geography',
    name: 'Isle Map',
    icon: MapPin,
    color: 'bg-orange-500',
    description: 'Navigate the tracks of Sodor.'
  }
];

export const ENGINES = [
  { id: 'thomas', name: 'Thomas', color: '#1E40AF', description: 'The Number 1 Blue Engine.' },
  { id: 'percy', name: 'Percy', color: '#166534', description: 'The Green Post Train.' },
  { id: 'james', name: 'James', color: '#991B1B', description: 'The Splendid Red Engine.' },
  { id: 'gordon', name: 'Gordon', color: '#1E3A8A', description: 'The Big Express Engine.' },
  { id: 'emily', name: 'Emily', color: '#065F46', description: 'The Emerald Engine.' }
];
