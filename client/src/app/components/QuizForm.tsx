"use client";

import { useState } from "react";
import GenerateButton from "./GenerateButton";
import QuizGenerationSection from "./QuizGenerationSection";
import { useRouter } from 'next/navigation';


export default function QuizForm() {
  const [question, setQuestion] = useState("");
  const [quizStatus, setQuizStatus] = useState("");
  
  
  const [profession,setProfession,] = useState("");
  const [numQuestions,setNumQuestions,] = useState(1);
  const [questionType,setQuestionType,] = useState("multichoice");
  const [difficultyLevel, setDifficultyLevel] = useState("easy")
  const [errorMessage, setErrorMessage] = useState(""); // For displaying validation error
  const router = useRouter()
  
    const handleGenerateQuiz = async () => {
  // Check if all required fields are filled out
  if (!profession || !numQuestions || !questionType) {
    setErrorMessage("Please fill in the topic, select number of questions, and choose a quiz type.");
    return;
  }

  console.log({ profession, numQuestions, questionType, difficultyLevel });

  setErrorMessage("");
  setQuizStatus("Generating quiz...");

  try {
    // Replace 'http://localhost:8000' with your FastAPI backend URL
    const response = await fetch("http://localhost:8000/api/get-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profession,
        num_questions: numQuestions,
        question_type: questionType,
        difficulty_level: difficultyLevel,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate quiz");
    }

    const data = await response.json();
    console.log("Quiz data:", data);

    // Redirect to quiz display page with received data
    const queryParams = new URLSearchParams({
      questionType,
      numQuestions: numQuestions.toString(),
      profession,
    }).toString();

    setQuizStatus("Quiz generated successfully!");
    router.push(`/quiz_display?${queryParams}`);
  } catch (error) {
    console.error("Error:", error);
    setErrorMessage("Failed to generate quiz. Please try again.");
  }
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
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Error message display */}
      <GenerateButton onClick={handleGenerateQuiz} /> {/* Pass function to the button */}
    </form>
  );
}
