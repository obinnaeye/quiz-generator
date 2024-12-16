"use client";

import React, { useState, Suspense } from 'react';
import { determineQuizDisplay } from '../components/determineQuizDisplay';
import CheckButton from '../components/CheckButton';
import NewQuizButton from '../components/NewQuizButton';
import QuizAnswerField from '../components/QuizAnswerField';
import { useSearchParams } from 'next/navigation';
import { gradeSpecificQuestion } from '../components/MockOpenEndedAnswers';
import DownloadQuiz from "../components/DownloadQuiz";
import CheckQuizHistoryButton from '../components/CheckQuizHistoryButton';

interface QuizDisplayPageProps{
    handleQuizHistory: (quizQuestions: any[]) => void
}
let mockQuizHistory: any[] = [];

const QuizDisplayPage: React.FC<QuizDisplayPageProps> = ({handleQuizHistory}) => {
    const searchParams = useSearchParams();
    const questionType = searchParams.get('questionType') || 'multichoice';
    const numQuestions = Number(searchParams.get('numQuestions')) || 1;
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
    const [quizReport, setQuizReport] = useState<any[]>([]);

    const quizQuestions = determineQuizDisplay(questionType as string, Number(numQuestions)) || [];

    const handleAnswerChange = (index: number, answer: string) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = answer;
        setUserAnswers(updatedAnswers);
    };

    const checkAnswers = () => {
        const report = quizQuestions.map((question, index) => {
            const userAnswer = userAnswers[index];
            let isCorrect = false;
            let correctAnswer = "";

            correctAnswer = question.answer;
            if (questionType === 'multichoice') {
                isCorrect = userAnswer === correctAnswer;
            } else if (questionType === 'true-false') {
                isCorrect = userAnswer === correctAnswer;
            } else if (questionType === 'open-ended') { 
                isCorrect = gradeSpecificQuestion(index, userAnswer) === 'Correct (flexible match)!';
            }

            return {
                question: question.question,
                userAnswer,
                correctAnswer,
                isCorrect,
            };
        });
        handleQuizHistory(quizQuestions);
        setQuizReport(report);
        setIsQuizChecked(true);
    };

    return (
        <div className="quiz-container">
            <div >
                <h1>{questionType} Quiz</h1>
                <div className="quiz-questions">
                    {quizQuestions.map((question, index) => (
                        <div key={index} className="quiz-question">
                            <h3>{index + 1}. {question.question}</h3>
                            <QuizAnswerField
                                questionType={questionType as string}
                                index={index}
                                onAnswerChange={handleAnswerChange}
                                options={question.options} 
                            />
                        </div>
                    ))}
                </div>

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
            <div>
                <CheckQuizHistoryButton />
            </div> 
        </div>
    );
};



export default function DisplayQuiz() {
    const handleQuizHistory = (quizQuestions: any[]) => {
        mockQuizHistory.push(quizQuestions); // this is where the user's quizzes are going to be saved in our database
    }
    console.log('this is the quiz history at the moment this new quiz is displayed', mockQuizHistory);
    return (
      <Suspense fallback={<div>Loading quiz...</div>}>
        <QuizDisplayPage handleQuizHistory={handleQuizHistory}/>
      </Suspense>
    );
  }
  