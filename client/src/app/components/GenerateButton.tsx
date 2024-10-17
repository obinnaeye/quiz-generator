// src/app/components/GenerateButton.tsx

interface GenerateButtonProps {
    onClick: () => void;
  }
  
  export default function GenerateButton({ onClick }: GenerateButtonProps) {
    return (
      <button onClick={onClick} className="bg-green-500 text-white px-4 py-2 rounded">
        Generate Quiz
      </button>
    );
  }
  