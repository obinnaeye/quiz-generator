"use client";

import React from "react";
import { 
  QuizForm, 
  SignInButton, 
  SignUpButton 
} from "../components/home";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Generator</h1>
        <div className="flex items-end">
          <SignUpButton />
          <SignInButton />
        </div>
      </div>
      <QuizForm /> {/* QuizForm handles both form input and quiz generation */}
    </div>
  );
}
