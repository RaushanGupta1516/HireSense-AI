import React, { useState } from "react";
import CompanySearch from "../Common/CompanySearch";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

// ── DARK INPUT ──
function DarkInput({ label, name, value, onChange, placeholder, type = "text", icon }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{icon}</div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all`}
        />
      </div>
    </div>
  );
}

// ── DARK TEXTAREA ──
function DarkTextarea({ label, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
      />
    </div>
  );
}

// ── STEP INDICATOR ──
const STEPS = ["Company Info", "Address", "Company Size", "Online Presence"];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200 ${
              i < current
                ? "bg-indigo-600 border-indigo-600 text-white"
                : i === current
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-400"
                : "bg-white/5 border-white/10 text-gray-600"
            }`}>
              {i < current ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              i === current ? "text-white" : i < current ? "text-indigo-400" : "text-gray-600"
            }`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px transition-all duration-300 ${i < current ? "bg-indigo-600" : "bg-white/5"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CompanyOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);

  const [companyProfile, setCompanyProfile] = useState({
    companyName: "",
    companyDescription: "",
    contactNumber: "",
    address: { city: "", state: "", country: "" },
    companySize: { from: "", to: "" },
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    companySocialProfiles: { linkedIn: "", twitter: "", portfolioWebsite: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCompanyProfile((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setCompanyProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDropdown = (item) => {
    const { name, logo, domain } = item;
    setCompanyProfile((prev) => ({
      ...prev,
      companyName: name,
      companyLogo: logo || prev.companyLogo,
      companySocialProfiles: { ...prev.companySocialProfiles, portfolioWebsite: domain || "" },
    }));
    setShowDropdown(false);
  };

  const handleClearCompany = () => {
    setCompanyProfile((prev) => ({ ...prev, companyName: "", companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" }));
    setShowDropdown(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await userService.updateUserProfile({ ...companyProfile, doneOnboarding: true });
      if (res.status === 200) navigate("/dashboard/home");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const companySizeOptions = [
    { label: "1–10", from: 1, to: 10 },
    { label: "11–50", from: 11, to: 50 },
    { label: "51–200", from: 51, to: 200 },
    { label: "201–500", from: 201, to: 500 },
    { label: "500–1000", from: 500, to: 1000 },
    { label: "1000+", from: 1000, to: 999999 },
  ];

  const stepContent = [
    // ── STEP 0 — Company Info ──
    <div key={0} className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Select Company</p>
        {showDropdown ? (
          <CompanySearch
            label=""
            handleDropdown={handleDropdown}
            width="w-full"
          />
        ) : (
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <img src={companyProfile.companyLogo} alt={companyProfile.companyName} className="w-9 h-9 rounded-lg border border-white/10 object-contain bg-white/5" />
              <span className="text-sm font-semibold text-white">{companyProfile.companyName}</span>
            </div>
            <button onClick={handleClearCompany} className="text-gray-600 hover:text-gray-400 transition-colors p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <DarkTextarea
        label="Company Description"
        name="companyDescription"
        value={companyProfile.companyDescription}
        onChange={handleChange}
        placeholder="Tell candidates what makes your company great..."
      />

      <DarkInput
        label="Contact Number"
        name="contactNumber"
        value={companyProfile.contactNumber}
        onChange={handleChange}
        placeholder="+91 98765 43210"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
      />
    </div>,

    // ── STEP 1 — Address ──
    <div key={1} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "City", name: "address.city", placeholder: "Mumbai" },
          { label: "State", name: "address.state", placeholder: "Maharashtra" },
          { label: "Country", name: "address.country", placeholder: "India" },
        ].map((f) => (
          <DarkInput key={f.name} label={f.label} name={f.name}
            value={f.name.split(".").reduce((o, k) => o?.[k], companyProfile)}
            onChange={handleChange} placeholder={f.placeholder}
          />
        ))}
      </div>
    </div>,

    // ── STEP 2 — Company Size ──
    <div key={2} className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Team Size</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {companySizeOptions.map((opt) => {
            const isSelected = companyProfile.companySize.from === opt.from && companyProfile.companySize.to === opt.to;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setCompanyProfile((prev) => ({ ...prev, companySize: { from: opt.from, to: opt.to } }))}
                className={`py-3 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                    : "bg-white/[0.04] border-white/10 text-gray-500 hover:border-indigo-500/30 hover:text-indigo-400"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DarkInput label="From (custom)" name="companySize.from" value={companyProfile.companySize.from}
          onChange={handleChange} placeholder="e.g. 50" type="number" />
        <DarkInput label="To (custom)" name="companySize.to" value={companyProfile.companySize.to}
          onChange={handleChange} placeholder="e.g. 200" type="number" />
      </div>
    </div>,

    // ── STEP 3 — Online Presence ──
    <div key={3} className="space-y-5">
      {[
        {
          label: "LinkedIn", name: "companySocialProfiles.linkedIn",
          placeholder: "https://linkedin.com/company/yourcompany",
          icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
        },
        {
          label: "Twitter / X", name: "companySocialProfiles.twitter",
          placeholder: "https://twitter.com/yourcompany",
          icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
        },
        {
          label: "Website", name: "companySocialProfiles.portfolioWebsite",
          placeholder: "https://yourcompany.com",
          icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>,
        },
      ].map((f) => (
        <DarkInput key={f.name} label={f.label} name={f.name}
          value={f.name.split(".").reduce((o, k) => o?.[k], companyProfile)}
          onChange={handleChange} placeholder={f.placeholder} icon={f.icon}
        />
      ))}
    </div>,
  ];

  return (
    <div className="min-h-screen bg-[#0D0F12] flex flex-col items-center justify-center py-12 px-4">

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
          <span className="text-xs font-semibold text-indigo-400">Step {step + 1} of {STEPS.length}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Complete your profile</h1>
        <p className="text-gray-500 mt-2 text-sm">Find the best fit for your organisation among thousands of talents</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl relative">
        <div className="bg-[#131720] border border-white/5 rounded-2xl shadow-2xl p-6 sm:p-8">

          <StepBar current={step} />

          {/* Step title */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">{STEPS[step]}</h2>
            <div className="h-0.5 w-8 bg-indigo-600 rounded-full mt-1.5" />
          </div>

          {/* Step content */}
          {stepContent[step]}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-400 font-semibold rounded-xl text-sm hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-900/30"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-indigo-600" : i < step ? "w-3 bg-indigo-600/50" : "w-3 bg-white/10"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyOnboarding;