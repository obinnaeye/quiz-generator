"use client";

import { useState } from "react";
import GenerateButton from "./GenerateButton";
import QuizGenerationSection from "./QuizGenerationSection";
import { useRouter } from 'next/navigation';


export default function QuizForm() {
  // const [quizStatus, setQuizStatus] = useState("");
  const [profession,setProfession,] = useState("");
  const [numQuestions,setNumQuestions,] = useState(1);
  const [questionType,setQuestionType,] = useState("multichoice");
  const [difficultyLevel, setDifficultyLevel] = useState("easy")
  const [errorMessage, setErrorMessage] = useState(""); // For displaying validation error
  const router = useRouter()
  const userId = "userId"; //userId should be populated when a user logs in or something like that
    
  const handleGenerateQuiz = () => {
    // Check if all required fields are filled out
    if (!profession || !numQuestions || !questionType) {
      setErrorMessage("Please fill in the topic, select number of questions, and choose a quiz type.");
      return;
    }
    
    setErrorMessage("");
    const queryParams = new URLSearchParams({
      userId,
      questionType,
      numQuestions: numQuestions.toString(),
      profession,
    }).toString();

    // Call the FastAPI endpoint here and set quizStatus to "Quiz generated"
    // (Replace with actual API call)
    // setQuizStatus("Quiz generated");
    router.push(`/quiz_display?${queryParams}`);
  };


  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <QuizGenerationSection
        profession={profession}
        setProfession={setProfession}
        questionType={questionType}
        setQuestionType={setQuestionType}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        difficultyLevel={difficultyLevel}
        setDifficultyLevel={setDifficultyLevel}
      />
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <GenerateButton onClick={handleGenerateQuiz} />
    </form>
  );
}
