import React, { useEffect, useState, useRef } from "react";
import { userService } from "../../services/userService";
import { useSelector, useDispatch } from "react-redux";
import useUpdateUserData from "../../hooks/useUpdateUserData";
import { updateUser } from "../../store/authSlice";

function UpdateResume() {
  const [resumeLink, setResumeLink] = useState("");
  const [resume, setResume] = useState("");
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── AI Resume Parser ──
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const fileRef = useRef(null);

  const updateUserData = useUpdateUserData();
  const { userData } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData?.userProfile?.resume) setResume(userData.userProfile.resume);
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(false);
    try {
      await userService.updateResume(resumeLink);
      updateUserData();
      setResume(resumeLink);
      setResumeLink("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };

  // ── PDF PARSER using PDF.js CDN ──
  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = async () => {
        try {
          const pdfjsLib = window.pdfjsLib;
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";

          for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map((item) => item.str).join(" ") + "\n";
          }
          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = () => reject(new Error("Failed to load PDF.js"));
      if (!window.pdfjsLib) {
        document.head.appendChild(script);
      } else {
        script.onload();
      }
    });
  };

  const handleParsePDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setParseError("Please upload a PDF file.");
      return;
    }

    setParsing(true);
    setParseResult(null);
    setParseError(null);

    try {
      const text = await extractTextFromPDF(file);
      if (!text.trim()) throw new Error("Could not extract text from PDF.");

      // Send to Groq via backend
      const response = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:8002/api/v1") + "/ai/parse-resume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ resumeText: text }),
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Parse failed");
      setParseResult(data.data);
    } catch (err) {
      setParseError(err.message || "Failed to parse resume.");
      console.error(err);
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ── Apply parsed data to profile ──
  const handleApplyToProfile = async () => {
    if (!parseResult) return;
    setApplying(true);
    try {
      const updates = {};
      if (parseResult.name) updates.name = parseResult.name;
      if (parseResult.bio) updates.bio = parseResult.bio;
      if (parseResult.primaryRole) updates.primaryRole = parseResult.primaryRole;
      if (parseResult.yearsOfExperience) updates.yearsOfExperience = parseResult.yearsOfExperience;

      await userService.updateUserProfile(updates);

      // Add only NEW skills — skip ones already in profile
      if (parseResult.skills?.length) {
        const existingSkills = (userData?.userProfile?.skills || []).map(s => s.toLowerCase());
        const newSkills = parseResult.skills
          .filter(s => !existingSkills.includes(s.toLowerCase()))
          .slice(0, 10);
        for (const skill of newSkills) {
          try { await userService.addSkill(skill); } catch {}
        }
      }

      await updateUserData();
      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">

      {/* ── AI RESUME PARSER ── */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-white">AI Resume Parser</h2>
            <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full font-semibold">NEW</span>
          </div>
          <div className="h-0.5 w-8 bg-indigo-600 rounded-full mt-1.5" />
          <p className="text-xs text-gray-500 mt-2">Upload your PDF resume and AI will extract your skills, experience, and education — then auto-fill your profile.</p>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
        >
          <input ref={fileRef} type="file" accept=".pdf" onChange={handleParsePDF} className="hidden" />
          {parsing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Parsing your resume with AI...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Click to upload PDF resume</p>
                <p className="text-xs text-gray-600 mt-1">PDF only · Max 10MB · AI will extract all info</p>
              </div>
            </div>
          )}
        </div>

        {parseError && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{parseError}</div>
        )}

        {/* Parse result */}
        {parseResult && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-indigo-400">🧠 AI Extracted Data</p>
              <button onClick={handleApplyToProfile} disabled={applying || applySuccess}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-all">
                {applying ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Applying...</>
                  : applySuccess ? <><span>✓</span>Applied!</>
                  : <><span>⚡</span>Apply to Profile</>}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {parseResult.name && (
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Name</p>
                  <p className="text-sm font-semibold text-white">{parseResult.name}</p>
                </div>
              )}
              {parseResult.primaryRole && (
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Role</p>
                  <p className="text-sm font-semibold text-white">{parseResult.primaryRole}</p>
                </div>
              )}
              {parseResult.yearsOfExperience !== undefined && (
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Experience</p>
                  <p className="text-sm font-semibold text-white">{parseResult.yearsOfExperience} years</p>
                </div>
              )}
              {parseResult.location && (
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Location</p>
                  <p className="text-sm font-semibold text-white">{parseResult.location}</p>
                </div>
              )}
            </div>

            {parseResult.skills?.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Skills detected ({parseResult.skills.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {parseResult.skills.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {parseResult.bio && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Generated Bio</p>
                <p className="text-sm text-gray-300 leading-relaxed">{parseResult.bio}</p>
              </div>
            )}

            {parseResult.education?.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Education</p>
                <div className="space-y-1.5">
                  {parseResult.education.map((e, i) => (
                    <p key={i} className="text-xs text-gray-400">• {e.degree} — {e.institution} ({e.year || ""})</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-white/5" />

      {/* ── RESUME LINK ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Resume Link</h2>
          <div className="h-0.5 w-8 bg-indigo-600 rounded-full mt-1.5" />
          <p className="text-xs text-gray-500 mt-2">Link your latest resume so recruiters can view it directly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Resume URL <span className="text-indigo-400">*</span>
            </label>
            <p className="text-xs text-gray-600">Paste a Google Drive or Dropbox link accessible to anyone.</p>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input type="url" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)}
                placeholder="https://drive.google.com/file/..." required
                className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={updating || !resumeLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
              {updating
                ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</>
                : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Update Resume</>}
            </button>
          </div>
        </form>

        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-emerald-400 font-medium">Resume updated successfully.</p>
          </div>
        )}

        {resume && (
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Resume</p>
            <a href={resume} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium break-all group-hover:underline">{resume}</span>
              <svg className="w-3.5 h-3.5 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateResume;