import React from "react";

const steps = [
  {
    step: "Step 1",
    title: "Enter Your Topic",
    desc: "Type in a subject or topic you want to create a quiz about—anything from science to history!",
  },
  {
    step: "Step 2",
    title: "Choose Your Question Type",
    desc: "Select the format you need: multiple choice, true/false, or short answer questions.",
  },
  {
    step: "Step 3",
    title: "Generate Your Quiz",
    desc: "Click the 'Generate' button and watch as the AI instantly creates a set of questions and answers.",
  },
  {
    step: "Step 4",
    title: "Save or Share",
    desc: "Review your quiz, make any edits if needed, and save or download it to share with others!",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gray-100 py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {steps.map((stepObj, i) => (
          <div key={i} className="bg-white p-6 rounded shadow-md">
            <p className="font-bold mb-1">{stepObj.step}</p>
            <h3 className="text-md font-semibold mb-2">{stepObj.title}</h3>
            <p className="text-sm text-gray-600">{stepObj.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
