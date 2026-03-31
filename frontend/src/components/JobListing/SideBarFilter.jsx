import React, { useState } from "react";

const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance"];
const workModes = ["Onsite", "Hybrid", "Remote"];
const dateOptions = [
  { label: "Any time", value: "" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
];
const salaryRanges = [
  { label: "Any", from: 0, to: 10000000000 },
  { label: "Under ₹3 LPA", from: 0, to: 300000 },
  { label: "₹3L – ₹6L", from: 300000, to: 600000 },
  { label: "₹6L – ₹10L", from: 600000, to: 1000000 },
  { label: "₹10L – ₹15L", from: 1000000, to: 1500000 },
  { label: "₹15L – ₹20L", from: 1500000, to: 2000000 },
  { label: "₹20L+", from: 2000000, to: 10000000000 },
];

// ── SECTION WRAPPER ──
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
          {title}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="animate-fadeIn">{children}</div>}
    </div>
  );
}

// ── CHECKBOX ──
function DarkCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 shrink-0 ${
          checked
            ? "bg-indigo-600 border-indigo-600"
            : "border-white/20 group-hover:border-indigo-500/50 bg-white/[0.03]"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm transition-colors duration-150 ${checked ? "text-white font-medium" : "text-gray-500 group-hover:text-gray-300"}`}>
        {label}
      </span>
    </label>
  );
}

// ── RADIO ──
function DarkRadio({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-150 shrink-0 ${
          checked
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-white/20 group-hover:border-indigo-500/50 bg-white/[0.03]"
        }`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
      </div>
      <span className={`text-sm transition-colors duration-150 ${checked ? "text-white font-medium" : "text-gray-500 group-hover:text-gray-300"}`}>
        {label}
      </span>
    </label>
  );
}

function SideBarFilter({ filters, setFilters }) {

  const handleDatePostChange = (value) => {
    setFilters((prev) => ({ ...prev, datePosted: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handleExperienceChange = (value) => {
    setFilters((prev) => ({ ...prev, experience: value }));
  };

  const handleSalaryRangeChange = (from, to) => {
    setFilters((prev) => ({ ...prev, salaryRange: { from, to } }));
  };

  const clearAllFilters = () => {
    setFilters({
      datePosted: "",
      jobTypes: [],
      experience: 30,
      salaryRange: { from: 0, to: 10000000000 },
      workMode: [],
    });
  };

  // Active filter count
  const activeCount =
    (filters.datePosted ? 1 : 0) +
    filters.jobTypes.length +
    filters.workMode.length +
    (filters.salaryRange.from > 0 || filters.salaryRange.to < 10000000000 ? 1 : 0) +
    (filters.experience < 30 ? 1 : 0);

  return (
    <div className="bg-[#131720] border border-white/5 rounded-2xl p-5 sticky top-24 shadow-xl">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white text-sm">Filters</h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors duration-150 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">

        {/* ── DATE POSTED ── */}
        <FilterSection title="Date Posted">
          <div className="flex flex-col gap-0.5">
            {dateOptions.map((opt) => (
              <DarkRadio
                key={opt.value}
                label={opt.label}
                checked={filters.datePosted === opt.value}
                onChange={() => handleDatePostChange(opt.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* ── JOB TYPE ── */}
        <FilterSection title="Job Type">
          <div className="grid grid-cols-2 gap-0.5">
            {jobTypes.map((type) => (
              <DarkCheckbox
                key={type}
                label={type}
                checked={filters.jobTypes.includes(type)}
                onChange={() => toggleArrayFilter("jobTypes", type)}
              />
            ))}
          </div>
        </FilterSection>

        {/* ── EXPERIENCE ── */}
        <FilterSection title="Experience">
          <div className="px-1">
            {/* Custom range track */}
            <div className="relative mb-3">
              <input
                type="range"
                min="0"
                max="30"
                value={filters.experience}
                onChange={(e) => handleExperienceChange(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${(filters.experience / 30) * 100}%, rgba(255,255,255,0.1) ${(filters.experience / 30) * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">0 yrs</span>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                Up to {filters.experience} yrs
              </span>
              <span className="text-xs text-gray-600">30 yrs</span>
            </div>
          </div>
        </FilterSection>

        {/* ── SALARY RANGE ── */}
        <FilterSection title="Salary Range">
          <div className="flex flex-col gap-0.5">
            {salaryRanges.map((range, i) => (
              <DarkRadio
                key={i}
                label={range.label}
                checked={
                  filters.salaryRange.from === range.from &&
                  filters.salaryRange.to === range.to
                }
                onChange={() => handleSalaryRangeChange(range.from, range.to)}
              />
            ))}
          </div>
        </FilterSection>

        {/* ── WORK MODE ── */}
        <FilterSection title="Work Mode">
          <div className="flex flex-col gap-0.5">
            {workModes.map((mode) => (
              <DarkCheckbox
                key={mode}
                label={mode}
                checked={filters.workMode.includes(mode)}
                onChange={() => toggleArrayFilter("workMode", mode)}
              />
            ))}
          </div>
        </FilterSection>

      </div>

      {/* ── APPLY BUTTON ── */}
      <button
        onClick={() => {}}
        className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30"
      >
        Apply Filters
        {activeCount > 0 && ` (${activeCount})`}
      </button>
    </div>
  );
}

export default SideBarFilter;