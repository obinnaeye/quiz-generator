"use client";

import React from "react";
import SidebarButton from "./SidebarButton";
import { useRouter } from "next/navigation";

const SavedQuizzesButton = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/saved_quizzes");
  };

  return (
    <SidebarButton label="Saved Quizzes" icon="💾" onClick={handleNavigation} />
  );
};

export default SavedQuizzesButton;
