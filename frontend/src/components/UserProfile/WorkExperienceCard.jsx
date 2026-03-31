import React, { useState } from "react";

function WorkExperienceCard({ exp, setShowAddWorkExperience, setWorkExperienceFormData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { jobTitle, company, startMonth, endMonth, description } = exp;

  const fmt = (d) =>
    d
      ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(d))
      : null;

  const start = fmt(startMonth);
  const end = fmt(endMonth) || "Present";

  const getDuration = () => {
    if (!startMonth) return null;
    const s = new Date(startMonth);
    const e = endMonth ? new Date(endMonth) : new Date();
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const y = Math.floor(months / 12);
    const m = months % 12;
    return y > 0 ? `${y}y ${m}m` : `${m}m`;
  };

  const openEditForm = () => {
    setShowAddWorkExperience(true);
    setWorkExperienceFormData(exp);
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-150">
      <div className="flex items-start justify-between gap-4">

        {/* Logo + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 overflow-hidden shrink-0 flex items-center justify-center">
            {company?.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-0.5" />
            ) : (
              <span className="text-sm font-bold text-gray-500">{company?.name?.charAt(0) || "?"}</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{company?.name}</p>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">{jobTitle}</p>
            {start && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">{start} — {end}</p>
                {getDuration() && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-600">{getDuration()}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit */}
        <button
          onClick={openEditForm}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold rounded-lg transition-all duration-150 shrink-0"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-3 ml-13 pl-[52px]">
          <p className={`text-xs text-gray-500 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
            {description.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkExperienceCard;