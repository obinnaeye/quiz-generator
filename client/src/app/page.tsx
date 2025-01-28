// src/app/page.tsx

"use client";

import SignUpButton from "./components/SignUpButton";
import SignInButton from "./components/SignInButton";
import QuizForm from "./components/QuizForm";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
    <div className="max-w-2xl mx-auto py-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Generator</h1>
        <div className="flex items-end">
          <SignUpButton />
          <SignInButton />
        </div>
      </div>
      <QuizForm />
    </div>
    </div>
  );
}
