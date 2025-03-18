"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckButton,
  CheckQuizHistoryButton,
  DownloadQuiz,
  NewQuizButton,
  QuizAnswerField,
} from "../../components/home";

const QuizDisplayPage = () => {
  const searchParams = useSearchParams();
  const questionType = searchParams.get("questionType") || "multichoice";
  const numQuestions = Number(searchParams.get("numQuestions")) || 1;
  const userId = searchParams.get("userId") || "defaultUserId";

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
  const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
  const [quizReport, setQuizReport] = useState<any[]>([]);

  // Fetch quiz questions from the server
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const url = `http://localhost:8000/api/get-questions`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_type: questionType,
            num_questions: numQuestions,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz questions");
        }

        const data = await response.json();
        setQuizQuestions(data);
        setUserAnswers(Array(data.length).fill(""));
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuizQuestions();
  }, [questionType, numQuestions]);

  const handleAnswerChange = (index: number, answer: string | number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  // Updated checkAnswers function to convert binary answers for true-false questions
  const checkAnswers = async () => {
    try {
      const payload = quizQuestions.map((question, index) => {
        if (!question || !("answer" in question)) {
          throw new Error(
            `Missing answer for question: ${question?.question || "Unknown Question"}`
          );
        }
        return {
          question: question.question,
          user_answer: userAnswers[index].toString(),
          correct_answer: question.answer.toString(),
          question_type: question.question_type,
        };
      });

      const response = await fetch("http://localhost:8000/api/grade-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send payload as an array to match the expected Pydantic model.
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error grading quiz");
      }

      const gradedReport = await response.json();

      // Transform binary values for true-false questions into "true" or "false"
      const transformedReport = gradedReport.map((report: any) => {
        if (report.question_type === "true-false") {
          return {
            ...report,
            user_answer:
              report.user_answer === "1" || report.user_answer === 1 ? "true" : "false",
            correct_answer:
              report.correct_answer === "1" || report.correct_answer === 1 ? "true" : "false",
          };
        }
        return report;
      });

      setQuizReport(transformedReport);
      setIsQuizChecked(true);
    } catch (error) {
      console.error("Error grading quiz:", error);
    }
  };

  return (
    <div className="quiz-container">
      <div>
        <h1>{questionType} Quiz</h1>
        {quizQuestions.length === 0 ? (
          <p>Loading quiz questions...</p>
        ) : (
          <div className="quiz-questions">
            {quizQuestions.map((question, index) => (
              <div key={index} className="quiz-question">
                <h3>
                  {index + 1}. {question.question}
                </h3>
                <QuizAnswerField
                  questionType={question.question_type}
                  index={index}
                  onAnswerChange={handleAnswerChange}
                  options={question.options || []}
                />
              </div>
            ))}
          </div>
        )}

        <div className="quiz-actions">
          <CheckButton onClick={checkAnswers} />
          {isQuizChecked && <NewQuizButton />}
        </div>

        {isQuizChecked && (
          <div className="quiz-report">
            <h2>Quiz Results</h2>
            {quizReport.map((report, index) => (
              <div key={index} className={`result ${report.is_correct ? "correct" : "incorrect"}`}>
                <p>Question: {report.question}</p>
                <p>Your Answer: {report.user_answer}</p>
                <p>Correct Answer: {report.correct_answer}</p>
                {report.accuracy_percentage && (
                  <p>Accuracy: {parseFloat(report.accuracy_percentage).toFixed(2)}%</p>
                )}
                <p>Result: {report.result}</p>
              </div>
            ))}
          </div>
        )}
        <DownloadQuiz
          userId={userId}
          question_type={questionType}
          numQuestion={numQuestions}
        />
      </div>
      <div>
        <CheckQuizHistoryButton />
      </div>
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
