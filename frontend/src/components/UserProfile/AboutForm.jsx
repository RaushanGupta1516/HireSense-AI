import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService.js";
import useUpdateUserData from "../../hooks/useUpdateUserData.jsx";

function DarkInput({ label, id, name, value, onChange, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <input type="text" id={id} name={name || id} value={value || ""} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
    </div>
  );
}

function DarkSelect({ label, id, name, value, onChange, options, optgroup }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <select id={id} name={name || id} value={value || ""} onChange={onChange}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}>
        {optgroup
          ? options.map((g) => (
              <optgroup key={g.label} label={g.label} className="bg-[#1C2030]">
                {g.options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)}
              </optgroup>
            ))
          : options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)}
      </select>
    </div>
  );
}

const BIO_LIMIT = 300;

const locationOptions = [
  { value: "", label: "Select country" },
  { value: "india", label: "India" },
  { value: "united_states", label: "United States" },
  { value: "united_kingdom", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "japan", label: "Japan" },
  { value: "china", label: "China" },
  { value: "brazil", label: "Brazil" },
  { value: "south_africa", label: "South Africa" },
];

const roleOptions = [
  { label: "Engineering", options: [
    { value: "software_engineer", label: "Software Engineer" },
    { value: "frontend_developer", label: "Frontend Developer" },
    { value: "backend_developer", label: "Backend Developer" },
    { value: "fullstack_developer", label: "Full Stack Developer" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "devops_engineer", label: "DevOps Engineer" },
    { value: "system_admin", label: "System Administrator" },
  ]},
  { label: "Design", options: [
    { value: "ui_designer", label: "UI Designer" },
    { value: "ux_designer", label: "UX Designer" },
    { value: "product_designer", label: "Product Designer" },
  ]},
  { label: "Management", options: [
    { value: "product_manager", label: "Product Manager" },
    { value: "project_manager", label: "Project Manager" },
    { value: "team_lead", label: "Team Lead" },
    { value: "engineering_manager", label: "Engineering Manager" },
  ]},
];

const experienceOptions = [
  { value: "", label: "Select experience" },
  { value: "0", label: "Less than 1 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
  { value: "6", label: "5+ years" },
];

function AboutForm({ userData }) {
  const getInitial = () => ({
    name: userData?.userProfile?.name || "",
    location: userData?.userProfile?.location || "",
    primaryRole: userData?.userProfile?.primaryRole || "",
    yearsOfExperience: userData?.userProfile?.yearsOfExperience || "",
    bio: userData?.userProfile?.bio || "",
    profilePicture: userData?.userProfile?.profilePicture || "",
  });

  const [formData, setFormData] = useState(getInitial);
  const [initialFormData, setInitialFormData] = useState(getInitial);
  const [isChanged, setIsChanged] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const updateUserData = useUpdateUserData();

  useEffect(() => {
    if (userData) {
      const fresh = getInitial();
      setFormData(fresh);
      setInitialFormData(fresh);
    }
  }, [userData]);

  useEffect(() => {
    setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData));
    if (saveSuccess) setSaveSuccess(false);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, id, value } = e.target;
    setFormData((prev) => ({ ...prev, [name || id]: value }));
  };

  // ── FIX: enforce bio character limit ──
  const handleBioChange = (e) => {
    const value = e.target.value;
    if (value.length > BIO_LIMIT && value.length > (formData.bio?.length || 0)) return;
    setFormData((prev) => ({ ...prev, bio: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    reader.readAsDataURL(file);
    try {
      setUploadProgress(true);
      await userService.updateProfilePicture(file);
      await updateUserData();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((formData.bio?.length || 0) > BIO_LIMIT) return;
    setUpdating(true);
    try {
      await userService.updateUserProfile(formData);
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

  const handleCancel = () => { setFormData(initialFormData); setIsChanged(false); };

  const bioLen = formData.bio?.length || 0;
  const bioNearLimit = bioLen >= 250;
  const bioAtLimit = bioLen >= BIO_LIMIT;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Profile photo */}
      <div className="flex items-center gap-5 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden bg-white/5">
            <img src={formData.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {uploadProgress && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Profile Photo</p>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">JPG, PNG or WebP. Max 2MB.</p>
          <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileChange} hidden />
          <button type="button" onClick={() => document.getElementById("profilePicture").click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {uploadProgress ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      </div>

      <DarkInput label="Full Name" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
      <DarkSelect label="Location" id="location" name="location" value={formData.location} onChange={handleInputChange} options={locationOptions} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DarkSelect label="Primary Role" id="primaryRole" name="primaryRole" value={formData.primaryRole} onChange={handleInputChange} options={roleOptions} optgroup />
        <DarkSelect label="Years of Experience" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} options={experienceOptions} />
      </div>

      {/* Bio with enforced limit */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bio</label>
          <span className={`text-xs font-medium tabular-nums transition-colors ${
            bioAtLimit ? "text-red-400" : bioNearLimit ? "text-amber-400" : "text-gray-600"
          }`}>
            {bioLen} / {BIO_LIMIT}
          </span>
        </div>
        <textarea
          id="bio" name="bio"
          value={formData.bio || ""}
          onChange={handleBioChange}
          maxLength={BIO_LIMIT}
          placeholder="Stanford CS grad, full stack generalist..."
          rows={4}
          className={`w-full px-4 py-3 bg-white/[0.04] border rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:ring-2 transition-all resize-none ${
            bioAtLimit
              ? "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/10"
              : "border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/10"
          }`}
        />
        {bioAtLimit && (
          <p className="text-xs text-red-400">Character limit reached. Max {BIO_LIMIT} characters.</p>
        )}
      </div>

      {isChanged && (
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Saved
            </span>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={handleCancel}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-xs font-semibold rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={updating || bioAtLimit}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
              {updating
                ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Save Changes</>}
            </button>
          </div>
        </div>
      )}

      {saveSuccess && !isChanged && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs text-emerald-400 font-medium">Profile updated successfully.</p>
        </div>
      )}
    </form>
  );
}

export default AboutForm;