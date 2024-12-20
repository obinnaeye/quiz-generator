import { mockOpenEndedQuestions } from "../mocks";
import { gradeOpenEndedAnswer } from "./grade-open-ended-answer";

export function gradeSpecificQuestion(index: number, userAnswer: string): string {
  const { answer: correctAnswer } = mockOpenEndedQuestions[index];
  const keywords = correctAnswer.split(' ').filter(word => word.length > 3); 
  
  return gradeOpenEndedAnswer(userAnswer, correctAnswer, keywords);
}
