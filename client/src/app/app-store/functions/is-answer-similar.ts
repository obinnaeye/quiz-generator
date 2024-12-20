import { levenshteinDistance } from './levenshtein-distance';

export const isAnswerSimilar= (userAnswer: string, correctAnswer: string): boolean => {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
  const maxLength = Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length);
  const distance = levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
  const similarity = (1 - distance / maxLength) * 100;

  return similarity >= 60; 
}
