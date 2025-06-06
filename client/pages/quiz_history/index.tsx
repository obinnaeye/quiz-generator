"use client";

import React, { Suspense, useEffect, useState } from "react";
import { getUserQuizHistory } from "../../lib/getUserQuizHistory";
import { useSearchParams } from "next/navigation";
import { GeneratedQuizModel } from "../../interfaces/models";
import { DisplayQuizHistoryPageProps } from "../../interfaces/props";
import NavBar from "../../components/home/NavBar";
import Footer from "../../components/home/Footer";

const determineQuizHistoryDisplay = async (userId: string) => {
  const quizHistory: GeneratedQuizModel[][] | undefined =
    await getUserQuizHistory(userId);
  if (quizHistory != undefined) {
    const rearrangedHistory = quizHistory.map((quiz, quizIndex) => {
      const quizNumber = quizIndex + 1;

      const listedQuizQuestions = quiz.map((quizQuestion, qIndex) => {
        let optionsList: JSX.Element | null = null;
        if (quizQuestion.options) {
          optionsList = (
            <ul className="ml-4 list-disc list-inside text-sm text-gray-700">
              {quizQuestion.options.map((option, optIdx) => (
                <li key={optIdx} className="py-0.5">
                  {option}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={qIndex} className="mb-4">
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
              {qIndex + 1}. {quizQuestion.question}
            </h3>
            {optionsList}
            <p className="mt-1 text-sm text-[#0F2654]">
              <strong>Answer:</strong> {quizQuestion.answer}
            </p>
          </div>
        );
      });

      return (
        <div key={quizIndex}>
          <hr className="border-gray-300 my-4" />
          <h2 className="text-lg sm:text-xl font-bold text-[#0F2654] mb-3">
            Quiz #{quizNumber}
          </h2>
          <div>{listedQuizQuestions}</div>
        </div>
      );
    });

    return rearrangedHistory;
  } else {
    return [];
  }
};

const DisplayQuizHistoryPage: React.FC<DisplayQuizHistoryPageProps> = ({
  quizHistory,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2654]">
            Quiz History
          </h1>

          {quizHistory.length === 0 ? (
            <p className="text-center text-gray-600">
              No quiz history available.
            </p>
          ) : (
            quizHistory.map((quizElement, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
              >
                {quizElement}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function DisplayQuizHistory() {
  const searchParams = useSearchParams();
  const [quizHistory, setQuizHistory] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const userId = searchParams.get("userId") || "fakeId";

    const fetchQuizHistory = async () => {
      try {
        const history = await determineQuizHistoryDisplay(userId);
        setQuizHistory(history);
      } catch (error) {
        console.error({
          message: "Error fetching quiz history",
          error,
          userId,
        });
      }
    };

    fetchQuizHistory();
  }, [searchParams]);

  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading quiz history...</div>}
    >
      <DisplayQuizHistoryPage quizHistory={quizHistory} />
    </Suspense>
  );
}
