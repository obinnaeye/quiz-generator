import axios from "axios";
import { GeneratedQuizModel } from "../../interfaces/models";

export const saveQuizToHistory = async (
  userId: string,
  questionType: string,
  questions: GeneratedQuizModel[],
) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/save-quiz`, {
      user_id: userId,
      question_type: questionType,
      questions,
      created_at: new Date().toISOString(), // 👈 Important to match backend model
    });
  } catch (error) {
    console.error("Failed to save quiz history:", error);
  }
};
