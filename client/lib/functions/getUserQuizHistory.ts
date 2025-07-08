import axios from "axios";
import { GeneratedQuizModel } from "../../interfaces/models";

export const getUserQuizHistory = async (
  userId: string,
): Promise<GeneratedQuizModel[] | undefined> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quiz-history/${userId}`,
    );
    console.log("Quiz history response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quiz history:", error);
    return undefined;
  }
};
