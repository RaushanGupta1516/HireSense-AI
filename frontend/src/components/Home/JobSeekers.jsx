import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    color: "bg-indigo-500/10 text-indigo-400", border: "border-indigo-500/20",
    title: "AI Resume Parser",
    description: "Upload your resume once. Our AI instantly extracts your skills, experience, and education — no manual entry needed.",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    color: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/20",
    title: "AI Match Score",
    description: "See your exact match percentage for every job before applying. Know your chances before you invest time.",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    color: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20",
    title: "Skill Gap Analysis",
    description: "Discover exactly which skills you're missing for your dream role and get a clear path to close those gaps.",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    color: "bg-amber-500/10 text-amber-400", border: "border-amber-500/20",
    title: "AI Mock Interview",
    description: "Practice with an AI interviewer tailored to the specific job. Get scored on every answer with improvement tips.",
  },
];

function ProfileMockup() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    let s = 0;
    const timer = setInterval(() => {
      s += 1.5;
      if (s >= 87) { setScore(87); clearInterval(timer); }
      else setScore(Math.floor(s));
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400/15 to-emerald-400/10 rounded-3xl blur-2xl" />
      <div className="relative bg-[#131720] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 pb-10 relative">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/48?img=5" alt="profile" className="w-12 h-12 rounded-xl border-2 border-white/30 object-cover" />
            <div>
              <p className="text-white font-semibold text-sm">Rahul Sharma</p>
              <p className="text-indigo-200 text-xs">Full Stack Developer</p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3 h-3 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <p className="text-indigo-200 text-xs">Bangalore, India</p>
              </div>
            </div>
          </div>
          <div className="absolute right-4 top-2 w-20 h-20 bg-white/5 rounded-full" />
          <div className="absolute right-10 top-6 w-12 h-12 bg-white/5 rounded-full" />
        </div>

        <div className="mx-4 -mt-6 bg-[#1C2030] rounded-xl border border-white/10 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400">AI Match Score</p>
              <p className="text-xs font-medium text-indigo-400">React Developer @ Stripe</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white tabular-nums">{score}%</p>
              <p className="text-xs text-emerald-400 font-medium">Strong Match</p>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-100" style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"].map((skill) => (
                <span key={skill} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-lg border border-indigo-500/20">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skill Gaps Detected</p>
            <div className="space-y-2">
              {[{ skill: "GraphQL", level: 0, note: "Required" }, { skill: "Redis", level: 20, note: "Nice to have" }].map((gap) => (
                <div key={gap.skill} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400 w-20 shrink-0">{gap.skill}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-1.5">
                    <div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${gap.level}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{gap.note}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Top Matches For You</p>
            <div className="space-y-2">
              {[{ company: "Stripe", role: "Senior Frontend Dev", match: 94, logo: "S" }, { company: "Vercel", role: "React Engineer", match: 88, logo: "V" }, { company: "Linear", role: "Full Stack Dev", match: 81, logo: "L" }].map((job) => (
                <div key={job.company} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all duration-150 cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{job.logo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{job.role}</p>
                    <p className="text-xs text-gray-400">{job.company}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded-lg text-xs font-bold shrink-0 ${job.match >= 90 ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"}`}>{job.match}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 animate-bounceSoft">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        AI Powered
      </div>
    </div>
  );
}

function JobSeekers() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0D0F12] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] bg-indigo-950/30 rounded-full blur-[100px] opacity-70" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className={`flex-1 w-full flex justify-center transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <ProfileMockup />
          </div>
          <div className={`flex-1 flex flex-col gap-8 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">For Job Seekers</span>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
                Find jobs that{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">truly match</span>
                <br />your skills
              </h2>
              <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                Stop applying blindly. HireSense AI reads your profile, understands your strengths, and shows you exactly where you stand — before you apply.
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
                  Create Free Profile
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto">
                <button className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5">
                  Browse Jobs
                </button>
              </Link>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Free forever for job seekers. No credit card needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobSeekers;