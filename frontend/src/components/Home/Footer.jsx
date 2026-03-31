import React from "react";
import { Link } from "react-router-dom";
import Hiresense from "../assets/media/HireSense.png";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "AI Resume Screener", path: "/jobs" },
      { label: "Candidate Matching", path: "/jobs" },
      { label: "Skill Gap Analysis", path: "/jobs" },
      { label: "Hiring Analytics", path: "/dashboard/home" },
      { label: "Pricing", path: "/pricing" },
    ],
  },
  {
    heading: "For Teams",
    links: [
      { label: "Startups", path: "/signup" },
      { label: "Enterprise", path: "/signup" },
      { label: "Recruiters", path: "/signup" },
      { label: "Job Seekers", path: "/signup" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", path: "/" },
      { label: "API Reference", path: "/" },
      { label: "Blog", path: "/" },
      { label: "Changelog", path: "/" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", path: "/" },
      { label: "Careers", path: "/" },
      { label: "Privacy Policy", path: "/" },
      { label: "Terms of Service", path: "/" },
    ],
  },
];

const socials = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="relative bg-[#0D0F12] border-t border-white/5">

      {/* ── CTA BANNER ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-[0.04] dark:opacity-[0.08]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to hire smarter?
            </h3>
            <p className="text-gray-400 mt-1 text-sm">
              Join 200+ startups already using HireSense AI to find top talent.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/signup">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:-translate-y-0.5 text-sm whitespace-nowrap">
                Start Free Trial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <Link to="/jobs">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition-all duration-200 text-sm whitespace-nowrap">
                Browse Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand col */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Link to="/">
              <img src={Hiresense} alt="HireSense AI" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed ">
              AI-powered hiring platform that screens resumes, scores candidates, and helps teams hire 10x faster.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">All systems operational</span>
            </div>
          </div>

          {/* Links grid */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.heading} className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-widest">
                  {section.heading}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} HireSense AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Privacy</span>
            <span className="text-sm text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Terms</span>
            <span className="text-sm text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Cookies</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span>Built with</span>
              <span className="text-red-400">♥</span>
              <span>for startups</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;