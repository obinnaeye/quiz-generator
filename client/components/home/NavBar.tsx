import React from "react";
import SignInButton from "./SignInButton";
import SignUpButton from "./SignUpButton";
import QuizDropdown from "./QuizDropdown";
import PricingLink from "./PricingLink";
import HowItWorksLink from "./HowItWorksLink";
import NavGenerateQuizButton from "./NavGenerateQuizButton";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-[#E0E2E5] shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-[#0F2654]">HQuiz</h1>

        {/* Links */}
        <div className="flex items-center space-x-8">
          <QuizDropdown />
          <PricingLink />
          <HowItWorksLink />
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <NavGenerateQuizButton />
          <SignInButton />
          <SignUpButton />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
