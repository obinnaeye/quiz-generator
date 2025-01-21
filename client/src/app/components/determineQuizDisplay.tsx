import { useEffect, useState } from 'react';
import { mockMultipleChoiceQuestions } from './MockMultipleChoiceQuestions';
import { mockTrueFalseQuestions } from './MockTrueFalseQuestions';
import { mockOpenEndedQuestions } from './MockOpenEndedQuestions';

function shuffleArray<T>(array: T[]): T[] {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export function determineQuizDisplay(questionType: string, numQuestions: number) {
    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

    useEffect(() => {
        let questions: any[] = [];

        if (questionType === 'multichoice') {
            questions = shuffleArray(mockMultipleChoiceQuestions);
            questions = questions.map(question => ({
                ...question,
                options: shuffleArray([...question.options]), 
            }));
        } else if (questionType === 'true-false') {
            questions = shuffleArray(mockTrueFalseQuestions);
            questions = questions.map(question => ({
                ...question,
                options: shuffleArray([...question.options]), 
            }));
        } else if (questionType === 'open-ended') {
            questions = shuffleArray(mockOpenEndedQuestions);
        }
        setShuffledQuestions(questions.slice(0, numQuestions));
    }, [questionType, numQuestions]);

    return shuffledQuestions;
}
