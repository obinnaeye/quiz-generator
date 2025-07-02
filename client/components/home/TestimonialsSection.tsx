import React from "react";

export default function TestimonialsSection() {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-2xl font-semibold mb-8 text-center">Testimonials</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Joe Donald</p>
                  <p className="text-xs text-gray-500">High School Teacher</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 text-left">
                This quiz app has been a game-changer for me as an educator.
                Creating engaging quizzes used to take hours, but now I can
                generate customized quizzes in 10 minutes. Highly recommend it!
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
