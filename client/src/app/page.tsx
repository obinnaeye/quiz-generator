"use client"; // Mark this component as a client component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation in the App Router

import SignUpModal from "./components/SignUpModel";
import SignInModal from "./components/SignInModal";

interface Question {
  question: string;
  answer: string;
}

export default function Home() {
  // the signup declaration
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  
  // end signup

  // the signin declaration
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  // Quiz form state
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", answer: "" },
  ]);
  const [quizStatus, setQuizStatus] = useState(""); // State to manage quiz status message
  const router = useRouter();

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index][name as keyof Question] = value;
    setQuestions(updatedQuestions);
  };

  const handleGenerateQuizClick = async () => {
    try {
      // Call the FastAPI endpoint
      const response = await fetch("http://localhost:8000/api/generate-quiz");
      const data = await response.json();

      if (response.ok) {
        // Display "quiz generated" message
        setQuizStatus("Quiz generated");
      } else {
        console.error("Error:", data);
        alert("Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error fetching the API:", error);
      alert("Error occurred while generating quiz");
    }

  };

  

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Generator</h1>
        <div className="flex items-end">
          {/* Sign Up Button */}
          <button
            onClick={openSignUpModal}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>

          {/* Sign In Button */}
          <button
            onClick={openSignInModal}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 ml-4"
          >
            Sign In
          </button>

          <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
          <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
        </div>
      </div>
      <div>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              name="question"
              placeholder="Enter question"
              value={q.question}
              onChange={(event) => handleInputChange(index, event)}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />
            {/* Output field to display quiz status */}
            <input
              type="text"
              value={quizStatus}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
        <button
          onClick={handleGenerateQuizClick}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
}
