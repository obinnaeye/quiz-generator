"use client ";

import React, { useState } from "react";
import SignInButton from "./SignInButton";
import SignUpButton from "./SignUpButton";
import QuizDropdown from "./QuizDropdown";
import PricingLink from "./PricingLink";
import HowItWorksLink from "./HowItWorksLink";
import NavGenerateQuizButton from "./NavGenerateQuizButton";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const NavBar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button - fixed, visible, and above all */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-[100] text-[#0F2654] text-2xl focus:outline-none bg-[#E0E2E5] p-2 rounded-full shadow-md"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#F5F5F5] shadow-md z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
        style={{ paddingTop: "64px" }}
      >
        <Sidebar />
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#E0E2E5] shadow-md fixed top-0 left-0 right-0 z-40 h-16 flex items-center">
        <div className="max-w-6xl w-full mx-auto px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <h1 className="text-3xl font-bold text-[#0F2654]">HQuiz</h1>

          {/* Center Links */}
          <div className="flex items-center space-x-8">
            <QuizDropdown />
            <PricingLink />
            <HowItWorksLink />
          </div>

          {/* Right Buttons */}
          <div className="flex items-center space-x-4">
            <NavGenerateQuizButton />
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </nav>

      {/* Spacer to offset fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default NavBar;
