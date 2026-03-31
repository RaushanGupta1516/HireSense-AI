import React, { useEffect, useState } from "react";
import CompanySearch from "../Common/CompanySearch";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

// ── DARK INPUT ──
function DarkInput({ label, id, value, onChange, placeholder, type = "text", icon, required }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{icon}</div>}
        <input
          type={type} id={id} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all`}
        />
      </div>
    </div>
  );
}

// ── DARK SELECT ──
function DarkSelect({ label, id, value, onChange, options, optgroup }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>}
      <select
        id={id} value={value} onChange={onChange}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
      >
        {optgroup
          ? options.map((group) => (
              <optgroup key={group.label} label={group.label} className="bg-[#1C2030]">
                {group.options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)}
              </optgroup>
            ))
          : options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)
        }
      </select>
    </div>
  );
}

// ── STEP BAR ──
const STEPS = ["Your Location", "Your Role", "Work Experience", "Online Presence"];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200 ${
              i < current ? "bg-indigo-600 border-indigo-600 text-white"
              : i === current ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-400"
              : "bg-white/5 border-white/10 text-gray-600"
            }`}>
              {i < current
                ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? "text-white" : i < current ? "text-indigo-400" : "text-gray-600"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-px transition-all duration-300 ${i < current ? "bg-indigo-600" : "bg-white/5"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── OPTION CARD ── (for role + experience selection)
function OptionCard({ label, selected, onClick, sub }) {
  return (
    <button type="button" onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all duration-150 ${
        selected
          ? "bg-indigo-600/10 border-indigo-500/40 shadow-indigo-900/20"
          : "bg-white/[0.03] border-white/10 hover:border-indigo-500/20 hover:bg-white/5"
      }`}
    >
      <p className={`text-sm font-semibold ${selected ? "text-indigo-400" : "text-gray-400"}`}>{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      {selected && (
        <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center mt-2">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      )}
    </button>
  );
}

function UserOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);

  const [formData, setFormData] = useState({
    location: "", primaryRole: "", yearsOfExperience: "",
    companyName: "", companyLogo: "", companyDomain: "",
    title: "", notEmployed: false, linkedin: "", website: "",
  });

  const handleInputChange = (e) => {
    const { id, type, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? !prev[id] : value,
    }));
  };

  const handleDropdown = (item) => {
    const { name, logo, domain } = item;
    setFormData((prev) => ({
      ...prev,
      companyName: name,
      companyLogo: logo || "",
      companyDomain: domain || "",
    }));
    setShowDropdown(false);
  };

  const handleClearCompany = () => {
    setFormData((prev) => ({ ...prev, companyName: "", companyLogo: "", companyDomain: "" }));
    setShowDropdown(true);
  };

  useEffect(() => {
    if (formData.notEmployed) {
      setFormData((prev) => ({ ...prev, companyName: "", companyLogo: "", companyDomain: "", title: "" }));
      setShowDropdown(true);
    }
  }, [formData.notEmployed]);

  const handleSubmission = async (e) => {
    e?.preventDefault();
    setLoading(true);
    const data = {
      address: { country: formData.location },
      location: formData.location,
      primaryRole: formData.primaryRole,
      socialProfiles: {
        linkedin: formData.linkedin || "",
        github: "",
        twitter: "",
        portfolioWebsite: formData.website || "",
      },
      workExperience: [{
        jobTitle: formData.title || "",
        company: { name: formData.companyName || "", logoUrl: formData.companyLogo || "", domain: formData.companyDomain || "" },
      }],
      yearsOfExperience: formData.yearsOfExperience,
      doneOnboarding: true,
    };
    try {
      await userService.updateUserProfile(data);
navigate("/jobs");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const locationOptions = [
    { value: "", label: "Select your country" },
    { value: "india", label: "🇮🇳  India" },
    { value: "united_states", label: "🇺🇸  United States" },
    { value: "united_kingdom", label: "🇬🇧  United Kingdom" },
    { value: "australia", label: "🇦🇺  Australia" },
    { value: "canada", label: "🇨🇦  Canada" },
    { value: "germany", label: "🇩🇪  Germany" },
    { value: "france", label: "🇫🇷  France" },
    { value: "japan", label: "🇯🇵  Japan" },
    { value: "brazil", label: "🇧🇷  Brazil" },
    { value: "south_africa", label: "🇿🇦  South Africa" },
  ];

  const roleGroups = [
    { group: "Engineering", roles: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist"] },
    { group: "Design", roles: ["UI Designer", "UX Designer", "Product Designer", "Graphic Designer"] },
    { group: "Management", roles: ["Product Manager", "Project Manager", "Engineering Manager", "Team Lead"] },
    { group: "Business", roles: ["Marketing Manager", "Sales Executive", "HR Manager", "Operations Manager"] },
  ];

  const expOptions = [
    { value: "", label: "Select experience" },
    { value: "0", label: "< 1 year" },
    { value: "1", label: "1 year" },
    { value: "2", label: "2 years" },
    { value: "3", label: "3 years" },
    { value: "4", label: "4 years" },
    { value: "5", label: "5 years" },
    { value: "6", label: "5+ years" },
  ];

  const stepContent = [
    // ── STEP 0 — Location ──
    <div key={0} className="space-y-6">
      <DarkSelect
        label="Country"
        id="location"
        value={formData.location}
        onChange={handleInputChange}
        options={locationOptions}
      />
      {formData.location && (
        <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
          <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          <p className="text-sm text-indigo-400 font-medium capitalize">
            {locationOptions.find(o => o.value === formData.location)?.label}
          </p>
        </div>
      )}
    </div>,

    // ── STEP 1 — Role ──
    <div key={1} className="space-y-5">
      {roleGroups.map((group) => (
        <div key={group.group}>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">{group.group}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.roles.map((role) => (
              <OptionCard
                key={role} label={role}
                selected={formData.primaryRole === role}
                onClick={() => setFormData((prev) => ({ ...prev, primaryRole: role }))}
              />
            ))}
          </div>
        </div>
      ))}
    </div>,

    // ── STEP 2 — Work Experience ──
    <div key={2} className="space-y-5">
      <DarkSelect label="Years of Experience" id="yearsOfExperience"
        value={formData.yearsOfExperience} onChange={handleInputChange} options={expOptions}
      />

      {/* Not employed toggle */}
      <label className="flex items-center gap-3 cursor-pointer group p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
        <div
          onClick={() => setFormData((prev) => ({ ...prev, notEmployed: !prev.notEmployed }))}
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
            formData.notEmployed ? "bg-indigo-600 border-indigo-600" : "border-white/20 bg-white/[0.03]"
          }`}
        >
          {formData.notEmployed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-300">I'm not currently employed</p>
          <p className="text-xs text-gray-600 mt-0.5">Skip the company section</p>
        </div>
      </label>

      {!formData.notEmployed && (
        <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Position</p>

          <DarkInput label="Job Title" id="title" value={formData.title}
            onChange={handleInputChange} placeholder="e.g. Senior Software Engineer"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
          />

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Company</p>
            {showDropdown ? (
              <CompanySearch handleDropdown={handleDropdown} width="w-full" label="" />
            ) : (
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={formData.companyLogo || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"}
                    alt={formData.companyName} className="w-8 h-8 rounded-lg border border-white/10 object-contain bg-white/5"/>
                  <span className="text-sm font-semibold text-white">{formData.companyName}</span>
                </div>
                <button type="button" onClick={handleClearCompany} className="text-gray-600 hover:text-gray-400 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-2">Your company will never see you're job hunting.</p>
          </div>
        </div>
      )}
    </div>,

    // ── STEP 3 — Online Presence ──
    <div key={3} className="space-y-5">
      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl mb-2">
        <p className="text-xs text-indigo-400 font-medium">💡 Adding links increases your profile visibility by 3x.</p>
      </div>

      <DarkInput label="LinkedIn Profile" id="linkedin" value={formData.linkedin}
        onChange={handleInputChange} placeholder="https://linkedin.com/in/yourname"
        icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
      />

      <DarkInput label="Personal Website" id="website" value={formData.website}
        onChange={handleInputChange} placeholder="https://yourportfolio.com"
        icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>}
      />

      {/* Profile preview */}
      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Profile Summary</p>
        {[
          { label: "Location", value: formData.location },
          { label: "Role", value: formData.primaryRole },
          { label: "Experience", value: formData.yearsOfExperience ? `${formData.yearsOfExperience} yrs` : "" },
          { label: "Company", value: formData.notEmployed ? "Not employed" : formData.companyName },
        ].map((row) => row.value && (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{row.label}</span>
            <span className="text-xs font-medium text-gray-300 capitalize">{row.value}</span>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-[#0D0F12] flex flex-col items-center justify-center py-12 px-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
          <span className="text-xs font-semibold text-indigo-400">Step {step + 1} of {STEPS.length}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Create your profile</h1>
        <p className="text-gray-500 mt-2 text-sm">Apply privately to thousands of companies with one profile.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl relative">
        <div className="bg-[#131720] border border-white/5 rounded-2xl shadow-2xl p-6 sm:p-8">
          <StepBar current={step} />

          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">{STEPS[step]}</h2>
            <div className="h-0.5 w-8 bg-indigo-600 rounded-full mt-1.5" />
          </div>

          <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-1">
            {stepContent[step]}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-400 font-semibold rounded-xl text-sm hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
              </svg>
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            ) : (
              <button type="button" onClick={handleSubmission} disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-900/30"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Finish Setup</>
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

export default UserOnboarding;