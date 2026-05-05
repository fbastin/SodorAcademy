import { Grade, Question } from "../types";
import { LOCAL_QUESTIONS } from "./localData";

export async function generateQuestion(subject: string, grade: Grade): Promise<Question> {
  // Return a random question from local data
  const subjectQuestions = LOCAL_QUESTIONS[subject]?.[grade] || [];
  
  if (subjectQuestions.length === 0) {
    throw new Error(`No questions found for ${subject} (${grade})`);
  }
  
  const randomIndex = Math.floor(Math.random() * subjectQuestions.length);
  
  // Simulate a small delay for a smoother UI transition
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return subjectQuestions[randomIndex];
}
