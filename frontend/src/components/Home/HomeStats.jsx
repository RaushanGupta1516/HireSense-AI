import React from "react";

function HomeStats() {
  const stats = [
    {
      number: "50K+",
      label: "Resumes Analyzed",
    },
    {
      number: "92%",
      label: "Matching Accuracy",
    },
    {
      number: "10K+",
      label: "Companies Using HireSense",
    },
    {
      number: "120K+",
      label: "AI Job Matches Generated",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Trusted AI Hiring Platform
        </h2>
        <p className="text-gray-500 mt-2">
          HireSense AI helps recruiters and candidates make smarter decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">

        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#131720] shadow-md rounded-xl py-10 flex flex-col items-center hover:shadow-xl transition"
          >
            <p className="text-4xl font-bold text-purple-600">
              {stat.number}
            </p>

            <p className="text-gray-600 mt-2 text-center">
              {stat.label}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default HomeStats;