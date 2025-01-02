import { QuizGenerationSectionProps } from "@/libs/props";


export default function QuizGenerationSection({
  profession,
  setProfession,
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
  difficultyLevel,
  setDifficultyLevel,
}: QuizGenerationSectionProps) {
  return (
    <section className="w-full p-2 mb-2 border border-gray-300 rounded">
      <h2 className="text-lg font-semibold mb-4">
        Complete The Fields Below To Generate Quiz
      </h2>

      <div className="mb-4">
        <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
          Enter The Concept/Context For This Quiz
        </label>
        <input
          type="text"
          id="profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter the concept/context here"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
          Enter Number of Quiz Questions (1-10)
        </label>
        <input
          type="number"
          id="numQuestions"
          value={numQuestions}
          onChange={(e) =>
            setNumQuestions(Math.min(10, Math.max(1, Number(e.target.value))))
          }
          min="1"
          max="10"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter the number of quiz questions"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
          Select Quiz Type
        </label>
        <select
          id="questionType"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="multichoice">Multiple Choice</option>
          <option value="true-false">True or False</option>
          <option value="open-ended">Open Ended</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700">
          Select Difficulty Level
        </label>
        <select
          id="difficultyLevel"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </section>
  );
};
