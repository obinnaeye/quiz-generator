import axios, { AxiosResponse } from "axios";

export const getUserQuizHistory = async (userId: string) => {
    let data: any[];

    try {
        const axiosOutput: AxiosResponse<any, any> =  await axios.get(`http://localhost:8000/get-user-quiz-history`, {
            responseType: 'json',
            params: {
                user_id: userId,
            }
        });
        ({ data } = axiosOutput)
        console.log('this is the data out of axios in the client', data);
        return data;
    } catch (error) {
        console.error({message: "Error retrieving user quiz history from server", userId, error: error});
    } 
}
