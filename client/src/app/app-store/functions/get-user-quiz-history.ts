import { GeneratedQuizModel } from "@/libs/models";
import axios, { AxiosResponse } from "axios";

export const getUserQuizHistory = async (userId: string): Promise<GeneratedQuizModel[][] | undefined> => {
    let data: GeneratedQuizModel[][];

    try {
        const axiosOutput: AxiosResponse<any, any> =  await axios.get(`http://localhost:8000/get-user-quiz-history`, {
            responseType: 'json',
            params: {
                user_id: userId,
            }
        });
        ({ data } = axiosOutput);
        console.log('data', data);
        return data;
    } catch (error) {
        console.error({message: "Error retrieving user quiz history from server", userId, error: error});
    } 
}
