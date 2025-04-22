"use client";

import React from "react";
import NavBar from "../components/home/NavBar";
import QuizForm from "../components/home/QuizForm";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow p-4">
        <QuizForm />
      </main>
      <Footer />
    </div>
  );
}
