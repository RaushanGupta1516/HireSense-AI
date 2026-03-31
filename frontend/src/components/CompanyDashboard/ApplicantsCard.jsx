import React, { useState } from "react";
import { companyService } from "../../services/companyService";
import { useNavigate } from "react-router-dom";
import aiService from "../../services/aiService";

function ApplicantsCard({ data, fetchApplications, rankData }) {
  const { applicantProfile, jobDetails } = data;
  const {
    profilePicture, name, bio, skills, education,
    workExperience, yearsOfExperience, resume, socialProfiles,
  } = applicantProfile?.userProfile || {};

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const isShortlisted = data?.isShortlisted;

  // ── AI States ──
  const [screening, setScreening] = useState(false);
  const [screenResult, setScreenResult] = useState(null);
  const [kitLoading, setKitLoading] = useState(false);
  const [interviewKit, setInterviewKit] = useState(null);
  const [showKit, setShowKit] = useState(false);

  // ── HELPERS ──
  const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  const calcDuration = (s, e) => {
    const diff = new Date(e) - new Date(s);
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const y = Math.floor(months / 12);
    const m = months % 12;
    return y > 0 ? `${y}y ${m}m` : `${m}m`;
  };

  // ── AI RESUME SCREENER ──
  const handleAiScreen = async () => {
    setScreening(true);
    try {
      const resumeText = [
        "Name: " + (name || ""),
        "Bio: " + (bio || ""),
        "Skills: " + (skills?.join(", ") || ""),
        "Experience: " + (yearsOfExperience || 0) + " years",
        "Work History: " + (workExperience?.map(w => w.jobTitle + " at " + w.company?.name).join(", ") || ""),
        "Education: " + (education?.map(e => e.degree + " from " + e.institution).join(", ") || ""),
      ].join("\n");

      const result = await aiService.screenResume({
        resumeText,
        jobId: jobDetails._id,
      });
      setScreenResult(result);
    } catch (err) {
      console.error("Screen failed:", err);
    } finally {
      setScreening(false);
    }
  };

  // ── INTERVIEW KIT ──
  const handleInterviewKit = async () => {
    setKitLoading(true);
    try {
      const result = await aiService.generateInterviewKit({
        candidateId: applicantProfile._id,
        jobId: jobDetails._id,
      });
      setInterviewKit(result);
      setShowKit(true);
    } catch (err) {
      console.error("Interview kit failed:", err);
    } finally {
      setKitLoading(false);
    }
  };

  // ── ACTIONS ──
  const removeApplicant = async () => {
    setActionLoading("remove");
    try {
      await companyService.removeApplication({ jobId: jobDetails._id, applicantId: applicantProfile._id });
      fetchApplications();
    } catch (e) { console.log(e); } finally { setActionLoading(null); }
  };

  const shortlistCandidate = async () => {
    setActionLoading("shortlist");
    try {
      await companyService.shortlistCandidate({ jobId: jobDetails._id, applicantId: applicantProfile._id });
      fetchApplications();
    } catch (e) { console.log(e); } finally { setActionLoading(null); }
  };

  const removeShortlistedCandidate = async () => {
    setActionLoading("unshortlist");
    try {
      await companyService.removeFromShortlist({ jobId: jobDetails._id, applicantId: applicantProfile._id });
      fetchApplications();
    } catch (e) { console.log(e); } finally { setActionLoading(null); }
  };

  // ── SCORE COLOR ──
  const score = screenResult?.overallScore || rankData?.fitScore;
  const scoreColor = score >= 85 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : score >= 70 ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  const recColor = {
    HIRE: "text-emerald-400", MAYBE: "text-amber-400", PASS: "text-red-400",
    STRONG_HIRE: "text-emerald-400",
  };

  return (
    <div className={`bg-[#131720] border rounded-2xl transition-all duration-200 overflow-hidden ${
      isShortlisted ? "border-emerald-500/20 shadow-emerald-900/20 shadow-lg" : "border-white/5 hover:border-white/10"
    }`}>

      {/* Shortlisted banner */}
      {isShortlisted && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-2 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-semibold text-emerald-400">Shortlisted Candidate</span>
        </div>
      )}

      {/* Rank banner */}
      {rankData && (
        <div className="bg-indigo-500/5 border-b border-indigo-500/20 px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400">🧠 AI Rank #{rankData.rank}</span>
            <span className={`text-xs font-semibold ${recColor[rankData.recommendation] || "text-gray-400"}`}>
              {rankData.recommendation?.replace("_", " ")}
            </span>
          </div>
          <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${scoreColor}`}>
            {rankData.fitScore}% Fit
          </span>
        </div>
      )}

      <div className="p-5 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profilePicture || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"}
                alt={name} className="w-14 h-14 rounded-xl object-cover border border-white/10"
              />
              {isShortlisted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#131720] flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">{name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{yearsOfExperience || 0} yrs experience</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  {jobDetails?.title}
                </span>
                {score && (
                  <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${scoreColor}`}>
                    🧠 {score}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {socialProfiles?.linkedin && (
              <a href={socialProfiles.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {resume && (
              <a href={resume} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </a>
            )}
            <button onClick={() => navigate(`/user/${applicantProfile._id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </div>
        </div>

        {/* AI Screen Result */}
        {screenResult && (
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-indigo-400">🧠 AI Assessment</p>
              <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${scoreColor}`}>
                {screenResult.overallScore}% — {screenResult.recommendation}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{screenResult.summary}</p>
            {screenResult.strengths?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1.5">Strengths</p>
                <div className="flex flex-wrap gap-1.5">
                  {screenResult.strengths.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {screenResult.redFlags?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1.5">Red Flags</p>
                <div className="flex flex-wrap gap-1.5">
                  {screenResult.redFlags.map((f, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">{f}</span>
                  ))}
                </div>
              </div>
            )}
            {screenResult.missingSkills?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1.5">Missing Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {screenResult.missingSkills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interview Kit */}
        {showKit && interviewKit && (
          <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-violet-400">🎤 Interview Kit</p>
              <button onClick={() => setShowKit(false)} className="text-gray-600 hover:text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {["technicalQuestions", "behaviouralQuestions", "redFlagQuestions"].map((type) => (
              interviewKit[type]?.length > 0 && (
                <div key={type}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {type === "technicalQuestions" ? "Technical" : type === "behaviouralQuestions" ? "Behavioural" : "Red Flag"}
                  </p>
                  <div className="space-y-2">
                    {interviewKit[type].map((q, i) => (
                      <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <p className="text-sm text-white font-medium">{q.question}</p>
                        <p className="text-xs text-gray-500 mt-1">Purpose: {q.purpose}</p>
                        {q.idealAnswer && <p className="text-xs text-indigo-400 mt-1">Look for: {q.idealAnswer}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Bio */}
        {bio && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">About</p>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{bio}</p>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 8).map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs font-medium rounded-lg hover:border-indigo-500/30 hover:text-indigo-400 transition-colors">
                  {skill}
                </span>
              ))}
              {skills.length > 8 && (
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-500 text-xs rounded-lg">+{skills.length - 8}</span>
              )}
            </div>
          </div>
        )}

        {/* Expandable */}
        {(workExperience?.length > 0 || education?.length > 0) && (
          <div>
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {expanded ? "Hide" : "Show"} Experience & Education
            </button>

            {expanded && (
              <div className="mt-4 space-y-5">
                {workExperience?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Experience</p>
                    <div className="space-y-3">
                      {workExperience.map((exp, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-gray-400">{exp.company?.name?.[0] || "?"}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{exp.jobTitle}</p>
                            <p className="text-xs text-gray-500">{exp.company?.name}</p>
                            {exp.startMonth && exp.endMonth && (
                              <p className="text-xs text-gray-600 mt-0.5">
                                {formatDate(exp.startMonth)} — {formatDate(exp.endMonth)} · {calcDuration(exp.startMonth, exp.endMonth)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {education?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Education</p>
                    <div className="space-y-3">
                      {education.map((edu, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</p>
                            <p className="text-xs text-gray-500">{edu.institution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-white/5" />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* AI Screen */}
            <button onClick={handleAiScreen} disabled={screening || !!screenResult}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {screening ? <><div className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />Analyzing...</>
                : screenResult ? <><span>🧠</span>Screened</>
                : <><span>🧠</span>AI Screen</>}
            </button>

            {/* Interview Kit */}
            <button onClick={handleInterviewKit} disabled={kitLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all disabled:opacity-50">
              {kitLoading ? <><div className="w-3 h-3 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />Generating...</>
                : <><span>🎤</span>{showKit ? "Hide Kit" : "Interview Kit"}</>}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isShortlisted ? (
              <button onClick={removeShortlistedCandidate} disabled={actionLoading === "unshortlist"}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50">
                {actionLoading === "unshortlist" ? <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : "Remove Shortlist"}
              </button>
            ) : (
              <>
                <button onClick={removeApplicant} disabled={actionLoading === "remove"}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50">
                  {actionLoading === "remove" ? <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : "Not Interested"}
                </button>
                <button onClick={shortlistCandidate} disabled={actionLoading === "shortlist"}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
                  {actionLoading === "shortlist"
                    ? <div className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Shortlist</>}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantsCard;