import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { userService } from "../../services/userService";
import aiService from "../../services/aiService";

function JobCard({ job, redirectToDetail }) {
  const {
    title, salaryRange, location, type,
    responsibilities, employer, _id, datePosted, skills,
  } = job;

  const companyLogo = employer?.userProfile?.companyLogo;
  const companyName = employer?.userProfile?.companyName || "Unknown Company";
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const { userData, status, isLoading } = useSelector((store) => store.auth);
  const isCandidate = userData?.role === "jobSeeker";

  // ── FIX: convert all savedJobs to strings before comparing ──
  useEffect(() => {
    if (!userData?.userProfile?.savedJobs || !_id) {
      setSaved(false);
      return;
    }
    const savedIds = userData.userProfile.savedJobs.map((id) => id?.toString());
    setSaved(savedIds.includes(_id.toString()));
  }, [userData, _id]);

  // ── Fetch AI match score ──
  useEffect(() => {
    if (isLoading || !status || !userData) return;
    if (!isCandidate || !_id) return;
    let cancelled = false;
    const fetchMatch = async () => {
      setMatchLoading(true);
      try {
        const res = await aiService.getJobMatchScore(_id);
        if (!cancelled && res) setMatchData(res);
      } catch (err) {
        console.error("Match score failed:", err?.response?.data || err.message);
      } finally {
        if (!cancelled) setMatchLoading(false);
      }
    };
    fetchMatch();
    return () => { cancelled = true; };
  }, [_id, isCandidate, status, isLoading, userData]);

  // ── Save / Unsave job ──
  const handleSave = async (e) => {
    e.stopPropagation();
    if (!status || !isCandidate || saving) return;
    setSaving(true);
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      if (wasSaved) {
        await userService.removeSavedJob(_id);
      } else {
        await userService.saveJob(_id);
      }
    } catch (err) {
      setSaved(wasSaved);
      console.error("Save job failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const verdictConfig = {
    GREAT_FIT:   "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    GOOD_FIT:    "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    PARTIAL_FIT: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    LOW_FIT:     "bg-red-500/10 border-red-500/20 text-red-400",
  };
  const verdictStyle = verdictConfig[matchData?.verdict] || verdictConfig.GOOD_FIT;

  const formatSalary = (num) => {
    if (!num) return null;
    if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(1) + "L";
    return num.toLocaleString();
  };
  const salaryFrom = formatSalary(salaryRange?.from);
  const salaryTo = formatSalary(salaryRange?.to);

  const getTimeAgo = () => {
    if (!datePosted) return "Recently";
    const diff = Date.now() - new Date(datePosted);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(diff / 2592000000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return `${months}mo ago`;
  };

  const typeConfig = {
    "Full-time":  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    "Part-time":  "bg-amber-500/10 border-amber-500/20 text-amber-400",
    "Internship": "bg-violet-500/10 border-violet-500/20 text-violet-400",
    "Freelance":  "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "Remote":     "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  };
  const typeStyle = typeConfig[type] || "bg-white/5 border-white/10 text-gray-400";

  return (
    <div onClick={() => redirectToDetail(_id)} className="group cursor-pointer">
      <div className="relative bg-[#131720] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 hover:-translate-y-0.5">

        {/* AI MATCH BADGE */}
        {isCandidate && (matchLoading || matchData) && (
          <div className={`absolute top-4 right-14 flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${matchLoading ? "bg-white/5 border-white/10" : verdictStyle}`}>
            {matchLoading
              ? <div className="w-3 h-3 border border-gray-600 border-t-gray-400 rounded-full animate-spin" />
              : <><span className="text-xs">🧠</span><span className="text-xs font-bold">{matchData.matchScore}% Match</span></>}
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving || !isCandidate}
          title={!isCandidate ? "Login as job seeker to save" : saved ? "Remove from saved" : "Save job"}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-150 disabled:cursor-default ${
            saved ? "text-indigo-400 bg-indigo-500/10" : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
          }`}
        >
          {saving
            ? <div className="w-4 h-4 border border-gray-600 border-t-gray-400 rounded-full animate-spin" />
            : <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" />
              </svg>}
        </button>

        {/* TOP ROW */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
            {companyLogo
              ? <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-1" />
              : <span className="text-lg font-bold text-gray-500">{companyName.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors duration-150 truncate">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5 font-medium">{companyName}</p>
          </div>
        </div>

        {/* META ROW */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeStyle}`}>{type}</span>
          {location && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-400">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </span>
          )}
          {salaryFrom && salaryTo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ₹{salaryFrom} – ₹{salaryTo}
            </span>
          )}
          <span className="text-xs text-gray-600 ml-auto">{getTimeAgo()}</span>
        </div>

        {/* MATCH REASON */}
        {matchData?.reason && (
          <p className="mt-3 text-xs text-gray-600 italic line-clamp-1">🧠 {matchData.reason}</p>
        )}

        {/* SKILLS */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {skills.slice(0, 5).map((skill, i) => (
              <span key={i} className={`px-2.5 py-1 border text-xs font-medium rounded-lg transition-colors duration-150 ${
                matchData?.matchedSkills?.includes(skill)
                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                  : "bg-white/[0.04] border-white/5 text-gray-400"
              }`}>{skill}</span>
            ))}
            {skills.length > 5 && (
              <span className="px-2.5 py-1 bg-white/[0.04] border border-white/5 text-gray-600 text-xs rounded-lg">+{skills.length - 5}</span>
            )}
          </div>
        )}

        {/* RESPONSIBILITIES */}
        {responsibilities?.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {responsibilities.slice(0, 2).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                <span className="text-indigo-500 mt-0.5 shrink-0">→</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* BOTTOM ROW */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job?.applicants?.length || 0} applicants
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:gap-2 transition-all duration-150">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default JobCard;