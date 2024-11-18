"use client";

import { useState } from "react";
import GenerateButton from "./GenerateButton";
import QuizGenerationSection from "./QuizGenerationSection";
import { useRouter } from "next/navigation";

export default function QuizForm() {
  const router = useRouter();
  const [profession, setProfession] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questionType, setQuestionType] = useState("multichoice");
  const [errorMessage, setErrorMessage] = useState(""); // For displaying validation error

    const handleGenerateQuiz = () => {
    // Check if all required fields are filled out
    if (!profession || !numQuestions || !questionType) {
      setErrorMessage("Please fill in the topic, select number of questions, and choose a quiz type.");
      return;
    }

    setErrorMessage("");
    const queryParams = new URLSearchParams({
      questionType,
      numQuestions: numQuestions.toString(),
      profession,
    }).toString();

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
      />
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Error message display */}
      <GenerateButton onClick={handleGenerateQuiz} /> {/* Pass function to the button */}
    </form>
  );
}
