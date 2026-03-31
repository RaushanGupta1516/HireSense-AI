import React, { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import Dialogbox from "../Dialogbox";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import aiService from "../../services/aiService";

function JobDetailsCard({ jobData }) {
  const { userData } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const {
    title, salaryRange, location, employer, experience,
    numberOfOpenings, numberOfApplicants, datePosted, type, workMode, _id, skills,
  } = jobData;

  const companyName = employer?.userProfile?.companyName || "Unknown Company";
  const companyLogo = employer?.userProfile?.companyLogo;
  const isJobSeeker = userData?.role === "jobSeeker";

  const [dialog, setDialog] = useState({ isOpen: false, title: "", message: "", buttonText: "" });
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Salary Estimator ──
  const [salaryData, setSalaryData] = useState(null);
  const [salaryLoading, setSalaryLoading] = useState(false);

  // ── Skill Gap ──
  const [skillGap, setSkillGap] = useState(null);

  const alreadyApplied = userData?._id &&
    jobData?.applicants?.some((id) => id?.toString() === userData._id?.toString());
  const alreadySaved = userData?.userProfile?.savedJobs?.some(
    (id) => id?.toString() === _id?.toString()
  );

  useEffect(() => {
    if (alreadyApplied) setApplied(true);
    if (alreadySaved) setSaved(true);
  }, [alreadyApplied, alreadySaved]);

  // ── Auto fetch salary estimate ──
  useEffect(() => {
    if (!title) return;
    const fetch = async () => {
      setSalaryLoading(true);
      try {
        const res = await aiService.estimateSalary({
          jobTitle: title,
          location: location || "India",
          experienceYears: experience || 0,
          skills: skills || [],
        });
        setSalaryData(res);
      } catch { /* silently fail */ }
      finally { setSalaryLoading(false); }
    };
    fetch();
  }, [title]);

  // ── Auto compute skill gap for candidate ──
  useEffect(() => {
    if (!isJobSeeker || !skills?.length || !userData?.userProfile?.skills?.length) return;
    const candidateSkills = userData.userProfile.skills.map(s => s.toLowerCase());
    const missing = skills.filter(s => !candidateSkills.includes(s.toLowerCase()));
    const matched = skills.filter(s => candidateSkills.includes(s.toLowerCase()));
    setSkillGap({ missing, matched });
  }, [isJobSeeker, skills, userData]);

  const formatSalary = (num) => {
    if (!num) return null;
    if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(1) + "L";
    return num.toLocaleString();
  };

  const formatCurrency = (num, currency) => {
    if (!num) return null;
    if (currency === "INR") {
      if (num >= 100000) return "₹" + (num / 100000).toFixed(1) + "L";
      return "₹" + num.toLocaleString();
    }
    return "$" + (num / 1000).toFixed(0) + "K";
  };

  const getTimeAgo = () => {
    if (!datePosted) return "Recently";
    const diff = Date.now() - new Date(datePosted);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const showDialog = (title, message) => setDialog({ isOpen: true, title, message, buttonText: "OK" });

  const saveJob = async () => {
    if (!isJobSeeker || saved) return;
    setSaving(true);
    try {
      await userService.saveJob(_id);
      setSaved(true);
      showDialog("Job Saved ✓", "This job has been saved. Find it in your Saved Jobs.");
    } catch (err) {
      showDialog("Save Failed", err?.response?.data?.message || "Something went wrong.");
    } finally { setSaving(false); }
  };

  const applyForJob = async () => {
    if (!isJobSeeker || applied) return;
    setApplying(true);
    try {
      await userService.applyForJob(_id);
      setApplied(true);
      showDialog("Application Submitted ✓", "Your application has been sent to the recruiter.");
    } catch (err) {
      showDialog("Application Failed", err?.response?.data?.message || "Something went wrong.");
    } finally { setApplying(false); }
  };

  const salaryFrom = formatSalary(salaryRange?.from);
  const salaryTo = formatSalary(salaryRange?.to);

  const typeConfig = {
    "Full-time":  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    "Part-time":  "bg-amber-500/10 border-amber-500/20 text-amber-400",
    "Internship": "bg-violet-500/10 border-violet-500/20 text-violet-400",
    "Freelance":  "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  return (
    <>
      <div className="bg-[#131720] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600" />

        <div className="p-6 sm:p-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-start gap-5 flex-1 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                {companyLogo
                  ? <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-1.5" />
                  : <span className="text-2xl font-bold text-gray-500">{companyName.charAt(0)}</span>
                }
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{title}</h1>
                <p className="text-gray-400 font-medium mt-1">{companyName}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {type && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeConfig[type] || "bg-[#0D0F12]0/10 border-gray-500/20 text-gray-400"}`}>{type}</span>}
                  {workMode && <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-indigo-500/10 border-indigo-500/20 text-indigo-400">{workMode}</span>}
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Posted {getTimeAgo()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-2">
            {experience && (
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm font-medium text-gray-400">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {experience} yrs experience
              </span>
            )}
            {salaryFrom && salaryTo && (
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm font-medium text-emerald-400">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ₹{salaryFrom} – ₹{salaryTo}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm font-medium text-gray-400">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {location}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Openings", value: numberOfOpenings || 0, icon: "🎯" },
              { label: "Applicants", value: numberOfApplicants || 0, icon: "👥" },
              { label: "Posted", value: getTimeAgo(), icon: "📅" },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                <p className="text-base">{s.icon}</p>
                <p className="text-sm font-bold text-white mt-1">{s.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── SALARY ESTIMATOR ── */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">💰</span>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI Salary Estimate</p>
              {salaryLoading && <div className="w-3 h-3 border border-gray-600 border-t-indigo-400 rounded-full animate-spin ml-auto" />}
            </div>
            {salaryData ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Low", value: formatCurrency(salaryData.low, salaryData.currency), color: "text-amber-400" },
                    { label: "Mid", value: formatCurrency(salaryData.mid, salaryData.currency), color: "text-indigo-400" },
                    { label: "High", value: formatCurrency(salaryData.high, salaryData.currency), color: "text-emerald-400" },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-2.5 bg-white/[0.03] border border-white/5 rounded-xl">
                      <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 italic">{salaryData.context}</p>
                {salaryData.salaryTips?.length > 0 && (
                  <div className="space-y-1">
                    {salaryData.salaryTips.map((tip, i) => (
                      <p key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="text-indigo-400 shrink-0">→</span>{tip}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : !salaryLoading ? (
              <p className="text-xs text-gray-600">Could not estimate salary for this role.</p>
            ) : null}
          </div>

          {/* ── SKILL GAP (candidates only) ── */}
          {isJobSeeker && skillGap && (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚡</span>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Skill Gap Analysis</p>
              </div>
              {skillGap.matched?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">You have ({skillGap.matched.length}/{skills?.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGap.matched.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {skillGap.missing?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Missing ({skillGap.missing.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGap.missing.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={saveJob} disabled={!isJobSeeker || saving || saved}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                saved ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                : isJobSeeker ? "border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 bg-transparent"
                : "border-white/10 text-gray-600 cursor-not-allowed"
              }`}>
              {saving ? <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                : <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" /></svg>}
              {saved ? "Saved" : saving ? "Saving..." : "Save Job"}
            </button>

            <button onClick={applyForJob} disabled={!isJobSeeker || applying || applied}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg ${
                applied ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 cursor-default"
                : isJobSeeker ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
              }`}>
              {applying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : applied ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Already Applied</>
                : <>Apply Now<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
            </button>
          </div>

          {/* Mock Interview button — candidates only */}
          {isJobSeeker && (
            <button
              onClick={() => navigate(`/mock-interview/${_id}`)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 font-semibold rounded-xl transition-all text-sm">
              <span>🎙️</span>
              Practice with AI Mock Interview
            </button>
          )}

          {!isJobSeeker && <p className="text-xs text-center text-gray-600">Only job seekers can apply or save jobs.</p>}
        </div>
      </div>

      <Dialogbox isOpen={dialog.isOpen} setIsOpen={(isOpen) => setDialog({ ...dialog, isOpen })}
        title={dialog.title} message={dialog.message} buttonText={dialog.buttonText} />
    </>
  );
}

export default JobDetailsCard;