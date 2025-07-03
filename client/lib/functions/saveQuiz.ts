import axios from "axios";
import { GeneratedQuizModel } from "../../interfaces/models";

export const saveQuiz = async (
  userId: string,
  quizName: string,
  questionType: string,
  questions: GeneratedQuizModel[],
) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/save-quiz-entry`,
      {
        user_id: userId,
        quiz_name: quizName,
        question_type: questionType,
        questions,
        created_at: new Date().toISOString(),
      },
    );
  } catch (error) {
    console.error("Failed to save quiz:", error);
  }
};
