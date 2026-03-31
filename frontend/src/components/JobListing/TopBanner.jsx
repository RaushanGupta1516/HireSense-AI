import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contentService } from "../../services/contentService";

// ── REAL JOBS MOCKUP ──
function JobMockup({ jobs, loading }) {
  const navigate = useNavigate();

  const typeColor = {
    "Full-time":  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    "Part-time":  "bg-amber-500/10 border-amber-500/20 text-amber-400",
    "Internship": "bg-violet-500/10 border-violet-500/20 text-violet-400",
    "Freelance":  "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "Remote":     "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  };

  const formatSalary = (num) => {
    if (!num) return null;
    if (num >= 100000) return (num / 100000).toFixed(0) + "L";
    return num.toLocaleString();
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="relative space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1C2030] border border-white/10 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                  <div className="h-2 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.slice(0, 3).map((job, i) => {
            const companyName = job.employer?.userProfile?.companyName || "Company";
            const companyLogo = job.employer?.userProfile?.companyLogo;
            const salaryFrom = formatSalary(job.salaryRange?.from);
            const salaryTo = formatSalary(job.salaryRange?.to);
            const color = typeColor[job.type] || typeColor["Full-time"];

            return (
              <div
                key={job._id || i}
                onClick={() => navigate(`/job/${job._id}`)}
                className="bg-[#1C2030] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {companyLogo
                      ? <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-1" />
                      : <span className="text-sm font-bold text-gray-400">{companyName[0]}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight line-clamp-1">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {companyName}{salaryFrom && salaryTo ? ` · ₹${salaryFrom}–${salaryTo}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>
                    {job.type}
                  </span>
                  {job.location && (
                    <span className="text-xs text-gray-500">{job.location}</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#1C2030] border border-white/10 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-500">No jobs posted yet</p>
          </div>
        )}

        {/* Footer badge */}
        <div
          onClick={() => navigate("/jobs")}
          className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl cursor-pointer hover:bg-indigo-600/20 transition-colors"
        >
          <span className="text-sm">💼</span>
          <span className="text-xs font-semibold text-indigo-400">
            {jobs.length > 0 ? `View all ${jobs.length}+ jobs →` : "Browse all jobs →"}
          </span>
        </div>
      </div>
    </div>
  );
}

function TopBanner() {
  const [visible, setVisible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await contentService.getJobs({ search: "", datePosted: "", experience: 30, salaryRange: { from: 0, to: 10000000000 }, jobTypes: [], workMode: [], location: "" });
        if (res?.jobs) setJobs(res.jobs);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const stats = [
    { value: "10K+", label: "Jobs Posted" },
    { value: "5K+",  label: "Companies" },
    { value: "20K+", label: "Candidates" },
    { value: "92%",  label: "Placement Rate" },
  ];

  return (
    <div className="relative overflow-hidden bg-[#131720] border border-white/5 rounded-2xl px-6 md:px-12 py-10 md:py-12 shadow-xl">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">

        {/* Text side */}
        <div className={`max-w-lg transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-indigo-400">AI-Powered Job Matching</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              dream job
            </span>
          </h2>

          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            Discover opportunities matched to your skills by AI.
            Apply in minutes — not hours.
          </p>

          <div className="grid grid-cols-4 gap-4 mt-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real jobs side */}
        <div className={`hidden md:block transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <JobMockup jobs={jobs} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default TopBanner;