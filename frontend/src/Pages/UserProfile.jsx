import React, { useState } from "react";
import EditProfile from "../components/UserProfile/EditProfile";
import UpdateResume from "../components/UserProfile/UpdateResume";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import aiService from "../services/aiService";

const TABS = [
  {
    key: "editProfile", label: "Profile",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    key: "resume", label: "Resume / CV",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    key: "aiOptimizer", label: "AI Optimizer",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
];

// ── GRADE COLOR ──
const gradeColor = { A: "text-emerald-400", B: "text-indigo-400", C: "text-amber-400", D: "text-red-400" };
const priorityColor = { HIGH: "text-red-400 bg-red-500/10 border-red-500/20", MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20", LOW: "text-gray-400 bg-white/5 border-white/10" };

function AIOptimizer({ userData }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.optimizeProfile();
      setResult(res);
    } catch (err) {
      setError("Could not analyze profile. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">AI Profile Optimizer</h2>
          <p className="text-sm text-gray-500 mt-1">Get an AI-powered score and specific tips to improve your profile.</p>
        </div>
        <button onClick={handleOptimize} disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 text-sm shrink-0">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
            : <><span>🧠</span>{result ? "Re-analyze" : "Analyze My Profile"}</>}
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{error}</div>}

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">🧠</div>
          <div>
            <p className="text-white font-semibold">Ready to optimize your profile?</p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">Click "Analyze My Profile" and AI will review your profile and give you a score + specific improvement tips.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Score card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Profile Score</p>
                <p className="text-4xl font-bold text-white mt-1 tabular-nums">{result.overallScore}<span className="text-lg text-gray-500">/100</span></p>
              </div>
              <div className={`text-5xl font-bold ${gradeColor[result.grade] || "text-gray-400"}`}>{result.grade}</div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-3">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${result.overallScore}%` }} />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{result.summary}</p>
          </div>

          {/* Improvements */}
          {result.improvements?.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Improvements</p>
              {result.improvements.map((imp, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{imp.section}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${priorityColor[imp.priority] || priorityColor.LOW}`}>
                      {imp.priority}
                    </span>
                  </div>
                  <p className="text-xs text-red-400">⚠ {imp.issue}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">✓ {imp.suggestion}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improved bio */}
          {result.improvedBio && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-indigo-400">🧠 Suggested Bio</p>
              <p className="text-sm text-gray-300 leading-relaxed">{result.improvedBio}</p>
            </div>
          )}

          {/* Missing skills */}
          {result.missingSkills?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Skills to Add</p>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-medium">+ {skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserProfile() {
  const { userData } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("editProfile");

  if (userData?.role === "employer") return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[#0D0F12] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Manage how companies see you on HireSense</p>
          </div>
          <button onClick={() => navigate(`/user/${userData._id}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-all duration-150">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Public Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit mb-6">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setSelectedSection(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                selectedSection === tab.key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30" : "text-gray-500 hover:text-gray-300"
              }`}>
              {tab.icon}{tab.label}
              {tab.key === "aiOptimizer" && <span className="text-xs px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">NEW</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-[#131720] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          {selectedSection === "editProfile" && <EditProfile />}
          {selectedSection === "resume" && <UpdateResume />}
          {selectedSection === "aiOptimizer" && <AIOptimizer userData={userData} />}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;