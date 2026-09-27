import { Grade, Question } from "../types";
import { LOCAL_QUESTIONS } from "./localData";
import { EXTRA_QUESTIONS } from "./extraQuestions";

// Questions a child has already seen, per subject and grade, so that a quiz
// only repeats one once the whole bank has been gone through.
const seenKey = (subject: string, grade: Grade) => `sodor_academy_seen_${subject}_${grade}`;

function readSeen(subject: string, grade: Grade): string[] {
  try {
    const raw = localStorage.getItem(seenKey(subject, grade));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSeen(subject: string, grade: Grade, ids: string[]) {
  try {
    localStorage.setItem(seenKey(subject, grade), JSON.stringify(ids));
  } catch {
    // Storage unavailable: questions may repeat sooner, nothing else breaks.
  }
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function questionBank(subject: string, grade: Grade): Question[] {
  return [
    ...(LOCAL_QUESTIONS[subject]?.[grade] || []),
    ...(EXTRA_QUESTIONS[subject]?.[grade] || []),
  ];
}

export async function generateQuestion(subject: string, grade: Grade, excludeIds: string[] = []): Promise<Question> {
  const subjectQuestions = questionBank(subject, grade);

  if (subjectQuestions.length === 0) {
    throw new Error(`No questions found for ${subject} (${grade})`);
  }

  // Never repeat within the current quiz; prefer questions not seen in earlier quizzes.
  let seen = readSeen(subject, grade);
  let availableQuestions = subjectQuestions.filter(q => !excludeIds.includes(q.id) && !seen.includes(q.id));
  if (availableQuestions.length === 0) {
    seen = [];
    availableQuestions = subjectQuestions.filter(q => !excludeIds.includes(q.id));
  }
  if (availableQuestions.length === 0) {
    availableQuestions = subjectQuestions;
  }

  const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  writeSeen(subject, grade, [...seen, question.id]);

  // Simulate a small delay for a smoother UI transition
  await new Promise(resolve => setTimeout(resolve, 400));

  // The banks mostly list the right answer first: shuffle so position gives nothing away.
  return { ...question, options: shuffle(question.options) };
}
