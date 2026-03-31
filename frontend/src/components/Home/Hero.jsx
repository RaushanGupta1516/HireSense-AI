import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ── ANIMATED COUNTER ──
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: "🧠", label: "AI Resume Screening" },
  { icon: "🎯", label: "Smart Job Matching" },
  { icon: "📊", label: "Candidate Scoring" },
  { icon: "⚡", label: "10x Faster Hiring" },
];

const stats = [
  { value: 50000, suffix: "+", label: "Resumes Screened" },
  { value: 92, suffix: "%", label: "Match Accuracy" },
  { value: 200, suffix: "+", label: "Startups Hiring" },
  { value: 10, suffix: "x", label: "Faster Than Manual" },
];

// ── DASHBOARD MOCKUP ──
function DashboardMockup() {
  const candidates = [
    { name: "Sarah K.", role: "React Developer", score: 94, color: "bg-emerald-500", skills: ["React", "Node"] },
    { name: "Alex M.", role: "Full Stack Eng.", score: 87, color: "bg-indigo-500", skills: ["Vue", "Python"] },
    { name: "Priya S.", role: "UI/UX Designer", score: 79, color: "bg-violet-500", skills: ["Figma", "CSS"] },
    { name: "John D.", role: "DevOps Engineer", score: 71, color: "bg-amber-500", skills: ["AWS", "Docker"] },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">

      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400/20 via-violet-400/10 to-purple-400/20 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-3xl blur-2xl" />

      {/* Main dashboard card */}
      <div className="relative bg-[#131720] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-float">

        {/* Window bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-medium text-gray-400">HireSense AI — Dashboard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        <div className="p-5">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Applicants", value: "247", trend: "+12%", color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { label: "Shortlisted", value: "38", trend: "+5%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "AI Scored", value: "100%", trend: "Auto", color: "text-violet-400", bg: "bg-violet-500/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-xl p-3`}>
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-emerald-500 font-medium mt-0.5">{s.trend}</p>
              </div>
            ))}
          </div>

          {/* AI Ranked header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">AI Ranked Candidates</p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 rounded-full">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-indigo-400">AI Active</span>
            </div>
          </div>

          {/* Candidate rows */}
          <div className="space-y-2">
            {candidates.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all duration-200">
                <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4 shrink-0">#{i + 1}</span>
                <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.role}</p>
                </div>
                <div className="hidden sm:flex gap-1">
                  {c.skills.map((skill) => (
                    <span key={skill} className="px-1.5 py-0.5 bg-white/10 border border-white/10 text-gray-400 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                  c.score >= 90 ? "bg-emerald-500/10 text-emerald-400" :
                  c.score >= 80 ? "bg-indigo-500/10 text-indigo-400" :
                  "bg-amber-500/10 text-amber-400"
                }`}>
                  {c.score}%
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Screened in <span className="text-indigo-500 font-semibold">8.3s</span> by AI</p>
            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Auto-Shortlist Top 5 →
            </button>
          </div>
        </div>
      </div>

      {/* Floating card — AI Insight */}
      <div className="absolute -top-5 -right-6 bg-[#131720] rounded-2xl border border-white/10 shadow-xl p-3.5 w-48 animate-fadeInUp hidden sm:block" style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs">🧠</div>
          <p className="text-xs font-semibold text-white">AI Insight</p>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Sarah K. is <span className="text-emerald-500 font-semibold">94% match</span> for your React role.
        </p>
      </div>

      {/* Floating card — Time saved */}
      <div className="absolute -bottom-5 -left-6 bg-[#131720] rounded-2xl border border-white/10 shadow-xl p-3.5 w-44 animate-fadeInUp hidden sm:block" style={{ animationDelay: "1s", animationFillMode: "backwards" }}>
        <p className="text-xs text-gray-400 mb-1">Time saved today</p>
        <p className="text-2xl font-bold text-white">14.5 <span className="text-sm font-medium text-gray-400">hrs</span></p>
        <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          vs manual screening
        </p>
      </div>
    </div>
  );
}

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0D0F12]">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100 dark:bg-indigo-950/40 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-100 dark:bg-violet-950/30 rounded-full blur-[100px] opacity-50" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col lg:flex-row items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20 gap-16 lg:gap-12">

        {/* Left */}
        <div className="flex-1 flex flex-col gap-7 max-w-xl">

          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-indigo-400">AI-Powered Hiring Platform</span>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.06] tracking-tight text-white">
              Hire Smarter.
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Not Harder.
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" fill="none">
                  <path d="M2 8C50 3 100 1 150 2.5C200 4 250 7 298 5" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </div>

          <p className={`text-lg sm:text-xl text-gray-400 leading-relaxed transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            HireSense AI screens 200 resumes in 10 seconds, scores every candidate, and surfaces your best hire — automatically.
          </p>

          <div className={`flex flex-wrap gap-2 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-400 transition-all duration-150 cursor-default">
                <span>{f.icon}</span>
                <span className="font-medium">{f.label}</span>
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                Start Hiring Free
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <button className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Browse Jobs
              </button>
            </Link>
          </div>

          <div className={`flex items-center gap-4 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="flex -space-x-2">
              {["?img=1","?img=2","?img=3","?img=4"].map((q, i) => (
                <img key={i} src={`https://i.pravatar.cc/32${q}`} alt="user" className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0D0F12] object-cover" />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Loved by <span className="font-semibold text-gray-300">2,000+</span> recruiters
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={`flex-1 w-full flex items-center justify-center transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
          <DashboardMockup />
        </div>
      </div>

      {/* Stats bar */}
      <div className={`relative w-full border-t border-white/5 bg-white/[0.02] transition-all duration-700 delay-700 ${visible ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-400 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;