import { areKeywordsPresent } from "./are-key-words-present";
import { isAnswerSimilar } from "./is-answer-similar";

export const gradeOpenEndedAnswer = (userAnswer: string, correctAnswer: string, keywords: string[]): string => {
  if (isAnswerSimilar(userAnswer, correctAnswer)) {
    return "Correct (flexible match)!";
  } else if (areKeywordsPresent(userAnswer, keywords)) {
    return "Correct (keywords match)!";
  } else {
    return "Incorrect answer.";
  }
}
