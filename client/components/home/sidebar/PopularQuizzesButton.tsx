// components/sidebar/PopularQuizzesButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const PopularQuizzesButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/popular-quizzes");
  };

  return <SidebarButton label="Popular Quizzes" icon="🌟" onClick={handleClick} />;
};

export default PopularQuizzesButton;
