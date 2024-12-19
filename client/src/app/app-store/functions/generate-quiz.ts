import axios, { AxiosResponse } from "axios";

export const generateQuiz = async (questionType: string, numQuestion: number) => {
    let data: {quiz_data: any[]};

    try {
        const axiosOutput: AxiosResponse<any, any> =  await axios.get(`http://localhost:8000/generate-quiz`, {
            responseType: 'json',
            params: {
              question_type: questionType,
              num_question: numQuestion,
            }
        });
        ({ data } = axiosOutput)
        console.log('this is the data out of axios', data);
        return data.quiz_data;
    } catch (error) {
        console.error({message: "Error retrieving data from server", error: error});
    } 
}
