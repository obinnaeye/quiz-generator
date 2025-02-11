import { GeneratedQuizModel } from "../../interfaces/models";
import { generateQuiz } from "./generate-quiz";
import { shuffleArray } from "./shuffle-array";

export  const determineQuizDisplay = async (userId: string, questionType: string, numQuestions: number): Promise<GeneratedQuizModel[]> => {
    let shuffledQuestions: GeneratedQuizModel[];
    const quizQuestions: GeneratedQuizModel[] | undefined = await generateQuiz(userId, questionType, numQuestions);
        let questions: any[];
        questions = shuffleArray(quizQuestions);
        if(questionType != "open-ended"){
            questions = questions.map(question => {
                if(question.options){
                    return {
                        ...question,
                        options: shuffleArray([...question.options]), 
                    };
                } else {
                    return question;
                }
            });
        }
        shuffledQuestions = questions.slice(0, numQuestions);
        
    return shuffledQuestions;
}
