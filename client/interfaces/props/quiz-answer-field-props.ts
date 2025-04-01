export interface QuizAnswerFieldProps {
    questionType: string;
    index: number;
    onAnswerChange: (index: number, answer: string | number) => void;
    options: string[]; 
}
