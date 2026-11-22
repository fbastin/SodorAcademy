import React from 'react';
import { Grade, MusicScore } from '../types';
import { useLang } from '../i18n';
import { Station, Activity } from '../content/stations';
import FractionMultiplication from '../components/FractionMultiplication';
import FractionAddition from '../components/FractionAddition';
import SimpleFractionAddition from '../components/SimpleFractionAddition';
import FractionIntegerAddition from '../components/FractionIntegerAddition';
import FractionAdditionLesson from '../components/FractionAdditionLesson';
import PrismsLesson from '../components/PrismsLesson';
import LCMLesson from '../components/LCMLesson';
import LCMExercise from '../components/LCMExercise';
import StoryExercise from '../components/StoryExercise';
import ForceLesson from '../components/ForceLesson';
import ContinentsLesson from '../components/ContinentsLesson';
import ContinentsExercise from '../components/ContinentsExercise';
import ArithmeticMeanLesson from '../components/ArithmeticMeanLesson';
import ArithmeticMeanExercise from '../components/ArithmeticMeanExercise';
import ArithmeticMeanMastery from '../components/ArithmeticMeanMastery';
import ArithmeticMeanWordProblems from '../components/ArithmeticMeanWordProblems';
import Piano from '../components/Piano';
import PianoSequence from '../components/PianoSequence';
import SoundWavesLesson from '../components/SoundWavesLesson';
import { ElectricityLesson, MagnetsLesson, GearsLesson, SolarSystemLesson, AcidsBasesLesson } from '../lessons/ScienceLessons';
import { TimesTablesLesson, DivisionLesson } from '../lessons/MathsLessons';
import { EarthLesson, FirstProgramLesson } from '../lessons/MoreLessons';
import { ReadingNotesLesson, RhythmLesson, IntervalsScalesLesson, ChordsLesson } from '../lessons/MusicLessons';

// The exercises: each one counts right answers up to the station's quiz length.
const EXERCISES: Record<string, React.ComponentType<any>> = {
  FractionMultiplication, FractionAddition, SimpleFractionAddition, FractionIntegerAddition,
  ArithmeticMeanExercise, ArithmeticMeanMastery, ArithmeticMeanWordProblems, LCMExercise,
  ContinentsExercise, PianoSequence,
};

// The lessons: steps to read, then the exercise they lead to.
const LESSONS: Record<string, React.ComponentType<any>> = {
  ArithmeticMeanLesson, FractionAdditionLesson, LCMLesson, PrismsLesson, ForceLesson,
  ContinentsLesson, SoundWavesLesson,
  ElectricityLesson, MagnetsLesson, GearsLesson, SolarSystemLesson, AcidsBasesLesson,
  TimesTablesLesson, DivisionLesson, EarthLesson, FirstProgramLesson,
  ReadingNotesLesson, RhythmLesson, IntervalsScalesLesson, ChordsLesson,
};

export default function ActivityView({ station, activity, grade, questionsCount, completedStories, score, onComplete, onBack, onNext }: {
  station: Station;
  activity: Activity;
  grade: Grade;
  questionsCount: number;
  completedStories: string[];
  score?: MusicScore | null;
  onComplete: (reward: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { tr } = useLang();
  const c = activity.component;
  if (!c) return null;
  // Every lesson and exercise gets the colour and the name of its station.
  const look = { color: station.color, place: tr(station.place) };

  if (c === 'StoryExercise') {
    return <StoryExercise {...look} grade={grade} completedStories={completedStories} questionsCount={questionsCount} onComplete={onComplete} onCancel={onBack} />;
  }
  if (c === 'Piano') {
    return <Piano autoPlayScore={score ?? null} onCancel={onBack} />;
  }
  const Lesson = LESSONS[c];
  if (Lesson) {
    return <Lesson {...look} onCancel={onBack} onStartExercise={activity.next ? onNext : undefined} />;
  }
  const Exercise = EXERCISES[c];
  if (Exercise) {
    return <Exercise {...look} grade={grade} questionsCount={questionsCount} onComplete={onComplete} onCancel={onBack} />;
  }
  return null;
}
