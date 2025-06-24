// components/sidebar/GenerateQuizButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const GenerateQuizButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/generate");
  };

  return <SidebarButton label="Generate Quiz" icon="🧠" onClick={handleClick} />;
};

export default GenerateQuizButton;
