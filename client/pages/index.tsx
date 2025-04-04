"use client";
import React from "react";
import Navbar from "../components/home/Navbar";
import QuizForm from "../components/home/QuizForm";
import SignInButton from "../components/home/SignInButton";
import SignUpButton from "../components/home/SignUpButton";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-center mb-8">
            Quiz Generator
          </h1>
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
