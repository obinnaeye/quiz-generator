"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  CheckButton,
  NewQuizButton,
  QuizAnswerField,
  DownloadQuizButton,
  NavBar,
  Footer,
} from "../../components/home";
import { saveQuizToHistory } from "../../lib/functions/saveQuizToHistory";
import { saveQuiz } from "../../lib/functions/saveQuiz";

const QuizDisplayPage: React.FC = () => {
  const searchParams = useSearchParams();
  const questionType = searchParams.get("questionType") || "multichoice";
  const numQuestions = Number(searchParams.get("numQuestions")) || 1;
  const userId = searchParams.get("userId") || "defaultUserId";

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
  const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
  const [quizReport, setQuizReport] = useState<any[]>([]);
  const [quizName, setQuizName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [showSaveInput, setShowSaveInput] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-questions`,
          {
            question_type: questionType,
            num_questions: numQuestions,
          },
        );
        setQuizQuestions(data);
        setUserAnswers(Array(data.length).fill(""));
        await saveQuizToHistory(userId, questionType, data);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };
    fetchQuizQuestions();
  }, [questionType, numQuestions]);

  const handleAnswerChange = (index: number, answer: string | number) => {
    const updated = [...userAnswers];
    updated[index] = answer;
    setUserAnswers(updated);
  };

  const checkAnswers = async () => {
    try {
      const payload = quizQuestions.map((q, i) => {
        const correct = q.answer ?? q.correct_answer;
        if (correct === undefined)
          throw new Error(`No answer for ${q.question}`);
        return {
          question: q.question,
          user_answer: userAnswers[i].toString(),
          correct_answer: correct.toString(),
          question_type: q.question_type,
        };
      });
      const { data: report } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/grade-answers`,
        payload,
      );
      const transformed = report.map((r: any) =>
        r.question_type === "true-false"
          ? {
              ...r,
              user_answer: r.user_answer == 1 ? "true" : "false",
              correct_answer: r.correct_answer == 1 ? "true" : "false",
            }
          : r,
      );
      setQuizReport(transformed);
      setIsQuizChecked(true);
    } catch (err) {
      console.error("Error checking answers:", err);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizName.trim()) {
      setSaveMessage("Please enter a quiz name.");
      return;
    }
    setIsSaving(true);
    try {
      await saveQuiz(userId, quizName, questionType, quizQuestions);
      setSaveMessage("Quiz saved successfully.");
      setQuizName("");
      setShowSaveInput(false);
    } catch (err) {
      setSaveMessage("Failed to save quiz.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-1 flex justify-center px-4 sm:px-6 md:px-8 py-8">
        <div className="w-full max-w-4xl space-y-10">
          <section className="bg-white shadow rounded-xl px-4 sm:px-6 py-6 sm:py-8 border border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2654] mb-6">
              {`${questionType.charAt(0).toUpperCase() + questionType.slice(1)} Quiz`}
            </h1>

            <div className="space-y-6">
              {quizQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 rounded-md border border-gray-200"
                >
                  <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                    {i + 1}. {q.question}
                  </h3>
                  <QuizAnswerField
                    questionType={q.question_type}
                    index={i}
                    onAnswerChange={handleAnswerChange}
                    options={q.options || []}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <CheckButton onClick={checkAnswers} />
              <DownloadQuizButton
                userId={userId}
                question_type={questionType}
                numQuestion={numQuestions}
              />
              {isQuizChecked && <NewQuizButton />}
            </div>
          </section>

          {isQuizChecked && (
            <section className="bg-white shadow rounded-xl px-4 sm:px-6 py-6 sm:py-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F2654] mb-4">
                My Quiz Result
              </h2>

              <div className="space-y-4">
                {quizReport.map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-md border text-sm ${
                      r.is_correct
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p>
                      <strong>Question:</strong> {r.question}
                    </p>
                    <p>
                      <strong>Your Answer:</strong> {r.user_answer}
                    </p>
                    <p>
                      <strong>Correct:</strong> {r.correct_answer}
                    </p>
                    {r.accuracy_percentage && (
                      <p>
                        <strong>Accuracy:</strong>{" "}
                        {parseFloat(r.accuracy_percentage).toFixed(2)}%
                      </p>
                    )}
                    <p>
                      <strong>Result:</strong> {r.result}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                {showSaveInput ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 w-full">
                    <input
                      type="text"
                      placeholder="Enter quiz name"
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                      onClick={handleSaveQuiz}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md"
                    >
                      {isSaving ? "Saving..." : "Save Quiz"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSaveInput(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md"
                  >
                    Save Quiz
                  </button>
                )}
                {saveMessage && (
                  <p className="text-sm text-gray-600 mt-2">{saveMessage}</p>
                )}
                <NewQuizButton />
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function DisplayQuiz() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizDisplayPage />
    </Suspense>
  );
}
