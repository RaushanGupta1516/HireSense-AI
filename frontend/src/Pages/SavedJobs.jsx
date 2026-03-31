import React, { useEffect, useState } from "react";
import { contentService } from "../services/contentService";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";

function SavedJobs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await contentService.getSavedJobs();
      setData(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const removeJob = async (e, id) => {
    e.stopPropagation();
    setRemoving(id);
    try {
      await userService.removeSavedJob(id);
      fetchData();
    } catch (err) {
      console.log(err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">Jobs you've bookmarked for later</p>
          </div>
          {!loading && data.length > 0 && (
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-400">
              {data.length} saved
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#131720] border border-white/5 rounded-2xl p-5 animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
                <div className="w-20 h-9 bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-3">
            {data.map((job, i) => (
              <div key={i}
                onClick={() => navigate(`/job/${job._id}`)}
                className="bg-[#131720] border border-white/5 hover:border-indigo-500/20 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 group hover:shadow-lg hover:shadow-black/30"
              >
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                  {job?.employer?.userProfile?.companyLogo
                    ? <img src={job.employer.userProfile.companyLogo} alt={job.employer.userProfile.companyName} className="w-full h-full object-contain p-1" />
                    : <span className="text-lg font-bold text-gray-500">{job?.employer?.userProfile?.companyName?.charAt(0)}</span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{job.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{job?.employer?.userProfile?.companyName}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {job.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location}
                      </span>
                    )}
                    {job.salaryRange && (
                      <span className="text-xs font-semibold text-emerald-400">
                        ₹{job.salaryRange.from}–{job.salaryRange.to} LPA
                      </span>
                    )}
                    {job.type && (
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs font-medium text-indigo-400">
                        {job.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={(e) => removeJob(e, job._id)}
                  disabled={removing === job._id}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-gray-500 text-xs font-semibold rounded-xl transition-all duration-150 disabled:opacity-50"
                >
                  {removing === job._id
                    ? <div className="w-3 h-3 border-2 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
                    : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                  }
                  {removing === job._id ? "" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-gray-400 font-semibold">No saved jobs yet</p>
            <p className="text-gray-600 text-sm mt-1">Bookmark jobs while browsing to find them here</p>
            <button onClick={() => navigate("/jobs")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Browse Jobs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;