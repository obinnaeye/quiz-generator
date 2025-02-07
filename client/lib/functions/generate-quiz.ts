import { GeneratedQuizModel } from "../../interfaces/models";
import axios, { AxiosResponse } from "axios";
import { QueryPattern } from "../../constants/patterns";

export const generateQuiz = async (
    userId: string,
    questionType?: string,
    numQuestion?: number,
    url?: string,
    uploadedFile?: string
): Promise<GeneratedQuizModel[] | undefined> => {
    let data: {quiz_data: GeneratedQuizModel[]};

    try {
        const axiosOutput: AxiosResponse<any, any> =  await axios.get(`http://localhost:8000/generate-quiz`, {
            responseType: 'json',
            params: {
                pattern: QueryPattern.GenerateQuiz,
                user_id: userId,
                question_type: questionType,
                num_question: numQuestion,
                url: url,
                uploaded_file: uploadedFile
            }
        });
        ({ data } = axiosOutput);

        return data.quiz_data;
    } catch (error) {
        console.error({message: "Error retrieving quiz questions from server", error: error});
    } 
}
