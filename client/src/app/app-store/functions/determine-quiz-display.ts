import { generateQuiz } from "./generate-quiz";
import { shuffleArray } from "./shuffle-array";

export  const determineQuizDisplay = async (userId: string, questionType: string, numQuestions: number) => {
    let shuffledQuestions: any[];
    const  quizQuestions = await generateQuiz(userId, questionType, numQuestions);
        let questions: any[];
        questions = shuffleArray(quizQuestions);
        if(questionType != "open-ended"){
            questions = questions.map(question => ({
                ...question,
                options: shuffleArray([...question.options]), 
            }));
        }
        shuffledQuestions = questions.slice(0, numQuestions);
    return shuffledQuestions;
}
