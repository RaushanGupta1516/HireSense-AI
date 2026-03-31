import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { companyService } from "../../services/companyService";
import aiService from "../../services/aiService";

// ── STAT CARD ──
function StatCard({ icon, label, value, color, bg, loading }) {
  return (
    <div className="relative flex items-center gap-4 p-5 bg-[#131720] rounded-2xl border border-white/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${bg} opacity-10 -translate-y-6 translate-x-6`} />
      <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[1,2,3,4,5].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-300">No job listings yet</p>
            <p className="text-xs text-gray-400 mt-1">Post your first job to start receiving applications</p>
          </div>
          <Link to="/dashboard/post-job">
            <button className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all">
              Post a Job
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}

// ── AI RECRUITER CHAT ──
function AIChat({ jobs, applicants, onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI recruiting assistant. Ask me anything about your candidates, jobs, or hiring pipeline." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggestions = [
    "Who is the best candidate for my React role?",
    "How many applications do I have?",
    "Generate interview questions for a full stack developer",
    "Which jobs are getting the most applicants?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const context = {
        jobs: jobs.map((j) => ({ title: j.title, applicants: j.applicants?.length || 0, active: j.active })),
        totalApplicants: applicants.length,
        shortlisted: applicants.filter((a) => a.isShortlisted).length,
      };
      const reply = await aiService.chat(q, context);
      const replyText = typeof reply === "string" ? reply : reply?.reply || "Sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { role: "ai", text: replyText }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-[#131720] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden" style={{ maxHeight: "500px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-indigo-600/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">🤖</div>
          <div>
            <p className="text-xs font-bold text-white">AI Recruiter</p>
            <p className="text-xs text-indigo-400">Always online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
              m.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl rounded-bl-sm flex gap-1">
              {[0,1,2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:border-indigo-500/30 hover:text-indigo-400 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 transition-all"
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ──
function Dashboard() {
  const [jobData, setJobData] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobs, apps] = await Promise.all([
        companyService.getCompanyJobListings(),
        companyService.getAllApplications(),
      ]);
      setJobData(jobs);
      setApplicants(apps);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobData.filter((j) => j.active);
  const closedJobs = jobData.filter((j) => !j.active);

  const filteredJobs = jobData.filter((job) => {
    const matchSearch = job.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "active" ? job.active : !job.active;
    return matchSearch && matchFilter;
  });

  const stats = [
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: "Total Job Listings", value: loading ? "—" : jobData.length,
      color: "text-indigo-400", bg: "bg-indigo-500/20",
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: "Total Applications", value: loading ? "—" : applicants.length,
      color: "text-emerald-400", bg: "bg-emerald-500/20",
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      label: "Active Jobs", value: loading ? "—" : activeJobs.length,
      color: "text-violet-400", bg: "bg-violet-500/20",
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
      label: "Closed Jobs", value: loading ? "—" : closedJobs.length,
      color: "text-amber-400", bg: "bg-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F12] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Recruiter Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your job listings and track applications</p>
          </div>
          <Link to="/dashboard/post-job">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Post a Job
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={i} {...s} loading={loading} />)}
        </div>

        {/* AI Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "✍️", title: "Generate Job Description", sub: "AI writes a full JD in seconds", border: "border-indigo-500/20", bg: "bg-indigo-500/5", path: "/dashboard/post-job" },
            { icon: "🧠", title: "AI Resume Screening", sub: "Rank all applicants automatically", border: "border-emerald-500/20", bg: "bg-emerald-500/5", path: "/dashboard/applications" },
            { icon: "🔍", title: "AI Candidate Search", sub: "Search candidates in natural language", border: "border-violet-500/20", bg: "bg-violet-500/5", path: "/dashboard/candidate-search" },
          ].map((tool, i) => (
            <Link to={tool.path} key={i}>
              <div className={`flex items-center gap-4 p-4 rounded-2xl ${tool.bg} border ${tool.border} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group`}>
                <div className="text-2xl">{tool.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{tool.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tool.sub}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Job Listings Table */}
        <div className="bg-[#131720] rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-white/5">
            <div>
              <h2 className="text-base font-semibold text-white">Job Listings</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filteredJobs.length} jobs found</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 transition-all w-48 text-gray-300 placeholder-gray-600" />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl outline-none text-gray-300 cursor-pointer">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Closed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Job Title","Applications","Status","Posted","Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                  : filteredJobs.length === 0 ? <EmptyState />
                  : filteredJobs.map((job, i) => (
                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{job.title}</p>
                            <p className="text-xs text-gray-400">{job.location || "Remote"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{job?.applicants?.length || 0}</span>
                          <span className="text-xs text-gray-400">applicants</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${job.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-gray-400 border-white/10"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${job.active ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {job.active ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-400">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/job/${job._id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition-all">
                            View Job
                          </button>
                          <Link to="/dashboard/applications">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all">
                              Applicants
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredJobs.length > 0 && (
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-300">{filteredJobs.length}</span> of <span className="font-semibold text-gray-300">{jobData.length}</span> jobs</p>
              <Link to="/dashboard/post-job"><button className="text-xs font-semibold text-indigo-400 hover:underline">+ Post New Job</button></Link>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat */}
      {chatOpen && <AIChat jobs={jobData} applicants={applicants} onClose={() => setChatOpen(false)} />}

      {/* Floating chat button */}
      <button onClick={() => setChatOpen(!chatOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-200 z-40 ${
          chatOpen ? "bg-gray-700 rotate-12" : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1"
        }`}>
        {chatOpen ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />🤖</svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>
    </div>
  );
}

export default Dashboard;