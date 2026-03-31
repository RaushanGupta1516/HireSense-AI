import React from "react";

function EducationCard({ edu, setShowAddEducation, setEducationFormData }) {
  const { institution, degree, fieldOfStudy, startYear, endYear } = edu;

  const fmt = (y) => {
    if (!y) return null;
    const d = new Date(`${y}-01`);
    return d.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const start = fmt(startYear);
  const end = fmt(endYear);

  const openEditForm = () => {
    setShowAddEducation(true);
    setEducationFormData(edu);
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-150">
      <div className="flex items-start justify-between gap-4">

        {/* Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{institution}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {degree}{fieldOfStudy ? `, ${fieldOfStudy}` : ""}
            </p>
            {start && (
              <p className="text-xs text-gray-600 mt-1">
                {start}{end ? ` — ${end}` : ""}
              </p>
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
    </div>
  );
}

export default EducationCard;