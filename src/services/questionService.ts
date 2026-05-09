import { Grade, Question } from "../types";
import { LOCAL_QUESTIONS } from "./localData";

export async function generateQuestion(subject: string, grade: Grade, excludeIds: string[] = []): Promise<Question> {
  // Return a random question from local data
  const subjectQuestions = LOCAL_QUESTIONS[subject]?.[grade] || [];
  
  if (subjectQuestions.length === 0) {
    throw new Error(`No questions found for ${subject} (${grade})`);
  }

  // Filter out already used questions
  let availableQuestions = subjectQuestions.filter(q => !excludeIds.includes(q.id));
  
  // If all questions have been used, reset the pool (optional, but good for very long quizzes)
  if (availableQuestions.length === 0) {
    availableQuestions = subjectQuestions;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  
  // Simulate a small delay for a smoother UI transition
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return availableQuestions[randomIndex];
}
