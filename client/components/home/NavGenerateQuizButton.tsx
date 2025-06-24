import React from "react";

const NavGenerateQuizButton: React.FC = () => (
  <button
    type="button"
    className="text-base font-semibold text-[#0F2654] border border-[#0F2654] rounded-2xl px-6 py-2 hover:bg-gray-100 transition"
    onClick={() => {
      /* TODO: your generate-quiz handler */
    }}
  >
    Generate a Quiz
  </button>
);

export default NavGenerateQuizButton;
