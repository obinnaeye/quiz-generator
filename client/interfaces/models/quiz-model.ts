import { Question } from "./quiz-question-model";

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  quiz_type: "multichoice" | "true-false" | "open-ended";
  questions: Question[];
}
