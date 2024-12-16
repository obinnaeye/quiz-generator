import { mockQuizHistory } from "./MockQuizHistory";

export default function DisplayQuizHistory(){
    const quizHistory = mockQuizHistory.map((quiz, index) => {
            const quiznumber = index + 1;

            return (
                    <>
                        <hr/>
                        <div key= {index}>Quiz: {quiznumber}</div>
                        <div>
                            {quiz.map((question, index) => {
                            let optionsLine;
                            if("options" in question){
                                optionsLine = <ul>
                                                    {question.options.map((option, index) => (<li key= {index}>*{option}</li>))}
                                                </ul>
                            }
                                return (
                                    <div key={index}>
                                        <h2>{index + 1}. {question.question}</h2>
                                        {optionsLine}
                                        <h2>Answer: {question.answer}</h2>
                                    </div>
                                );
                        })}
                    </div>
                </>
            )
            
    }); 

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
