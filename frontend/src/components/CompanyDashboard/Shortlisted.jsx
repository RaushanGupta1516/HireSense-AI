import React, { useEffect, useState } from "react";
import ApplicantsCard from "./ApplicantsCard";
import { companyService } from "../../services/companyService";
import aiService from "../../services/aiService";

function SkeletonCard() {
  return (
    <div className="bg-[#1C2030] border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-sm">No shortlisted candidates yet</p>
        <p className="text-gray-500 text-xs mt-1 max-w-xs">Candidates you shortlist from Applications will appear here.</p>
      </div>
      <a href="/dashboard/applications"
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all mt-1">
        View All Applications
      </a>
    </div>
  );
}

function Shortlisted() {
  const [sortValue, setSortValue] = useState("date");
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [ranking, setRanking] = useState(false);
  const [rankMap, setRankMap] = useState({});
  const [exporting, setExporting] = useState(false);
  const [generatingKit, setGeneratingKit] = useState(false);
  const [kitResult, setKitResult] = useState(null);

  const sortOptions = [
    { value: "date", label: "Application Date" },
    { value: "experience", label: "Experience" },
    { value: "name", label: "Name" },
    { value: "rank", label: "AI Rank" },
  ];

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await companyService.getShortListedCandidates();
      setShortlistedCandidates(res || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ── AI RANK ──
  const handleRankAll = async () => {
    if (!shortlistedCandidates.length) return;
    setRanking(true);
    try {
      const jobId = shortlistedCandidates[0]?.jobDetails?._id;
      if (!jobId) return;
      const results = await aiService.rankCandidates(jobId);
      const map = {};
      (results || []).forEach((r) => { map[r.candidateId] = r; });
      setRankMap(map);
      setSortValue("rank");
    } catch (err) {
      console.error(err);
    } finally {
      setRanking(false);
    }
  };

  // ── EXPORT CSV ──
  const handleExport = () => {
    if (!shortlistedCandidates.length) return;
    setExporting(true);
    try {
      const headers = ["Name", "Experience", "Skills", "Job Applied", "Email"];
      const rows = shortlistedCandidates.map((c) => [
        c?.applicantProfile?.userProfile?.name || "",
        (c?.applicantProfile?.userProfile?.yearsOfExperience || 0) + " years",
        (c?.applicantProfile?.userProfile?.skills || []).join("; "),
        c?.jobDetails?.title || "",
        c?.applicantProfile?.email || "",
      ]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shortlisted_candidates.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  // ── GENERATE INTERVIEW QUESTIONS FOR ALL ──
  const handleGenerateQuestions = async () => {
    if (!shortlistedCandidates.length) return;
    setGeneratingKit(true);
    try {
      const first = shortlistedCandidates[0];
      const result = await aiService.generateInterviewKit({
        candidateId: first?.applicantProfile?._id,
        jobId: first?.jobDetails?._id,
      });
      setKitResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingKit(false);
    }
  };

  const filtered = shortlistedCandidates
    .filter((a) => {
      const name = a?.applicantProfile?.userProfile?.name || "";
      const role = a?.jobDetails?.title || "";
      return name.toLowerCase().includes(search.toLowerCase()) || role.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortValue === "rank") {
        const aRank = rankMap[a?.applicantProfile?._id]?.rank || 999;
        const bRank = rankMap[b?.applicantProfile?._id]?.rank || 999;
        return aRank - bRank;
      }
      if (sortValue === "experience") return (b?.applicantProfile?.userProfile?.yearsOfExperience || 0) - (a?.applicantProfile?.userProfile?.yearsOfExperience || 0);
      if (sortValue === "name") return (a?.applicantProfile?.userProfile?.name || "").localeCompare(b?.applicantProfile?.userProfile?.name || "");
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-[#0D0F12] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Shortlisted</h1>
              {!loading && shortlistedCandidates.length > 0 && (
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                  {shortlistedCandidates.length}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Your top candidates ready for interview</p>
          </div>

          {shortlistedCandidates.length > 0 && (
            <button onClick={handleExport} disabled={exporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition-all text-sm shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          )}
        </div>

        {/* Pipeline — real counts only */}
        {!loading && shortlistedCandidates.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Shortlisted", value: shortlistedCandidates.length, color: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/10" },
              { label: "To Interview", value: shortlistedCandidates.length, color: "text-indigo-400", bg: "bg-indigo-500/5 border-indigo-500/10" },
              { label: "Interviewed", value: 0, color: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/10" },
              { label: "Offer Sent", value: 0, color: "text-violet-400", bg: "bg-violet-500/5 border-violet-500/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} border rounded-2xl p-4 text-center`}>
                <p className={`text-2xl font-bold ${s.color} tabular-nums`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {!loading && shortlistedCandidates.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search shortlisted..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 transition-all w-full text-gray-300 placeholder-gray-600" />
            </div>
            <div className="flex items-center gap-3">
              <select value={sortValue} onChange={(e) => setSortValue(e.target.value)}
                className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl outline-none text-gray-400 cursor-pointer">
                {sortOptions.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)}
              </select>
              <button onClick={handleRankAll} disabled={ranking}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-semibold rounded-xl transition-all text-sm disabled:opacity-50">
                {ranking ? <><div className="w-3 h-3 border border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />Ranking...</> : <><span>🧠</span>AI Rank</>}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0 ? (
              <>
                <p className="text-xs text-gray-600 px-1">
                  <span className="text-gray-400 font-semibold">{filtered.length}</span> shortlisted candidate{filtered.length !== 1 ? "s" : ""}
                  {Object.keys(rankMap).length > 0 && <span className="text-indigo-400 ml-2">· sorted by AI rank</span>}
                </p>
                {filtered.map((applicant, index) => (
                  <ApplicantsCard key={index} data={applicant} isShortlisted={true} fetchApplications={fetchApplications}
                    rankData={rankMap[applicant?.applicantProfile?._id] || null} />
                ))}
              </>
            ) : (
              <div className="bg-[#131720] border border-white/5 rounded-2xl"><EmptyState /></div>
            )}
        </div>

        {/* Interview Kit prompt */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border border-indigo-500/20 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-white">Ready to schedule interviews?</p>
                <p className="text-xs text-gray-400 mt-0.5">Generate custom AI interview questions for your top candidate.</p>
              </div>
              <button onClick={handleGenerateQuestions} disabled={generatingKit}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30 shrink-0">
                {generatingKit
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                  : <><span>🎤</span>Generate Questions</>}
              </button>
            </div>

            {/* Kit result */}
            {kitResult && (
              <div className="bg-[#131720] border border-violet-500/20 rounded-2xl p-5 space-y-4">
                <p className="text-xs font-semibold text-violet-400">🎤 Interview Kit — {shortlistedCandidates[0]?.applicantProfile?.userProfile?.name}</p>
                {["technicalQuestions", "behaviouralQuestions", "redFlagQuestions"].map((type) => (
                  kitResult[type]?.length > 0 && (
                    <div key={type}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {type === "technicalQuestions" ? "Technical" : type === "behaviouralQuestions" ? "Behavioural" : "Red Flag"}
                      </p>
                      <div className="space-y-2">
                        {kitResult[type].map((q, i) => (
                          <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                            <p className="text-sm text-white">{q.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{q.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shortlisted;