"use client";

import React, { Suspense, useEffect, useState } from "react";
import { getUserQuizHistory } from "../app-store";
import { useSearchParams } from "next/navigation";

interface DisplayQuizHistoryPageProps {
    quizHistory: any[]
}

interface QuizQuestions {
    question: string,
    options?: string[],
    answer: string
}

type Quiz = QuizQuestions[];
const determineQuizHistoryDisplay = async(userId: string) => {
    const quizHistory: Quiz[] | undefined = await getUserQuizHistory(userId);
    if(quizHistory != undefined) {
        console.log('this is the quizHistory inside of the determineQuizHistoryDisplay', quizHistory);
        const rearrangedHistory = quizHistory.map((quiz, index) => {
            const quiznumber = index + 1;
            const listedQuizQuestions = quiz.map((quizQuestions, index) => {
                let optionsLine;
                            if(quizQuestions.options){
                                optionsLine = <ul>
                                                {quizQuestions.options.map((option, index) => (<li key= {index}>*{option}</li>))}
                                            </ul>
                            }

                            return (
                                <div key={index}>
                                    <h2>{index + 1}. {quizQuestions.question}</h2>
                                    {optionsLine}
                                    <h2>Answer: {quizQuestions.answer}</h2>
                                </div>
                            );
            });

            return (
                <div key={index}>
                    <hr/>
                    <>Quiz: {quiznumber}</>
                    <div>{listedQuizQuestions}</div>
                </div>
            )
        });
        return rearrangedHistory;
    } else {
        console.log('this is the quizHistory inside of the determineQuizHistory', quizHistory);
        return [];
    }
}

const DisplayQuizHistoryPage: React.FC<DisplayQuizHistoryPageProps> = ({quizHistory}) => {
    
    return (
        <div>
            <h1>
                Quiz history
            </h1>
            <div>
                {quizHistory}
            </div>
        </div>
    );
}

export default function DisplayQuizHistory(){
    const searchParams = useSearchParams();
    const [quizHistory, setQuizHistory] = useState<any[]>([])
    
    //useEffect helps await the quiz history from the server
    useEffect(() => {
        const userId = searchParams.get("userId") || "fakeId";
        console.log('this is the userId coming from searchParams', userId);

        const fetchQuizHistory = async () => {
            try{
                const history = await determineQuizHistoryDisplay(userId);
                setQuizHistory(history);
                console.log('this is the rearrangedQuizhistory coming from the determineQuizHistoryDisplay', history);
            } catch (error) {
                console.error({message: "Error fetching quiz history", error, userId})
            }
        };
        fetchQuizHistory();
    }, [searchParams]);

    return (
        <Suspense fallback={<div>Loading quiz history...</div>}>
            <DisplayQuizHistoryPage quizHistory={quizHistory}/>
        </Suspense>
    );
}
