import { mockMultipleChoiceQuestions } from "../components/MockMultipleChoiceQuestions";

export default function DisplayQuizHistory(){
    const quizHistory = mockMultipleChoiceQuestions.map((question, index) => {
        return (
            <div key={index}>
                <h2>{index + 1}. {question.question}</h2>
                <ul>
                    {question.options.map((option, index) => (<li key= {index}>*{option}</li>))}
                </ul>
                <h2>Answer: {question.answer}</h2>
            </div>
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
