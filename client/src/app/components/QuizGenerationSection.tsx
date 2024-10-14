//src/app/component/QuizGenerationSection.tsx


// QuizForm  Component input field section, state managed at the parent Component (QuizForm)

interface QuizGenerationSectionProps {
  profession: string;
  setProfession: (value: string) => void;
  numQuestions: number;
  setNumQuestions: (value: number) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
}

export default function QuizGenerationSection ({
  profession,
  setProfession,
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
}: QuizGenerationSectionProps) {
  return (
    <section className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Complete The Fields Below To Generate Quiz</h2>

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
          placeholder="Enter the field or profession here"
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
          placeholder="Enter the number of questions to be generated here"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
          Choose Question Type
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

      {/* <button
        type="button"
        onClick={onGenerateQuiz}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Generate Quiz
      </button> */}
    </section>
  );
};



// QuizForm  Component input field section with state managed within the component

// import  { useState } from 'react';

// export default function QuizGenerationSection () {
//   const [profession, setProfession] = useState<string>('');
//   const [numQuestions, setNumQuestions] = useState<number>(1);
//   const [questionType, setQuestionType] = useState<string>('multichoice');

//   const handleGenerateQuiz = () => {
//     // Handle quiz generation logic here
//     console.log({ profession, numQuestions, questionType });
//   };

//   return (
//     <section className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Complete The Fields Below To Generate Quiz</h2>

//       <div className="mb-4">
//         <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
//           Field/Profession
//         </label>
//         <input
//           type="text"
//           id="profession"
//           value={profession}
//           onChange={(e) => setProfession(e.target.value)}
//           className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           required
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
//           Number of Questions (1-10)
//         </label>
//         <input
//           type="number"
//           id="numQuestions"
//           value={numQuestions}
//           onChange={(e) => setNumQuestions(Math.min(10, Math.max(1, Number(e.target.value))))}
//           min="1"
//           max="10"
//           className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           required
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
//           Question Type
//         </label>
//         <select
//           id="questionType"
//           value={questionType}
//           onChange={(e) => setQuestionType(e.target.value)}
//           className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
//         >
//           <option value="multichoice">Multiple Choice Questions</option>
//           <option value="theory">Theory/Essay Questions</option>
//         </select>
//       </div>

//       <button
//         type="button"
//         onClick={handleGenerateQuiz}
//         className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
//       >
//         Generate Quiz
//       </button>
//     </section>
//   );
// };



