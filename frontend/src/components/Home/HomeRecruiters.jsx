import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    color: "bg-indigo-500/10 text-indigo-400", border: "border-indigo-500/20",
    title: "AI Candidate Ranking",
    description: "Automatically rank every applicant by fit score. Stop reading 200 resumes — see your top 5 in seconds.",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    color: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/20",
    title: "AI Resume Screener",
    description: "Get instant AI-powered resume analysis with scores, strengths, red flags and missing skills — per candidate.",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    color: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20",
    title: "AI Recruiter Chat",
    description: "Ask your AI assistant anything — 'Who is best for this role?' or 'Generate interview questions for Sarah' — instantly.",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    color: "bg-amber-500/10 text-amber-400", border: "border-amber-500/20",
    title: "Natural Language Candidate Search",
    description: "Type 'React developer with 3+ years and MongoDB experience' — AI searches your entire candidate pool instantly.",
  },
];

const stages = [
  { label: "Applied", color: "bg-white/5 text-gray-400", dot: "bg-gray-400", count: 247 },
  { label: "Screened", color: "bg-indigo-500/10 text-indigo-400", dot: "bg-indigo-500", count: 89 },
  { label: "Interview", color: "bg-amber-500/10 text-amber-400", dot: "bg-amber-500", count: 24 },
  { label: "Offer", color: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500", count: 6 },
];

function RecruiterMockup() {
  const candidates = [
    { name: "Sarah K.", role: "3 yrs exp", score: 94, avatar: "S", color: "bg-emerald-500", status: "Interview", statusColor: "bg-amber-500/10 text-amber-400" },
    { name: "Alex M.", role: "5 yrs exp", score: 88, avatar: "A", color: "bg-indigo-500", status: "Screened", statusColor: "bg-indigo-500/10 text-indigo-400" },
    { name: "Priya S.", role: "2 yrs exp", score: 76, avatar: "P", color: "bg-violet-500", status: "Applied", statusColor: "bg-white/5 text-gray-400" },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-br from-violet-400/15 to-indigo-400/10 rounded-3xl blur-2xl" />
      <div className="relative bg-[#131720] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-medium text-gray-400">Recruiter Dashboard</span>
          </div>
          <span className="text-xs text-indigo-400 font-medium">React Developer Role</span>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Hiring Pipeline</p>
            <div className="grid grid-cols-4 gap-2">
              {stages.map((stage, i) => (
                <div key={i} className={`${stage.color} rounded-xl p-3 text-center`}>
                  <p className="text-lg font-bold">{stage.count}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                    <p className="text-xs font-medium">{stage.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI Ranked</p>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs text-indigo-400 font-medium">Auto-ranked</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {candidates.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all duration-200">
                  <span className="text-xs font-bold text-gray-600 w-4 shrink-0">#{i + 1}</span>
                  <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{c.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${c.statusColor} shrink-0`}>{c.status}</span>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${c.score >= 90 ? "bg-emerald-500/10 text-emerald-400" : c.score >= 80 ? "bg-indigo-500/10 text-indigo-400" : "bg-amber-500/10 text-amber-400"}`}>{c.score}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[{ icon: "✍️", label: "Generate JD", sub: "AI writes job description" }, { icon: "🎤", label: "Interview Kit", sub: "AI generates questions" }].map((tool, i) => (
              <div key={i} className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 cursor-pointer hover:border-indigo-500/40 transition-all duration-150">
                <span className="text-lg">{tool.icon}</span>
                <p className="text-xs font-semibold text-white mt-1">{tool.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tool.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gray-400"><span className="text-indigo-400 font-semibold">14.5 hrs</span> saved this week</p>
            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Auto-Shortlist Top 5 →</button>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -left-4 bg-[#131720] border border-white/10 shadow-xl rounded-2xl p-3 animate-bounceSoft">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm">🧠</div>
          <div>
            <p className="text-xs font-semibold text-white">AI Assistant</p>
            <p className="text-xs text-emerald-400 font-medium">Ready to help</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeRecruiters() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0D0F12] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] bg-violet-950/20 rounded-full blur-[100px] opacity-70" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className={`flex-1 flex flex-col gap-8 transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full w-fit">
              <span className="w-2 h-2 bg-violet-500 rounded-full" />
              <span className="text-sm font-semibold text-violet-400 uppercase tracking-wide">For Recruiters</span>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
                Hire faster with{" "}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">AI-powered</span>
                <br />candidate insights
              </h2>
              <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                Stop drowning in applications. HireSense AI ranks every candidate, summarizes every resume, and tells you exactly who to interview — in seconds.
              </p>
            </div>
            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 cursor-default group ${f.border}`}
                  style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: `all 0.5s ease ${i * 80 + 200}ms` }}>
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center shrink-0 border ${f.border} group-hover:scale-110 transition-transform duration-200`}>{f.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/signup" className="w-full sm:w-auto">
                <button className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                  Start Hiring Free
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </Link>
              <Link to="/dashboard/home" className="w-full sm:w-auto">
                <button className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5">
                  View Dashboard
                </button>
              </Link>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              No setup fees. Cancel anytime. 14-day free trial included.
            </p>
          </div>
          <div className={`flex-1 w-full flex justify-center transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <RecruiterMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeRecruiters;