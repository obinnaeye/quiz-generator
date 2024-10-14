// src/app/comonents/QuizGenerationForm



import  { useState } from 'react';

export default function QuizGenerationForm () {
  const [profession, setProfession] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(1);
  const [questionType, setQuestionType] = useState<string>('multichoice');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //  Form submission logic to be handled here
    console.log({ profession, numQuestions, questionType });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <div className="mb-4">
        <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
          Field/Profession
        </label>
        <input
          type="text"
          id="profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
          Number of Questions (1-10)
        </label>
        <input
          type="number"
          id="numQuestions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Math.min(10, Math.max(1, Number(e.target.value))))}
          min="1"
          max="10"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
          Question Type
        </label>
        <select
          id="questionType"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="multichoice">Multiple Choice Questions</option>
          <option value="theory">Theory/Essay Questions</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Generate Quiz
      </button>
    </form>
  );
};


