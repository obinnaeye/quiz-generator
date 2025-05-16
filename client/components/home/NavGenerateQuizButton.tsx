"use client";

import React from "react";
import { useRouter } from "next/router"; // For Pages Router
// If you're using the App Router, use: `import { useRouter } from "next/navigation";`

const NavGenerateQuizButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-base font-semibold text-[#0F2654] border border-[#0F2654] rounded-2xl px-6 py-2 hover:bg-gray-100 transition"
      onClick={() => router.push("/generate")}
    >
      Generate a Quiz
    </button>
  );
};

export default NavGenerateQuizButton;
