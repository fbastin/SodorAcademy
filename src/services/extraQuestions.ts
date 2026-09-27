import { Grade, Question } from "../types";
import mathematics from "./questions/mathematics.json";
import english from "./questions/english.json";
import science from "./questions/science.json";
import geography from "./questions/geography.json";
import history from "./questions/history.json";
import music from "./questions/music.json";

type Bank = Record<Grade, Question[]>;

// Additional quiz questions, added to those in localData.ts.
export const EXTRA_QUESTIONS: Record<string, Bank> = {
  Mathematics: mathematics as Bank,
  English: english as Bank,
  Science: science as Bank,
  Geography: geography as Bank,
  History: history as Bank,
  Music: music as Bank,
};
