import { mockOpenEndedQuestions } from './MockOpenEndedQuestions';

const keywordThreshold = 6;

export function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function isAnswerSimilar(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
  const maxLength = Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length);

  const distance = levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
  const similarity = (1 - distance / maxLength) * 100;

  return similarity >= 60; 
}

export function areKeywordsPresent(userAnswer: string, keywords: string[]): boolean {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const matchedKeywords = keywords.filter(keyword => normalizedUserAnswer.includes(keyword.toLowerCase()));
  
  return matchedKeywords.length >= keywordThreshold; 
}

export function gradeSpecificQuestion(index: number, userAnswer: string): string {
  const { answer: correctAnswer } = mockOpenEndedQuestions[index];
  const keywords = correctAnswer.split(' ').filter(word => word.length > 3); 
  
  return gradeOpenEndedAnswer(userAnswer, correctAnswer, keywords);
}

export function gradeOpenEndedAnswer(userAnswer: string, correctAnswer: string, keywords: string[]): string {
  if (isAnswerSimilar(userAnswer, correctAnswer)) {
    return "Correct (flexible match)!";
  } else if (areKeywordsPresent(userAnswer, keywords)) {
    return "Correct (keywords match)!";
  } else {
    return "Incorrect answer.";
  }
}
