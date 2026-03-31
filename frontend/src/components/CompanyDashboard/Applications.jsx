import React, { useEffect, useState } from "react";
import ApplicantsCard from "./ApplicantsCard";
import { companyService } from "../../services/companyService.js";
import aiService from "../../services/aiService.js";

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
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-sm">No applications yet</p>
        <p className="text-gray-500 text-xs mt-1 max-w-xs">Applications will appear here once candidates apply to your listings.</p>
      </div>
    </div>
  );
}

function Applications() {
  const [sortValue, setSortValue] = useState("date");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [ranking, setRanking] = useState(false);
  const [rankMap, setRankMap] = useState({});
  const [rankError, setRankError] = useState(null);

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
      const res = await companyService.getAllApplications();
      setApplicants(res || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ── AI RANK ALL ──
  const handleRankAll = async () => {
    if (!applicants.length) return;
    setRanking(true);
    setRankError(null);
    try {
      // Get the first job from applicants (all should be same job on this page)
      const jobId = applicants[0]?.jobDetails?._id;
      if (!jobId) throw new Error("No job ID found");
      const results = await aiService.rankCandidates(jobId);
      // Map candidateId -> rank data
      const map = {};
      (results || []).forEach((r) => { map[r.candidateId] = r; });
      setRankMap(map);
      setSortValue("rank");
    } catch (err) {
      setRankError("Ranking failed. Try again.");
      console.error(err);
    } finally {
      setRanking(false);
    }
  };

  const shortlistedCount = applicants.filter((a) => a.isShortlisted).length;

  const filtered = applicants
    .filter((a) => {
      const name = a?.applicantProfile?.userProfile?.name || "";
      const role = a?.jobDetails?.title || "";
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || role.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === "all" ? true : activeTab === "shortlisted" ? a.isShortlisted : !a.isShortlisted;
      return matchSearch && matchTab;
    })
    .sort((a, b) => {
      if (sortValue === "rank") {
        const aRank = rankMap[a?.applicantProfile?._id]?.rank || 999;
        const bRank = rankMap[b?.applicantProfile?._id]?.rank || 999;
        return aRank - bRank;
      }
      if (sortValue === "experience") {
        return (b?.applicantProfile?.userProfile?.yearsOfExperience || 0) - (a?.applicantProfile?.userProfile?.yearsOfExperience || 0);
      }
      if (sortValue === "name") {
        return (a?.applicantProfile?.userProfile?.name || "").localeCompare(b?.applicantProfile?.userProfile?.name || "");
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const tabs = [
    { key: "all", label: "All", count: applicants.length },
    { key: "shortlisted", label: "Shortlisted", count: shortlistedCount },
    { key: "pending", label: "Pending", count: applicants.length - shortlistedCount },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F12] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">{applicants.length} total candidates applied</p>
          </div>
          <div className="flex items-center gap-3">
            {Object.keys(rankMap).length > 0 && (
              <span className="text-xs text-indigo-400 font-medium px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                🧠 AI Ranked
              </span>
            )}
            <button onClick={handleRankAll} disabled={ranking || !applicants.length}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5 text-sm shrink-0">
              {ranking
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Ranking...</>
                : <><span>🧠</span>AI Rank All</>}
            </button>
          </div>
        </div>

        {rankError && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{rankError}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: applicants.length, color: "text-white", bg: "bg-white/5", border: "border-white/5" },
            { label: "Shortlisted", value: shortlistedCount, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
            { label: "Pending Review", value: applicants.length - shortlistedCount, color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/10" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color} tabular-nums`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab.key ? "bg-indigo-600 text-white shadow" : "text-gray-500 hover:text-gray-300"
                }`}>
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/5 text-gray-500"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 transition-all w-full sm:w-52 text-gray-300 placeholder-gray-600" />
            </div>
            <select value={sortValue} onChange={(e) => setSortValue(e.target.value)}
              className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl outline-none text-gray-400 cursor-pointer shrink-0">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            <>
              <p className="text-xs text-gray-600 px-1">
                Showing <span className="text-gray-400 font-semibold">{filtered.length}</span> candidate{filtered.length !== 1 ? "s" : ""}
                {Object.keys(rankMap).length > 0 && <span className="text-indigo-400 ml-2">· sorted by AI rank</span>}
              </p>
              {filtered.map((applicant, index) => (
                <ApplicantsCard
                  key={index}
                  data={applicant}
                  fetchApplications={fetchApplications}
                  rankData={rankMap[applicant?.applicantProfile?._id] || null}
                />
              ))}
            </>
          ) : (
            <div className="bg-[#131720] border border-white/5 rounded-2xl">
              <EmptyState />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Applications;