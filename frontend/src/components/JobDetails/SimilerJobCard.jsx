import React from "react";

function SimilarJobCard({ job, redirectToDetail }) {
  const { title, location, employer, datePosted, type, salaryRange, _id } = job;

  const companyName = employer?.userProfile?.companyName || "Company";
  const companyLogo = employer?.userProfile?.companyLogo;

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

  const formatSalary = (num) => {
    if (!num) return null;
    if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(1) + "L";
    return num.toLocaleString();
  };

  const salaryFrom = formatSalary(salaryRange?.from);
  const salaryTo = formatSalary(salaryRange?.to);

  const typeColors = {
    "Full-time":  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "Part-time":  "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "Internship": "text-violet-400 bg-violet-500/10 border-violet-500/20",
    "Freelance":  "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div
      onClick={() => redirectToDetail(_id)}
      className="group flex items-start gap-3 p-3 rounded-xl border border-white/[0.03] hover:border-indigo-500/20 hover:bg-white/[0.03] transition-all duration-150 cursor-pointer"
    >
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
        {companyLogo ? (
          <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-sm font-bold text-gray-500">{companyName.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-300 group-hover:text-indigo-400 transition-colors duration-150 truncate">
          {title}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">{companyName}</p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {location && (
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {location}
            </span>
          )}
          {type && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeColors[type] || "text-gray-400 bg-white/5 border-white/10"}`}>
              {type}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {salaryFrom && salaryTo ? (
            <span className="text-xs font-medium text-emerald-400">₹{salaryFrom} – ₹{salaryTo}</span>
          ) : <span />}
          <span className="text-xs text-gray-600">{getTimeAgo()}</span>
        </div>
      </div>
    </div>
  );
}

export default SimilarJobCard;