import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";

const FIELDS = [
  { key: "website", label: "Website / Portfolio", placeholder: "https://yourportfolio.com", color: "text-violet-400",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", color: "text-blue-400",
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/username", color: "text-gray-300",
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { key: "github", label: "GitHub", placeholder: "https://github.com/username", color: "text-gray-400",
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
];

function SocialProfileForm({ userData }) {
  const getInitial = () => ({
    website: userData?.userProfile?.socialProfiles?.portfolioWebsite || "",
    linkedin: userData?.userProfile?.socialProfiles?.linkedin || "",
    twitter: userData?.userProfile?.socialProfiles?.twitter || "",
    github: userData?.userProfile?.socialProfiles?.github || "",
  });

  const [formData, setFormData] = useState(getInitial);
  const [initialFormData, setInitialFormData] = useState(getInitial);
  const [isChanged, setIsChanged] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => { if (userData) { const fresh = getInitial(); setFormData(fresh); setInitialFormData(fresh); } }, [userData]);
  useEffect(() => { setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData)); if (saveSuccess) setSaveSuccess(false); }, [formData]);

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const handleCancel = () => { setFormData(initialFormData); setIsChanged(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await userService.updateUserProfile({
        socialProfiles: { portfolioWebsite: formData.website, linkedin: formData.linkedin, twitter: formData.twitter, github: formData.github },
      });
      setIsChanged(false);
      setInitialFormData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {FIELDS.map(({ key, label, placeholder, icon, color }) => (
        <div key={key} className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
          <div className="relative">
            <div className={"absolute left-3.5 top-1/2 -translate-y-1/2 " + color}>{icon}</div>
            <input type="url" name={key} value={formData[key] || ""} onChange={handleInputChange} placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>
      ))}
      {isChanged && (
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-xs font-semibold rounded-xl transition-all">Cancel</button>
          <button type="submit" disabled={updating} className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
            {updating ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Save Changes</>}
          </button>
        </div>
      )}
      {saveSuccess && !isChanged && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs text-emerald-400 font-medium">Social profiles updated successfully.</p>
        </div>
      )}
    </form>
  );
}

export default SocialProfileForm;