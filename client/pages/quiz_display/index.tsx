"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { determineQuizDisplay, gradeSpecificQuestion } from '../../lib';
import { 
    CheckButton, 
    CheckQuizHistoryButton, 
    DownloadQuiz, 
    NewQuizButton, 
    QuizAnswerField 
} from '../../components/(public)/home';
import { GeneratedQuizModel } from '../../interfaces/models';
import { QuizDisplayPageProps } from '../../interfaces/props';

const QuizDisplayPage: React.FC<QuizDisplayPageProps> =  ({userId, questionType, numQuestions, quizQuestions}) => {
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [isQuizChecked, setIsQuizChecked] = useState<boolean>(false);
    const [quizReport, setQuizReport] = useState<any[]>([]);

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
                <DownloadQuiz userId={userId} question_type={questionType} numQuestion={numQuestions} />
            </div>
            <div>
                <CheckQuizHistoryButton />
            </div> 
        </div>
    );
};

export default function DisplayQuiz() {
    const searchParams = useSearchParams();
    const [quizParams, setQuizParams] = useState({
        userId: "fakeId",
        questionType: "multichoice",
        numQuestions: 1
    });
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
   
    useEffect(() => {
        const questionType = searchParams.get("questionType") || "multichoice";
        const numQuestionsString = searchParams.get("numQuestions") || "1";
        const userId = searchParams.get("userId") || "fakeId";
        const numQuestions = parseInt(numQuestionsString, 10); // 10 for decimal
        setQuizParams({
            userId,
            questionType,
            numQuestions
        });

        const fetchQuizQuestions = async () => {
            try {
                const questions: GeneratedQuizModel[] = await determineQuizDisplay(userId, questionType, numQuestions);
                setQuizQuestions(questions);
            } catch (error){
                console.error({message: "error fetching quiz questions", error});

            }
        };
        
        fetchQuizQuestions();
    }, [searchParams]);

    return (
      <Suspense fallback={<div>Loading quiz...</div>}>
        <QuizDisplayPage 
            quizQuestions={quizQuestions} 
            userId={quizParams.userId} 
            questionType={quizParams.questionType}
            numQuestions={quizParams.numQuestions} 
        />
      </Suspense>
    );
}
