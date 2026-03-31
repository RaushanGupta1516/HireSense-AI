import React, { useEffect, useState } from "react";
import { externalApiServices } from "../../services/externalApiServices";
import { userService } from "../../services/userService";
import { useSelector } from "react-redux";
import useUpdateUserData from "../../hooks/useUpdateUserData";

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

function EducationForm({ setShowAddEducation, educationFormData, setEducationFormData }) {
  const { userData } = useSelector((store) => store.auth);
  const updateUser = useUpdateUserData();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({ institution: "", start: "", end: "", degree: "", major: "" });
  const [institutionLocked, setInstitutionLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (educationFormData) {
      const { institution, degree, fieldOfStudy, startYear, endYear } = educationFormData;
      setFormData({ institution: institution || "", start: startYear || "", end: endYear || "", degree: degree || "", major: fieldOfStudy || "" });
      if (institution) setInstitutionLocked(true);
    }
  }, [educationFormData]);

  useEffect(() => {
    if (!isSearching || !searchTerm) { setResults([]); return; }
    const id = setTimeout(async () => {
      const data = await externalApiServices.searchUniversities(searchTerm);
      setResults(data || []);
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm, isSearching]);

  const handleSearch = (e) => { setSearchTerm(e.target.value); setFormData((prev) => ({ ...prev, institution: e.target.value })); setIsSearching(true); };
  const selectInstitution = (name) => { setFormData((prev) => ({ ...prev, institution: name })); setInstitutionLocked(true); setIsSearching(false); setSearchTerm(""); setResults([]); };
  const clearInstitution = () => { setFormData((prev) => ({ ...prev, institution: "" })); setInstitutionLocked(false); setSearchTerm(""); setResults([]); };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const handleCancel = () => { setShowAddEducation(false); setEducationFormData(null); };
  const buildEntry = () => ({ institution: formData.institution, degree: formData.degree, fieldOfStudy: formData.major, startYear: formData.start, endYear: formData.end });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const educationCopy = [...(userData?.userProfile?.education || [])];
    if (educationFormData) {
      const idx = educationCopy.findIndex((ed) => ed.degree === educationFormData.degree && ed.institution === educationFormData.institution);
      if (idx !== -1) educationCopy[idx] = buildEntry();
    } else {
      educationCopy.push(buildEntry());
    }
    try {
      await userService.updateUserProfile({ education: educationCopy });
      await updateUser();
      setShowAddEducation(false);
      setEducationFormData(null);
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
          <h3 className="text-sm font-bold text-white">{educationFormData ? "Edit Education" : "Add Education"}</h3>
          <div className="h-0.5 w-6 bg-amber-500 rounded-full mt-1" />
        </div>
        <button type="button" onClick={handleCancel} className="text-gray-600 hover:text-gray-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Institution</p>
          {institutionLocked ? (
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                </div>
                <span className="text-sm font-semibold text-white">{formData.institution}</span>
              </div>
              <button type="button" onClick={clearInstitution} className="text-gray-600 hover:text-gray-400 p-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" value={formData.institution} onChange={handleSearch} placeholder="Search university or college..."
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              {searchTerm && (
                <div className="mt-1 bg-[#1C2030] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10">
                  {results.length > 0 ? results.slice(0, 5).map((item, i) => (
                    <button key={i} type="button" onClick={() => selectInstitution(item.name)} className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <p className="text-sm font-semibold text-gray-200">{item.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item["state-province"] ? item["state-province"] + ", " : ""}{item.alpha_two_code}{item.domains?.[0] ? " - " + item.domains[0] : ""}</p>
                    </button>
                  )) : (
                    <button type="button" onClick={() => selectInstitution(searchTerm)} className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors">
                      <p className="text-sm text-gray-400">No results - add "{searchTerm}"</p>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DarkInput label="Start Year" name="start" type="month" value={formData.start} onChange={handleInputChange} required />
          <DarkInput label="End Year" name="end" type="month" value={formData.end} onChange={handleInputChange} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DarkInput label="Degree" name="degree" value={formData.degree} onChange={handleInputChange} placeholder="e.g. B.Tech, B.Sc, MBA" />
          <DarkInput label="Field of Study" name="major" value={formData.major} onChange={handleInputChange} placeholder="e.g. Computer Science" />
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

export default EducationForm;