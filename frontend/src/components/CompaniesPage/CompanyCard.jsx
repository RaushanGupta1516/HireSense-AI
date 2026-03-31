import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CompanyCard({ company }) {
  const { companyName, companyLogo, jobListings, companySize, companySocialProfiles } = company;
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const socials = [
    {
      href: companySocialProfiles?.linkedIn,
      label: "LinkedIn",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      href: companySocialProfiles?.twitter,
      label: "Twitter",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: companySocialProfiles?.portfolioWebsite,
      label: "Website",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
  ].filter((s) => s.href);

  return (
    <div className="bg-[#131720] border border-white/5 hover:border-indigo-500/20 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/30 group">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
            {companyLogo && !imgError ? (
              <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-1" onError={() => setImgError(true)} />
            ) : (
              <span className="text-lg font-bold text-gray-500">{companyName?.charAt(0)}</span>
            )}
          </div>

          {/* Name + size */}
          <div>
            <p className="font-semibold text-white text-base leading-tight">{companyName}</p>
            {companySize?.from && (
              <div className="flex items-center gap-1.5 mt-1">
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-500 font-medium">
                  {companySize.from}–{companySize.to} employees
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Social links */}
        {socials.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            {socials.map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-500 hover:text-gray-300 flex items-center justify-center transition-all duration-150"
                title={label}
              >
                {icon}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Job listings */}
      {jobListings?.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {jobListings.length} Active {jobListings.length === 1 ? "Listing" : "Listings"}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {jobListings.map((listing, i) => (
              <button key={i} onClick={() => navigate(`/job/${listing._id}`)}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-indigo-500/20 rounded-xl transition-all duration-150 group/job"
              >
                <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-300 group-hover/job:text-white transition-colors flex-1 truncate">
                  {listing?.title}
                </span>
                {listing?.location && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />
                    <span className="text-xs text-gray-600 shrink-0">{listing.location}</span>
                  </>
                )}
                <svg className="w-3.5 h-3.5 text-gray-300 group-hover/job:text-indigo-400 group-hover/job:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyCard;