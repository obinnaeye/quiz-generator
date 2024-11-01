// src/app/components/QuizForm.tsx

import { useState } from "react";
import QuizDisplayField from "./QuizDisplayField";
import QuizStatus from "./QuizStatus";
import GenerateButton from "./GenerateButton";
import QuizGenerationSection from "./QuizGenerationSection";

export default function QuizForm() {
  const [question, setQuestion] = useState("");
  const [quizStatus, setQuizStatus] = useState("");

  //
  const [profession,setProfession,] = useState("");
  const [numQuestions,setNumQuestions,] = useState(1);
  const [questionType,setQuestionType,] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("")



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleGenerateQuiz = async () => {
    // Call the FastAPI endpoint here and set quizStatus to "Quiz generated"
    // (Replace with actual API call)
    console.log({ profession, numQuestions, questionType , difficultyLevel});
    setQuizStatus("Quiz generated");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* <QuizDisplayField question={question} onChange={handleInputChange} /> */}
      {/* <QuizGenerationForm /> */}
      <QuizGenerationSection profession={profession} setProfession={setProfession} questionType={questionType} setQuestionType={setQuestionType} numQuestions={numQuestions} setNumQuestions={setNumQuestions} difficultyLevel={difficultyLevel} setDifficultyLevel={setDifficultyLevel} />
      <QuizStatus status={quizStatus} />
      <GenerateButton onClick={handleGenerateQuiz} />
    </form>
  );
}
