"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckButton from '../components/CheckButton';
import NewQuizButton from '../components/NewQuizButton';
import QuizAnswerField from '../components/QuizAnswerField';
import DownloadQuiz from "../components/DownloadQuiz";

const QuizDisplayPage = () => {
    const searchParams = useSearchParams();
    const questionType = searchParams.get('questionType') || 'multichoice';
    const numQuestions = Number(searchParams.get('numQuestions')) || 1;

    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
    const [quizReport, setQuizReport] = useState<any[]>([]);

    // Fetch quiz questions from the server
    useEffect(() => {
        const fetchQuizQuestions = async () => {
            try {
                // Use the full URL for localhost
                const url = `http://localhost:8000/api/quiz?questionType=${questionType}&numQuestions=${numQuestions}`;
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz questions');
                }
                const data = await response.json();
                setQuizQuestions(data);
                setUserAnswers(Array(data.length).fill(''));
            } catch (error) {
                console.error('Error fetching quiz questions:', error);
            }
        };

        fetchQuizQuestions();
    }, [questionType, numQuestions]);

    const handleAnswerChange = (index: number, answer: string) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = answer;
        setUserAnswers(updatedAnswers);
    };

    const checkAnswers = () => {
        const report = quizQuestions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.answer;
            const isCorrect = userAnswer === correctAnswer;

            return {
                question: question.question,
                userAnswer,
                correctAnswer,
                isCorrect,
            };
        });

        setQuizReport(report);
        setIsQuizChecked(true);
    };

    return (
        <div className="quiz-container">
            <h1>{questionType} Quiz</h1>
            {quizQuestions.length === 0 ? (
                <p>Loading quiz questions...</p>
            ) : (
                <div className="quiz-questions">
                    {quizQuestions.map((question, index) => (
                        <div key={index} className="quiz-question">
                            <h3>{index + 1}. {question.question}</h3>
                            <QuizAnswerField
                                questionType={questionType}
                                index={index}
                                onAnswerChange={handleAnswerChange}
                                options={question.options}
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
                        <div key={index} className={`result ${report.isCorrect ? 'correct' : 'incorrect'}`}>
                            <p>Question: {report.question}</p>
                            <p>Your Answer: {report.userAnswer}</p>
                            <p>Correct Answer: {report.correctAnswer}</p>
                            <p>Result: {report.isCorrect ? 'Correct' : 'Incorrect'}</p>
                        </div>
                    ))}
                </div>
            )}
            <DownloadQuiz question_type={questionType} numQuestion={numQuestions} />
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
