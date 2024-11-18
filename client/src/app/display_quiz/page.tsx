"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DownloadQuiz from '../components/DownloadQuiz';

export default function DisplayQuiz(){
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);
  const searchParams = useSearchParams();
  const question_type = searchParams.get('type') || "multichoice";

  useEffect(() => {
    const fetchQuizData = () => {
      axios
        .get(`http://localhost:8000/generate-quiz?question_type=${question_type}`)
        .then((response) => {
          setQuizData(response.data.quiz_data); 
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching quiz data:', error);
          setIsLoading(false);
        });
    };

    fetchQuizData();
  }, [question_type]);

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  const renderQuestion = (question: any, index: number) => {
    if (question_type === 'true-false') {
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

    if (question_type === 'multichoice') {
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

    if (question_type === 'open-ended') {
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
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Quiz</h2>
      <div>
        {quizData?.map((question: any, index: number) => renderQuestion(question, index))}
      </div>
      <DownloadQuiz question_type={question_type} /> 
    </div>
  );
};

