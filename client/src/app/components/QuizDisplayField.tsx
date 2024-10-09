// src/app/components/QuizDisplayField.tsx

interface QuizDisplayFieldProps {
    question: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function QuizDisplayField({ question, onChange }: QuizDisplayFieldProps) {
    return (
      <input
        type="text"
        name="question"
        placeholder="Enter question"
        value={question}
        onChange={onChange}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        required
      />
    );
  }
  