import axios from "axios";
import { GeneratedQuizModel } from "../../interfaces/models";

export const getUserQuizHistory = async (
  userId: string,
): Promise<GeneratedQuizModel[][] | undefined> => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/quiz-history/${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quiz history:", error);
    return undefined;
  }
};
