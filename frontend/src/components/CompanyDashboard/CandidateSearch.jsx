import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../services/companyService";
import aiService from "../../services/aiService";

function CandidateSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const suggestions = [
    "React developer with 3+ years experience",
    "Full stack engineer who knows MongoDB and Node.js",
    "UI/UX designer with Figma skills",
    "Python developer with machine learning experience",
    "Junior developer open to internship",
  ];

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      // Fetch all candidates from backend
      const allApplicants = await companyService.getAllApplications();

      if (!allApplicants?.length) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Build candidate list for AI
      const candidates = allApplicants.map((a) => ({
        id: a?.applicantProfile?._id,
        name: a?.applicantProfile?.userProfile?.name || "Unknown",
        skills: a?.applicantProfile?.userProfile?.skills || [],
        experience: a?.applicantProfile?.userProfile?.yearsOfExperience || 0,
        role: a?.applicantProfile?.userProfile?.primaryRole || "",
        bio: a?.applicantProfile?.userProfile?.bio || "",
        jobApplied: a?.jobDetails?.title || "",
      }));

      // Send to AI for natural language matching
      const reply = await aiService.chat(
        q,
        {
          task: "candidate_search",
          query: q,
          candidates,
          instruction: "Search through these candidates and find the best matches for the query. Return a JSON array of matched candidates sorted by relevance with a matchReason for each. Format: [{\"id\":\"<id>\",\"name\":\"<name>\",\"matchScore\":<0-100>,\"matchReason\":\"<why they match>\",\"skills\":[],\"experience\":<years>}]. Return ONLY the JSON array, no extra text.",
        }
      );

      // Parse AI response
      const raw = typeof reply === "string" ? reply : reply?.reply || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]");
      if (start === -1) { setResults([]); return; }
      const parsed = JSON.parse(clean.slice(start, end + 1));
      setResults(parsed);
    } catch (err) {
      setError("Search failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 85) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 65) return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-400">AI-Powered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Candidate Search</h1>
          <p className="text-sm text-gray-500 mt-1">Search candidates using natural language — no filters needed.</p>
        </div>

        {/* Search box */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder='Try: "React developer with 3+ years" or "designer who knows Figma"'
              className="w-full pl-12 pr-32 py-4 bg-[#131720] border border-white/10 rounded-2xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-base"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>🧠</span>Search</>}
            </button>
          </div>

          {/* Suggestions */}
          {!results && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-600">Try:</span>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setQuery(s); handleSearch(s); }}
                  className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-full hover:border-indigo-500/30 hover:text-indigo-400 transition-all">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{error}</div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#131720] border border-white/5 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Found <span className="text-white font-semibold">{results.length}</span> candidates matching <span className="text-indigo-400">"{query}"</span>
              </p>
              <button onClick={() => { setResults(null); setQuery(""); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Clear
              </button>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-[#131720] border border-white/5 rounded-2xl">
                <div className="text-3xl">🔍</div>
                <p className="text-white font-semibold">No candidates found</p>
                <p className="text-gray-500 text-sm">Try a different search query</p>
              </div>
            ) : (
              results.map((candidate, i) => (
                <div key={i} className="bg-[#131720] border border-white/5 hover:border-indigo-500/20 rounded-2xl p-5 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-400">#{i + 1}</span>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">{candidate.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{candidate.experience} years experience · {candidate.jobApplied || "Candidate"}</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full border ${scoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}% match
                      </span>
                      <button
                        onClick={() => navigate(`/user/${candidate.id}`)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white/5 border border-white/10 text-gray-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-400 rounded-xl transition-all">
                        View Profile →
                      </button>
                    </div>
                  </div>

                  {/* Match reason */}
                  <div className="mt-3 flex items-start gap-2 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <span className="text-sm shrink-0">🧠</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{candidate.matchReason}</p>
                  </div>

                  {/* Skills */}
                  {candidate.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {candidate.skills.slice(0, 6).map((skill, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 6 && (
                        <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-gray-500 rounded-lg">
                          +{candidate.skills.length - 6}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateSearch;