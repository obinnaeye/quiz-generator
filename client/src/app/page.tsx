// src/app/page.tsx

'use client'; // Mark this component as a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation in the App Router

interface Question {
  question: string;
  answer: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([{ question: '', answer: '' }]);
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index][name as keyof Question] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push({
      pathname: '/quiz',
      query: { questions: JSON.stringify(questions) },
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Generator</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              name="question"
              placeholder="Enter question"
              value={q.question}
              onChange={(event) => handleInputChange(index, event)}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="answer"
              placeholder="Enter answer"
              value={q.answer}
              onChange={(event) => handleInputChange(index, event)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Question
        </button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Generate Quiz
        </button>
      </form>
    </div>
  );
}
