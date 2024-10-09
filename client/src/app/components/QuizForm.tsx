// src/app/components/QuizForm.tsx

import { useState } from "react";
import QuizDisplayField from "./QuizDisplayField";
import QuizStatus from "./QuizStatus";
import GenerateButton from "./GenerateButton";

export default function QuizForm() {
  const [question, setQuestion] = useState("");
  const [quizStatus, setQuizStatus] = useState("");


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleGenerateQuiz = async () => {
    // Call the FastAPI endpoint here and set quizStatus to "Quiz generated"
    // (Replace with actual API call)
    setQuizStatus("Quiz generated");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <QuizDisplayField question={question} onChange={handleInputChange} />
      <QuizStatus status={quizStatus} />
      <GenerateButton onClick={handleGenerateQuiz} />
    </form>
  );
}
