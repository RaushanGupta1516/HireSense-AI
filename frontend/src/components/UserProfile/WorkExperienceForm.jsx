import React, { useEffect, useState } from "react";
import CompanySearch from "../Common/CompanySearch";
import { userService } from "../../services/userService.js";
import { useSelector } from "react-redux";
import useUpdateUserData from "../../hooks/useUpdateUserData.jsx";

function DarkInput({ label, name, value, onChange, placeholder, type = "text", required }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <input type={type} name={name} id={name} value={value || ""} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
        style={type === "month" ? { colorScheme: "dark" } : {}}
      />
    </div>
  );
}

function WorkExperienceForm({ setShowAddWorkExperience, data, setWorkExperienceFormData }) {
  const { userData } = useSelector((store) => store.auth);
  const updateUser = useUpdateUserData();

  const [formData, setFormData] = useState({ companyName: "", companyLogo: "", companyDomain: "", title: "", startDate: "", endDate: "", current: false, description: "" });
  const [showDropdown, setShowDropdown] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      const { company, jobTitle, description, startMonth, endMonth, currentJob } = data;
      setFormData({ companyName: company?.name || "", companyLogo: company?.logoUrl || "", companyDomain: company?.domain || "", title: jobTitle || "", description: description || "", startDate: startMonth || "", endDate: endMonth || "", current: currentJob || false });
      if (company?.name) setShowDropdown(false);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleDropdown = (item) => { setFormData((prev) => ({ ...prev, companyName: item.name, companyLogo: item.logo || "", companyDomain: item.domain || "" })); setShowDropdown(false); };
  const handleClearCompany = () => { setFormData((prev) => ({ ...prev, companyName: "", companyLogo: "", companyDomain: "" })); setShowDropdown(true); };
  const handleCancel = () => { setShowAddWorkExperience(false); setWorkExperienceFormData(null); };

  const buildEntry = () => ({
    jobTitle: formData.title,
    company: { name: formData.companyName, logoUrl: formData.companyLogo, domain: formData.companyDomain },
    startMonth: formData.startDate,
    endMonth: formData.current ? null : formData.endDate,
    currentJob: formData.current,
    description: formData.description,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const workExperienceCopy = [...(userData?.userProfile?.workExperience || [])];
    if (data) {
      const idx = workExperienceCopy.findIndex((ex) => ex.jobTitle === data.jobTitle && ex.company?.name === data.company?.name);
      if (idx !== -1) workExperienceCopy[idx] = buildEntry();
    } else {
      workExperienceCopy.push(buildEntry());
    }
    try {
      await userService.updateUserProfile({ workExperience: workExperienceCopy });
      await updateUser();
      setShowAddWorkExperience(false);
      setWorkExperienceFormData(null);
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white">{data ? "Edit Experience" : "Add Work Experience"}</h3>
          <div className="h-0.5 w-6 bg-indigo-600 rounded-full mt-1" />
        </div>
        <button type="button" onClick={handleCancel} className="text-gray-600 hover:text-gray-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Company</p>
          {showDropdown ? (
            <CompanySearch handleDropdown={handleDropdown} companyName={formData.companyName} label="" width="w-full" />
          ) : (
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                  {formData.companyLogo ? <img src={formData.companyLogo} alt={formData.companyName} className="w-full h-full object-contain p-0.5" /> : <span className="text-xs font-bold text-gray-500">{formData.companyName?.charAt(0)}</span>}
                </div>
                <span className="text-sm font-semibold text-white">{formData.companyName}</span>
              </div>
              <button type="button" onClick={handleClearCompany} className="text-gray-600 hover:text-gray-400 p-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
        <DarkInput label="Job Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Software Engineer" required />
        <div className="grid grid-cols-2 gap-4">
          <DarkInput label="Start Date" name="startDate" type="month" value={formData.startDate} onChange={handleInputChange} required />
          <DarkInput label="End Date" name="endDate" type="month" value={formData.endDate} onChange={handleInputChange} required={!formData.current} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
          <div onClick={() => setFormData((prev) => ({ ...prev, current: !prev.current }))}
            className={"w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 " + (formData.current ? "bg-indigo-600 border-indigo-600" : "border-white/20 bg-white/[0.03]")}>
            {formData.current && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className="text-sm text-gray-400 font-medium">I currently work here</span>
        </label>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</label>
          <textarea name="description" value={formData.description || ""} onChange={handleInputChange}
            placeholder="Describe your responsibilities, achievements, and impact..." rows={4}
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-xs font-semibold rounded-xl transition-all">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
            {saving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Save</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkExperienceForm;