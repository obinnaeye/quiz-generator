'use client'; // Mark this component as a client component

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Quiz() {
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [parsedQuestions, setParsedQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [error, setError] = useState<string | null>(null); // Add an error state

  useEffect(() => {
    const query = searchParams.get('questions');
    
    try {
      const questions = query ? JSON.parse(query) : []; // Safely parse the query
      if (Array.isArray(questions)) {
        setParsedQuestions(questions);
      } else {
        throw new Error("Invalid question format"); // If it's not an array, throw an error
      }
    } catch (err) {
      setError("Failed to load questions. Invalid query format.");
    }
  }, [searchParams]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setScore(10); // Placeholder for score calculation logic
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Error</h1>
        <p className="text-center text-red-500">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Take the Quiz</h1>
      {score === null ? (
        <form onSubmit={handleSubmit}>
          {parsedQuestions.map((q, index) => (
            <div key={index} className="mb-6">
              <p className="text-xl mb-2">{q.question}</p>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit Answers
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Your Score: {score} / {parsedQuestions.length}</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

