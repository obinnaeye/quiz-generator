// client/components/sidebar/QuizHistoryButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const QuizHistoryButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    const userId = "userId"; // replace with real userId when available
    const query = new URLSearchParams({ userId }).toString();
    router.push(`/quiz_history?${query}`);
  };

  return <SidebarButton label="Quiz History" icon="🕘" onClick={handleClick} />;
};

export default QuizHistoryButton;
