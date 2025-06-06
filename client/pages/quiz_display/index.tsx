// client/pages/quiz_display/index.tsx
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

const QuizDisplayPage: React.FC = () => {
  const searchParams = useSearchParams();
  const questionType = searchParams.get("questionType") || "multichoice";
  const numQuestions = Number(searchParams.get("numQuestions")) || 1;
  const userId = searchParams.get("userId") || "defaultUserId";

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
  const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
  const [quizReport, setQuizReport] = useState<any[]>([]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-1 flex justify-center px-4 py-8">
        {/* Centered Quiz Card */}
        <div className="w-full max-w-3xl space-y-8">
          {/* Quiz Questions Card */}
          <section className="bg-white shadow rounded-xl px-6 py-8 border border-gray-200">
            <h1 className="text-2xl font-bold text-[#0F2654] mb-6">
              {`${questionType.charAt(0).toUpperCase() + questionType.slice(1)} Quiz`}
            </h1>

            {/* Questions */}
            <div className="space-y-6">
              {quizQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 rounded-md border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
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

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
              <CheckButton onClick={checkAnswers} />
              <DownloadQuizButton
                userId={userId}
                question_type={questionType}
                numQuestion={numQuestions}
              />
              {isQuizChecked && <NewQuizButton />}
            </div>
          </section>

          {/* Quiz Results Card */}
          {isQuizChecked && (
            <section className="bg-white shadow rounded-xl px-6 py-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0F2654] mb-4">
                My Quiz Result
              </h2>
              <div className="space-y-4">
                {quizReport.map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-md border ${
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

              {/* Upgrade & New Quiz */}
              <div className="mt-6 flex space-x-4">
                <button className="bg-[#0a3264] hover:bg-[#082952] text-white font-semibold px-4 py-2 rounded-xl shadow-md transition text-sm">
                  Upgrade Plan to Save your Quiz
                </button>
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
