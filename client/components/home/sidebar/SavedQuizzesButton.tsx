// components/sidebar/SavedQuizzesButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const SavedQuizzesButton = () => {
  const router = useRouter();

  const handleClick = () => {
    const userId = "userId"; // replace with real userId when available
    const query = new URLSearchParams({ userId }).toString();
    router.push(`/saved-quizzes?${query}`);
  };

  return <SidebarButton label="Saved Quizzes" icon="💾" onClick={handleClick} />;
};

export default SavedQuizzesButton;
