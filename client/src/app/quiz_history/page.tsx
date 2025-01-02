"use client";

import React, { Suspense, useEffect, useState } from "react";
import { getUserQuizHistory } from "../app-store";
import { useSearchParams } from "next/navigation";
import { GeneratedQuizModel } from "@/libs/models";
import { DisplayQuizHistoryPageProps } from "@/libs/props";

const determineQuizHistoryDisplay = async(userId: string) => {

    const quizHistory: GeneratedQuizModel[][] | undefined = await getUserQuizHistory(userId);
    if(quizHistory != undefined) {

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

        const fetchQuizHistory = async () => {
            try{
                const history = await determineQuizHistoryDisplay(userId);
                setQuizHistory(history);
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
