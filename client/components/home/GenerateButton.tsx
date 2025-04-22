import React from "react";
import { GenerateButtonProps } from "../../interfaces/props";

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-[#0a3264] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#082952] transition text-lg"
  >
    Generate Quiz
  </button>
);
