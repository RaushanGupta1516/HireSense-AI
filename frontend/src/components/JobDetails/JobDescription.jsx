import React, { useState } from "react";

// ── INLINE DARK PROSE STYLES ──
// Replaces JobDescription.module.css entirely
const proseStyles = `
  .jd-prose { color: #9CA3AF; font-size: 0.875rem; line-height: 1.75; }
  .jd-prose h1, .jd-prose h2, .jd-prose h3, .jd-prose h4 {
    color: #F9FAFB; font-weight: 600; margin: 1.25rem 0 0.5rem;
  }
  .jd-prose h1 { font-size: 1.25rem; }
  .jd-prose h2 { font-size: 1.125rem; }
  .jd-prose h3 { font-size: 1rem; }
  .jd-prose p { margin: 0.75rem 0; }
  .jd-prose ul, .jd-prose ol {
    margin: 0.75rem 0; padding-left: 1.5rem;
  }
  .jd-prose ul { list-style-type: disc; }
  .jd-prose ol { list-style-type: decimal; }
  .jd-prose li { margin: 0.35rem 0; color: #9CA3AF; }
  .jd-prose li::marker { color: #6366F1; }
  .jd-prose strong, .jd-prose b { color: #E5E7EB; font-weight: 600; }
  .jd-prose em { color: #C4B5FD; font-style: italic; }
  .jd-prose a { color: #818CF8; text-decoration: underline; }
  .jd-prose a:hover { color: #A5B4FC; }
  .jd-prose blockquote {
    border-left: 3px solid #4F46E5; padding-left: 1rem;
    color: #6B7280; margin: 1rem 0; font-style: italic;
  }
  .jd-prose code {
    background: rgba(99,102,241,0.1); color: #A5B4FC;
    padding: 0.125rem 0.375rem; border-radius: 0.375rem;
    font-size: 0.8rem; font-family: monospace;
  }
  .jd-prose pre {
    background: #1C2030; border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0.75rem; padding: 1rem; overflow-x: auto; margin: 1rem 0;
  }
  .jd-prose pre code { background: none; padding: 0; }
  .jd-prose hr {
    border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 1.5rem 0;
  }
  .jd-prose table {
    width: 100%; border-collapse: collapse; margin: 1rem 0;
  }
  .jd-prose th {
    background: rgba(255,255,255,0.04); color: #E5E7EB;
    padding: 0.5rem 0.75rem; text-align: left; font-weight: 600;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .jd-prose td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
`;

function JobDescription({ jobData }) {
  const { description, skills, responsibilities, requirements } = jobData;
  const [expanded, setExpanded] = useState(false);

  const isLong = description && description.length > 1800;
  const displayDescription =
    isLong && !expanded ? description.slice(0, 1800) + "..." : description;

  return (
    <>
      {/* Inject prose styles once */}
      <style>{proseStyles}</style>

      <div className="bg-[#131720] border border-white/5 rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">

        {/* ── JOB DESCRIPTION ── */}
        {description && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Job Description</h3>
            </div>

            <div
              className="jd-prose"
              dangerouslySetInnerHTML={{ __html: displayDescription }}
            />

            {/* Read more / less */}
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
              >
                {expanded ? (
                  <>
                    Show less
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Read full description
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </section>
        )}

        {/* ── RESPONSIBILITIES ── */}
        {responsibilities?.length > 0 && (
          <>
            <div className="border-t border-white/5" />
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">Responsibilities</h3>
              </div>
              <ul className="space-y-2.5">
                {responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="text-indigo-500 mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* ── REQUIREMENTS ── */}
        {requirements?.length > 0 && (
          <>
            <div className="border-t border-white/5" />
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">Requirements</h3>
              </div>
              <ul className="space-y-2.5">
                {requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* ── SKILLS ── */}
        {skills?.length > 0 && (
          <>
            <div className="border-t border-white/5" />
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">Key Skills</h3>
                <span className="text-xs text-gray-600 font-medium">{skills.length} required</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 bg-white/[0.04] border border-white/10 text-gray-400 text-xs font-medium rounded-xl hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all duration-150 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </>
  );
}

export default JobDescription;