import { GeneratedQuizModel } from "@/libs/models";
import axios, { AxiosResponse } from "axios";

export const generateQuiz = async (userId: string, questionType: string, numQuestion: number) => {
    let data: {quiz_data: GeneratedQuizModel[]};

    try {
        const axiosOutput: AxiosResponse<any, any> =  await axios.get(`http://localhost:8000/generate-quiz`, {
            responseType: 'json',
            params: {
                user_id: userId,
                question_type: questionType,
                num_question: numQuestion,
            }
        });
        ({ data } = axiosOutput);

        return data.quiz_data;
    } catch (error) {
        console.error({message: "Error retrieving quiz questions from server", error: error});
    } 
}
