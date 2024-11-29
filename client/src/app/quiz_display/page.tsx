"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import DownloadQuiz from "../components/DownloadQuiz";

function QuizContent() {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const questionType = searchParams.get('questionType') || "multichoice";
  const numQuestions = Number(searchParams.get('numQuestions')) || 1;
  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await axios.get(
          `http://localhost:8000/generate-quiz?question_type=${questionType}&numQuestion=${Number(numQuestions)}`
        );
        setQuizData(response.data.quiz_data);
      } catch (err: any) {
        setError("Failed to fetch quiz data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [questionType]);

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const renderQuestion = (question: any, index: number) => {
    if (questionType === "true-false") {
      return (
        <div key={index} className="mb-4">
          <div className="font-semibold">{question.question}</div>
          <div className="mt-2">
            {question.options?.map((option: string, optionIndex: number) => (
              <div key={optionIndex}>
                <input
                  type="radio"
                  id={`question-${index}-option-${optionIndex}`}
                  name={`question-${index}`}
                  value={option}
                  disabled
                />
                <label htmlFor={`question-${index}-option-${optionIndex}`} className="ml-2">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-2 font-bold">Answer: {question.answer}</div>
        </div>
      );
    }

    if (questionType === "multichoice") {
      return (
        <div key={index} className="mb-4">
          <div className="font-semibold">{question.question}</div>
          <div className="mt-2">
            {question.options?.map((option: string, optionIndex: number) => (
              <div key={optionIndex}>
                <input
                  type="radio"
                  id={`question-${index}-option-${optionIndex}`}
                  name={`question-${index}`}
                  value={option}
                  disabled
                />
                <label htmlFor={`question-${index}-option-${optionIndex}`} className="ml-2">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-2 font-bold">Answer: {question.answer}</div>
        </div>
      );
    }

    if (questionType === "open-ended") {
      return (
        <div key={index} className="mb-4">
          <div className="font-semibold">{question.question}</div>
          <div className="mt-2">{question.answer}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{questionType.toUpperCase()} Quiz</h2>
      <div>
        {quizData.map((question, index) => renderQuestion(question, index))}
      </div>
      <DownloadQuiz question_type={questionType} numQuestion={numQuestions} />
    </div>
  );
}

export default function DisplayQuiz() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
}












// import React, { useState } from 'react';
// import { determineQuizDisplay } from '../components/determineQuizDisplay';
// import CheckButton from '../components/CheckButton';
// import NewQuizButton from '../components/NewQuizButton';
// import QuizAnswerField from '../components/QuizAnswerField';
// import { useSearchParams } from 'next/navigation';
// import { gradeSpecificQuestion } from '../components/MockOpenEndedAnswers'; 

// const QuizDisplayPage = () => {
//     const searchParams = useSearchParams();
//     const questionType = searchParams.get('questionType');
//     const numQuestions = searchParams.get('numQuestions');
//     const [userAnswers, setUserAnswers] = useState<string[]>([]);
//     const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
//     const [quizReport, setQuizReport] = useState<any[]>([]);

//     const quizQuestions = determineQuizDisplay(questionType as string, Number(numQuestions)) || [];

//     const handleAnswerChange = (index: number, answer: string) => {
//         const updatedAnswers = [...userAnswers];
//         updatedAnswers[index] = answer;
//         setUserAnswers(updatedAnswers);
//     };

//     const checkAnswers = () => {
//         const report = quizQuestions.map((question, index) => {
//             const userAnswer = userAnswers[index];
//             let isCorrect = false;
//             let correctAnswer = "";

//             correctAnswer = question.answer;
//             if (questionType === 'multichoice') {
//                 isCorrect = userAnswer === correctAnswer;
//             } else if (questionType === 'true-false') {
//                 isCorrect = userAnswer === correctAnswer;
//             } else if (questionType === 'open-ended') { 
//                 isCorrect = gradeSpecificQuestion(index, userAnswer) === 'Correct (flexible match)!';
//             }

//             return {
//                 question: question.question,
//                 userAnswer,
//                 correctAnswer,
//                 isCorrect,
//             };
//         });

//         setQuizReport(report);
//         setIsQuizChecked(true);
//     };

//     return (
//         <div className="quiz-container">
//             <h1>{questionType} Quiz</h1>
//             <div className="quiz-questions">
//                 {quizQuestions.map((question, index) => (
//                     <div key={index} className="quiz-question">
//                         <h3>{index + 1}. {question.question}</h3>
//                         <QuizAnswerField
//                             questionType={questionType as string}
//                             index={index}
//                             onAnswerChange={handleAnswerChange}
//                             options={question.options} 
//                         />
//                     </div>
//                 ))}
//             </div>

//             <div className="quiz-actions">
//                 <CheckButton onClick={checkAnswers} />
//                 {isQuizChecked && <NewQuizButton />}
//             </div>

//             {isQuizChecked && (
//                 <div className="quiz-report">
//                     <h2>Quiz Results</h2>
//                     {quizReport.map((report, index) => (
//                         <div key={index} className={`result ${report.isCorrect ? 'correct' : 'incorrect'}`}>
//                             <p>Question: {report.question}</p>
//                             <p>Your Answer: {report.userAnswer}</p>
//                             <p>Correct Answer: {report.correctAnswer}</p>
//                             <p>Result: {report.isCorrect ? 'Correct' : 'Incorrect'}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QuizDisplayPage;
