import React from "react";
import SimilerJobCard from "./SimilerJobCard";

function SimilerJobsSidebar({ similarJobs = [], redirectToDetail }) {
  return (
    <div className="bg-[#131720] border border-white/5 rounded-2xl p-5 shadow-xl sticky top-24">

      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Similar Jobs</h3>
          {similarJobs.length > 0 && (
            <p className="text-xs text-gray-600">{similarJobs.length} recommendations</p>
          )}
        </div>
      </div>

      {/* ── JOB LIST ── */}
      <div className="space-y-1">
        {similarJobs.length > 0 ? (
          similarJobs.map((job) => (
            <SimilerJobCard
              key={job._id}
              job={job}
              redirectToDetail={redirectToDetail}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 text-center">No similar jobs right now</p>
          </div>
        )}
      </div>

      {/* ── FOOTER LINK ── */}
      {similarJobs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <a
            href="/jobs"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
          >
            Browse all jobs
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default SimilerJobsSidebar;