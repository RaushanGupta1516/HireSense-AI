import React from "react";
import { Icon } from "@iconify/react";

const logos = [
  { icon: "logos:google", name: "Google" },
  { icon: "logos:microsoft", name: "Microsoft" },
  { icon: "logos:netflix", name: "Netflix" },
  { icon: "logos:airbnb", name: "Airbnb" },
  { icon: "logos:webflow", name: "Webflow" },
  { icon: "logos:notion", name: "Notion" },
  { icon: "logos:figma", name: "Figma" },
  { icon: "logos:stripe", name: "Stripe" },
  { icon: "logos:vercel", name: "Vercel" },
  { icon: "logos:linear-icon", name: "Linear" },
];

function LogoSlider() {
  const doubled = [...logos, ...logos];

  return (
    <section className="relative py-20 bg-[#0D0F12] border-t border-white/5 overflow-hidden">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 dark:from-white/[0.02] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            Trusted Worldwide
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Powering Hiring at{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Top Companies
            </span>
          </h2>
          <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
            From fast-growing startups to global enterprises — teams use
            HireSense AI to find and hire the best talent.
          </p>
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {[
            { icon: "🔒", label: "SOC 2 Compliant" },
            { icon: "⚡", label: "99.9% Uptime" },
            { icon: "🌍", label: "50+ Countries" },
            { icon: "🤖", label: "AI Powered" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-400"
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SLIDER TRACK ── */}
      <div className="relative">

        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#0D0F12] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#0D0F12] to-transparent z-10 pointer-events-none" />

        {/* Scrolling row */}
        <div className="overflow-hidden">
          <div
            className="flex items-center gap-12"
            style={{
              animation: "slideLeft 30s linear infinite",
              width: "max-content",
            }}
          >
            {doubled.map((logo, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 group shrink-0"
              >
                <div className="flex items-center justify-center w-20 h-14 rounded-xl bg-white/5 border border-white/5 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/5 transition-all duration-300 px-4">
                  <Icon
                    icon={logo.icon}
                    className="text-4xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ fontSize: "2rem" }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              value: "200+",
              label: "Companies Hiring",
              sub: "Across all industries",
              icon: "🏢",
            },
            {
              value: "50K+",
              label: "Hires Made",
              sub: "Through HireSense AI",
              icon: "🤝",
            },
            {
              value: "4.9/5",
              label: "Recruiter Rating",
              sub: "Based on 2,000+ reviews",
              icon: "⭐",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all duration-200"
            >
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-gray-300">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoSlider;