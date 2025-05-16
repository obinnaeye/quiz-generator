"use client";

import React from "react";
import { useRouter } from "next/router";
import NavBar from "../components/home/NavBar";
import Footer from "../components/home/Footer";
import PricingSection from "../components/home/PricingSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="text-center py-16 px-4 bg-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Instant <span className="text-[#0F2654]">Quizzes</span>, Smart{" "}
            <span className="text-[#0F2654]">Answers</span>
          </h1>
          <p className="mb-6 text-gray-600">
            Create engaging quizzes and get answers in seconds. Make learning
            fun and effortless!
          </p>
          <button
            onClick={() => router.push("/generate")}
            className="bg-[#0F2654] text-white px-6 py-3 rounded-2xl hover:bg-[#0C2142] transition"
          >
            Get Started for Free
          </button>
        </section>

        {/* Illustration */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-12">
          <img
            src="/images/study.jpg"
            alt="Students using quiz app"
            className="w-full h-auto rounded shadow-md"
          />
        </div>

        {/* Quiz Here */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Quiz Here</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Generate Quiz",
                desc: "Effortlessly create customized quizzes on any topic. Our smart quiz generator crafts tailored questions on any subject.",
                img: "/images/quiz1.jpg",
              },
              {
                title: "Your Quiz Result",
                desc: "Display all generated quizzes with answers. Export quiz to PDF, text or platform format if applicable.",
                img: "/images/quiz2.jpg",
              },
              {
                title: "Explore Template",
                desc: "Users can input one question for quick answers. Shows AI-generated answers immediately below input.",
                img: "/images/quiz3.jpg",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded shadow-md overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#0F2654]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
                  <p className="mt-4 text-[#0F2654] text-sm font-medium cursor-pointer">
                    Learn More
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <HowItWorksSection />

        {/* Pricing & Testimonials */}
        <PricingSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
