export interface QuizGenerationSectionProps {
    profession: string;
    setProfession: (value: string) => void;
    numQuestions: number;
    setNumQuestions: (value: number) => void;
    questionType: string;
    setQuestionType: (value: string) => void;
    difficultyLevel: string;
    setDifficultyLevel: (value: string) => void;
}
