/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SkillsSearch from "../components/Common/SkillsSearch";
import TextEditor from "../components/Common/FormComponents/TextEditor";
import { useSelector } from "react-redux";
import Dialogbox from "../components/Dialogbox";
import { useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";
import aiService from "../services/aiService";

// ── SHARED DARK INPUT ──
function DarkInput({ label, description, name, id, value, onChange, placeholder, type = "text", required }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label} {required && <span className="text-indigo-400">*</span>}
      </label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <input
        type={type} name={name || id} id={id} value={value ?? ""}
        onChange={onChange} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
        style={type === "date" ? { colorScheme: "dark" } : {}}
      />
    </div>
  );
}

// ── DARK SELECT ──
function DarkSelect({ label, description, name, id, value, onChange, options, optgroup, required }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label} {required && <span className="text-indigo-400">*</span>}
      </label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <select
        name={name || id} id={id} value={value ?? ""} onChange={onChange} required={required}
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
      >
        {optgroup
          ? options.map((g) => (
              <optgroup key={g.label} label={g.label} className="bg-[#1C2030]">
                {g.options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)}
              </optgroup>
            ))
          : options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C2030]">{o.label}</option>)
        }
      </select>
    </div>
  );
}

// ── DYNAMIC LIST INPUT ──
function DynamicListInput({ label, description, name, values, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange(name, null, [...values, trimmed]);
    setInput("");
  };
  const remove = (i) => onChange(name, null, values.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
        />
        <button type="button" onClick={add} className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all">Add</button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((v, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-gray-300">
              <span className="text-indigo-400">→</span> {v}
              <button type="button" onClick={() => remove(i)} className="text-gray-600 hover:text-red-400 transition-colors ml-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SECTION CARD ──
function SectionCard({ number, title, children }) {
  return (
    <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-visible">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{number}</div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ── WORK MODE OPTION ──
function WorkModeOption({ id, name, value, checked, onChange, label, icon }) {
  return (
    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${checked ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400" : "bg-white/[0.02] border-white/10 text-gray-500 hover:border-indigo-500/20"}`}>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} className="hidden" />
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "border-indigo-500" : "border-white/20"}`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
      </div>
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </label>
  );
}

const jobTypeOptions = [
  { value: "Full-time", label: "Full-time" }, { value: "Part-time", label: "Part-time" },
  { value: "Internship", label: "Internship" }, { value: "Freelance", label: "Freelance" },
];

const roleOptions = [
  { label: "Engineering", options: [{ value: "software_engineer", label: "Software Engineer" }, { value: "data_scientist", label: "Data Scientist" }, { value: "system_admin", label: "System Administrator" }] },
  { label: "Management", options: [{ value: "project_manager", label: "Project Manager" }, { value: "product_manager", label: "Product Manager" }, { value: "team_lead", label: "Team Lead" }] },
  { label: "Design", options: [{ value: "ui_designer", label: "UI Designer" }, { value: "ux_designer", label: "UX Designer" }, { value: "graphic_designer", label: "Graphic Designer" }] },
];

const experienceOptions = [
  { value: "0", label: "Less than 1 year" }, { value: "1", label: "1 year" },
  { value: "2", label: "2 years" }, { value: "3", label: "3 years" },
  { value: "4", label: "4 years" }, { value: "5", label: "5 years" },
  { value: "6", label: "5+ years" },
];

function JobPosting() {
  const [selectedSkills, setSelectedSkills] = useState(new Map());
  const { userData } = useSelector((store) => store.auth);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "", description: "", responsibilities: [], requirements: [],
    skills: [], education: "", experience: "0", salaryRange: { from: 0, to: 0 },
    type: "Full-time", location: "", employer: "", benefits: [],
    applicationDeadline: "", workMode: "", additionalRequirements: [],
    urgent: false, numberOfOpenings: 0, primaryRole: "software_engineer",
  });

  const [dialog, setDialog] = useState({ isOpen: false, title: "", message: "", buttonText: "", onClose: null });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, skills: Array.from(selectedSkills.keys()) }));
  }, [selectedSkills]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryRangeChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, salaryRange: { ...prev.salaryRange, [id]: parseFloat(value) } }));
  };

  const handleArrayInputChange = (name, index, event) => {
    if (Array.isArray(event)) {
      setFormData((prev) => ({ ...prev, [name]: event }));
    } else {
      setFormData((prev) => {
        const arr = [...prev[name]];
        arr[index] = event.target.value;
        return { ...prev, [name]: arr };
      });
    }
  };

  // ── AI JD GENERATOR — now uses Claude via /api/v1/ai/generate-jd ──
  const handleGenerate = async () => {
    if (!formData.title) {
      setDialog({ isOpen: true, title: "Missing Job Title", message: "Please enter a job title before generating a description.", buttonText: "OK" });
      return;
    }
    setGeneratingDescription(true);
    try {
      const result = await aiService.generateJD({
        jobTitle: formData.title,
        skills: formData.skills,
        experience: formData.experience,
        location: formData.location,
        companyName: userData?.userProfile?.companyName || "",
        companyDescription: userData?.userProfile?.bio || "",
        employmentType: formData.type,
      });
      // result is { description: "<html>" }
      setFormData((prev) => ({ ...prev, description: result.description }));
    } catch (error) {
      setDialog({ isOpen: true, title: "Generation Failed", message: error?.response?.data?.message || "Could not generate description. Try again.", buttonText: "OK" });
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await companyService.postNewJob({ ...formData, employer: userData?._id });
      setDialog({ isOpen: true, title: "Job Posted!", message: "Your job listing is now live.", buttonText: "Got it!", onClose: () => navigate("/dashboard/home") });
    } catch (error) {
      setDialog({ isOpen: true, title: "Error Posting Job", message: error?.response?.data?.message || "Something went wrong.", buttonText: "Okay" });
    } finally {
      setSubmitting(false);
    }
  };

  const workModes = [
    { value: "Onsite", label: "Onsite", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { value: "Hybrid", label: "Hybrid", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
    { value: "Remote", label: "Remote", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F12] py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400">New Listing</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Post a Job</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to attract the right candidates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <SectionCard number="1" title="Job Details">
            <DarkInput label="Job Title" name="title" id="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Software Engineer" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DarkSelect label="Position Type" name="type" id="type" value={formData.type} onChange={handleInputChange} options={jobTypeOptions} required />
              <DarkSelect label="Primary Role" name="primaryRole" id="primaryRole" value={formData.primaryRole} onChange={handleInputChange} options={roleOptions} optgroup required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DarkSelect label="Experience Required" name="experience" id="experience" value={formData.experience} onChange={handleInputChange} options={experienceOptions} required />
              <DarkInput label="Location" name="location" id="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Bengaluru, India" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DarkInput label="Education" name="education" id="education" value={formData.education} onChange={handleInputChange} placeholder="e.g. B.Tech in Computer Science" />
              <DarkInput label="Application Deadline" name="applicationDeadline" id="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Work Mode <span className="text-indigo-400">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                {workModes.map((m) => (
                  <WorkModeOption key={m.value} id={m.value.toLowerCase()} name="workMode" value={m.value}
                    checked={formData.workMode === m.value} onChange={handleInputChange} label={m.label} icon={m.icon} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Required Skills <span className="text-indigo-400">*</span></label>
              <p className="text-xs text-gray-600">Search and select skills from the dropdown.</p>
              <SkillsSearch selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
            </div>
          </SectionCard>

          <SectionCard number="2" title="Additional Details">
            <DynamicListInput label="Responsibilities" name="responsibilities" values={formData.responsibilities} onChange={handleArrayInputChange} placeholder="e.g. Manage team meetings" />
            <DynamicListInput label="Requirements" name="requirements" values={formData.requirements} onChange={handleArrayInputChange} placeholder="e.g. 5+ years of experience" />
            <DynamicListInput label="Benefits" name="benefits" values={formData.benefits} onChange={handleArrayInputChange} placeholder="e.g. Health insurance" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DarkInput label="Number of Openings" name="numberOfOpenings" id="numberOfOpenings" type="number" value={formData.numberOfOpenings} onChange={handleInputChange} />
              <DarkInput label="Additional Requirements" name="additionalRequirements" id="additionalRequirements" value={formData.additionalRequirements} onChange={handleInputChange} placeholder="Any other requirements..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Salary Range (LPA)</label>
              <div className="grid grid-cols-2 gap-4">
                <DarkInput label="From" id="from" name="from" type="number" value={formData.salaryRange.from} onChange={handleSalaryRangeChange} placeholder="e.g. 8" />
                <DarkInput label="To" id="to" name="to" type="number" value={formData.salaryRange.to} onChange={handleSalaryRangeChange} placeholder="e.g. 20" />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
              <div onClick={() => setFormData((prev) => ({ ...prev, urgent: !prev.urgent }))}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${formData.urgent ? "bg-red-500 border-red-500" : "border-white/20 bg-white/[0.03]"}`}>
                {formData.urgent && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Mark as Urgent</p>
                <p className="text-xs text-gray-600 mt-0.5">This listing will be highlighted to candidates</p>
              </div>
            </label>
          </SectionCard>

          <SectionCard number="3" title="Job Description">
            <TextEditor
              label="Description" isRequired placeholder="Provide a detailed description of the role..."
              id="description" name="description" onChange={handleInputChange}
              aiButton handleGenerate={handleGenerate}
              generatingDescription={generatingDescription} value={formData.description}
            />
          </SectionCard>

          <button type="submit" disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5"
          >
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing...</>
              : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>Publish Job Listing</>
            }
          </button>
        </form>
      </div>

      <Dialogbox isOpen={dialog.isOpen} setIsOpen={(isOpen) => setDialog((prev) => ({ ...prev, isOpen }))}
        title={dialog.title} message={dialog.message} buttonText={dialog.buttonText} onClose={dialog.onClose} />
    </div>
  );
}

export default JobPosting;