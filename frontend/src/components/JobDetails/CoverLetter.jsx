import React, { useState } from "react";
import { useSelector } from "react-redux";
import aiService from "../../services/aiService";

function CoverLetter({ jobData }) {
  const { userData } = useSelector((store) => store.auth);
  const isCandidate = userData?.role === "jobSeeker";
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState("professional");

  if (!isCandidate) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setLetter(null);
    try {
      const result = await aiService.chat(
        "Generate a cover letter",
        {
          task: "cover_letter",
          tone,
          candidate: {
            name: userData.userProfile?.name || "Candidate",
            role: userData.userProfile?.primaryRole || "",
            skills: userData.userProfile?.skills || [],
            experience: userData.userProfile?.yearsOfExperience || 0,
            bio: userData.userProfile?.bio || "",
          },
          job: {
            title: jobData.title,
            company: jobData.employer?.userProfile?.companyName || "the company",
            location: jobData.location || "",
            description: jobData.description?.replace(/<[^>]*>/g, "").substring(0, 500) || "",
            skills: jobData.skills || [],
          },
          instruction: "Write a compelling, personalized cover letter in " + tone + " tone. 3 paragraphs. Opening that references the specific role, middle that highlights matching skills and experience, closing with call to action. Address it to the hiring team. Sign off with the candidate name. Keep it under 250 words.",
        }
      );
      setLetter(result?.reply || result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "concise", label: "Concise" },
  ];

  return (
    <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <span className="text-sm">✍️</span>
        </div>
        <h3 className="text-sm font-semibold text-white">AI Cover Letter Generator</h3>
        <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full ml-auto">Powered by AI</span>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-xs text-gray-500">Generate a personalized cover letter for this role based on your profile.</p>

        {/* Tone selector */}
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-600 shrink-0">Tone:</p>
          <div className="flex gap-2">
            {tones.map((t) => (
              <button key={t.value} onClick={() => setTone(t.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  tone === t.value
                    ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                    : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button onClick={handleGenerate} disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 text-sm">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            : <><span>✨</span>{letter ? "Regenerate" : "Generate Cover Letter"}</>}
        </button>

        {/* Result */}
        {letter && (
          <div className="space-y-3">
            <div className="relative p-5 bg-white/[0.02] border border-white/5 rounded-xl">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{letter}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  copied
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}>
                {copied
                  ? <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
                  : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy to Clipboard</>}
              </button>
              <button onClick={handleGenerate} disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50">
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoverLetter;