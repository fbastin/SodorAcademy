import { GoogleGenAI, Type } from "@google/genai";
import { Grade, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestion(subject: string, grade: Grade): Promise<Question> {
  const prompt = `Generate a child-friendly educational question for a ${grade} level student about the subject "${subject}". 
  The question should be themed around the Thomas the Tank Engine universe (Isle of Sodor, trains, engines like Thomas, Percy, James, station master Topham Hatt, coal, tracks, etc.).
  
  Provide exactly one question in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          rewardType: { 
            type: Type.STRING,
            enum: ['badge', 'engine', 'coin']
          }
        },
        required: ["id", "text", "options", "correctAnswer", "explanation", "rewardType"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
