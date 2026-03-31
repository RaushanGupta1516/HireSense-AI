import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userService } from "../services/userService";

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function getDuration(start, end) {
  if (!start) return null;
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const y = Math.floor(months / 12);
  const m = months % 12;
  return y > 0 ? `${y}y ${m}m` : `${m}m`;
}

const SOCIALS = [
  {
    key: "github",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    key: "twitter",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: "portfolioWebsite",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

// ── SECTION HEADER ──
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function UserPublicProfile() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getPublicProfile(id)
      .then((res) => setUserDetails(res))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  const profile = userDetails?.userProfile;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0F12] pt-24 flex flex-col items-center">
        <div className="w-full max-w-3xl px-4 animate-pulse space-y-6">
          <div className="bg-[#131720] border border-white/5 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white/5" />
            <div className="h-5 w-40 bg-white/5 rounded" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
          <div className="bg-[#131720] border border-white/5 rounded-2xl p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  const activeSocials = SOCIALS.filter((s) => profile.socialProfiles?.[s.key]);

  return (
    <div className="min-h-screen bg-[#0D0F12] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── HERO CARD ── */}
        <div className="bg-[#131720] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl border border-white/10 overflow-hidden bg-white/5 mb-4">
            {profile.profilePicture
              ? <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">{profile.name?.charAt(0)}</div>
            }
          </div>

          <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
          {profile.primaryRole && <p className="text-indigo-400 font-medium text-sm mt-1">{profile.primaryRole}</p>}

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap justify-center">
            {profile.yearsOfExperience !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {profile.yearsOfExperience} yrs exp
              </span>
            )}
            {profile.address?.country && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="capitalize">{profile.address.country}</span>
              </>
            )}
          </div>

          {/* Socials */}
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              {activeSocials.map(({ key, icon }) => (
                <a key={key} href={profile.socialProfiles[key]} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-500 hover:text-gray-300 flex items-center justify-center transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-gray-400 mt-5 leading-relaxed max-w-xl">{profile.bio}</p>
          )}
        </div>

        {/* ── WORK EXPERIENCE ── */}
        {profile.workExperience?.length > 0 && (
          <div className="bg-[#131720] border border-white/5 rounded-2xl p-6">
            <SectionHeader
              title="Work Experience"
              icon={<svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <div className="space-y-3">
              {profile.workExperience.map((exp, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                    {exp.company?.logoUrl
                      ? <img src={exp.company.logoUrl} alt={exp.company.name} className="w-full h-full object-contain p-0.5" />
                      : <span className="text-sm font-bold text-gray-500">{exp.company?.name?.charAt(0)}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{exp.jobTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{exp.company?.name}</p>
                    {exp.startMonth && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-600">
                          {formatDate(exp.startMonth)} — {exp.endMonth ? formatDate(exp.endMonth) : "Present"}
                        </p>
                        {getDuration(exp.startMonth, exp.endMonth) && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-600">{getDuration(exp.startMonth, exp.endMonth)}</span>
                          </>
                        )}
                      </div>
                    )}
                    {exp.description && (
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EDUCATION ── */}
        {profile.education?.length > 0 && (
          <div className="bg-[#131720] border border-white/5 rounded-2xl p-6">
            <SectionHeader
              title="Education"
              icon={<svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>}
            />
            <div className="space-y-3">
              {profile.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{edu.institution}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</p>
                    {edu.startYear && (
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDate(edu.startYear + "-01")} — {edu.endYear ? formatDate(edu.endYear + "-01") : "Present"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {profile.skills?.length > 0 && (
          <div className="bg-[#131720] border border-white/5 rounded-2xl p-6">
            <SectionHeader
              title="Skills"
              icon={<svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
            />
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPublicProfile;