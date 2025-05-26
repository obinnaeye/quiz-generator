// components/sidebar/GenerateQuizButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/router"; // Pages Router
import SidebarButton from "./SidebarButton";

const GenerateQuizButton: React.FC = () => {
  const router = useRouter();

  return (
    <SidebarButton
      label="Generate Quiz"
      icon="🧠"
      onClick={() => router.push("/generate")}
    />
  );
};

export default GenerateQuizButton;
