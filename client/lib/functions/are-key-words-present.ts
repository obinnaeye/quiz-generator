const keywordThreshold = 6;
export const areKeywordsPresent = (userAnswer: string, keywords: string[]): boolean => {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const matchedKeywords = keywords.filter(keyword => normalizedUserAnswer.includes(keyword.toLowerCase()));
  
  return matchedKeywords.length >= keywordThreshold; 
}
