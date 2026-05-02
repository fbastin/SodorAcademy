import { LucideIcon, Train, BookOpen, Calculator, History, MapPin, Trophy } from 'lucide-react';

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
  rewardType: 'badge' | 'engine' | 'coin';
}

export interface UserStats {
  score: number;
  completedLessons: number;
  enginesCollected: string[];
  currentGrade: Grade;
}

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
