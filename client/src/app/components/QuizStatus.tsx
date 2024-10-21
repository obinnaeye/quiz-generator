// src/app/components/QuizStatus.tsx

interface QuizStatusProps {
    status: string;
  }
  
  export default function QuizStatus({ status }: QuizStatusProps) {
    return (
      <input
        type="text"
        value={status}
        readOnly
        className="w-full p-2 border border-gray-300 rounded"
      />
    );
  }
  