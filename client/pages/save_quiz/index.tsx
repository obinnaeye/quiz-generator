"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import NavBar from "../../components/home/NavBar";
import Footer from "../../components/home/Footer";

const SavedQuizzesPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "defaultUserId";
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSavedQuizzes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/saved-quizzes/${userId}`,
        );
        setSavedQuizzes(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load saved quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedQuizzes();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2654]">
            Saved Quizzes
          </h1>

          {loading ? (
            <p className="text-gray-600">Loading saved quizzes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : savedQuizzes.length === 0 ? (
            <p className="text-center text-gray-600">No saved quizzes found.</p>
          ) : (
            savedQuizzes.map((quiz, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-[#0F2654]">
                  {quiz.quiz_name} ({quiz.question_type})
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Saved on: {new Date(quiz.created_at).toLocaleString()}
                </p>
                {quiz.questions.map((q: any, i: number) => (
                  <div key={i} className="mb-4">
                    <h3 className="text-base font-medium text-gray-800">
                      {i + 1}. {q.question}
                    </h3>
                    {q.options && (
                      <ul className="ml-5 list-disc text-sm text-gray-700">
                        {q.options.map((opt: string, j: number) => (
                          <li key={j}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-sm mt-1">
                      <strong>Answer:</strong> {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function SavedQuizzesWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
      <SavedQuizzesPage />
    </Suspense>
  );
}
