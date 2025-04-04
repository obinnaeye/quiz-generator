import React from "react";
import { GenerateButtonProps } from "../../interfaces/props";

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Generate Quiz
    </button>
  );
};

export default GenerateButton;
