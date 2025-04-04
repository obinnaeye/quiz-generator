import { GeneratedQuizModel } from "../../interfaces/models";
import { QueryPattern } from "../../constants/patterns";
import axios, { AxiosResponse } from "axios";

export const getUserQuizHistory = async (
  userId: string,
): Promise<GeneratedQuizModel[][] | undefined> => {
  try {
    const { data }: AxiosResponse<any, any> = await axios.post(
      `http://localhost:8000/get-user-quiz-history`,
      {
        pattern: QueryPattern.GetUserQuizHistory,
        user_id: userId,
      },
      {
        responseType: "json",
      },
    );
    console.log("data", data);
    return data;
  } catch (error) {
    console.error({
      message: "Error retrieving user quiz history from server",
      userId,
      error: error,
    });
  }
};
