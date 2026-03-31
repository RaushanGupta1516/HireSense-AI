import React, { useState, useEffect, useRef } from "react";
import { externalApiServices } from "../../services/externalApiServices";
import { userService } from "../../services/userService";

function SkillsSearch({ selectedSkills, setSelectedSkills, profile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSearchTerm("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search on every keystroke — local DB so no debounce needed
  const handleChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!val.trim()) { setResults([]); return; }
    const found = externalApiServices.searchSkills(val);
    // filter already selected
    Promise.resolve(found).then((data) => {
      setResults((data || []).filter((s) => !selectedSkills.has(s.name)));
    });
  };

  const addSkill = async (skillName) => {
    if (profile) {
      try { await userService.addSkill(skillName); } catch {}
    }
    const updated = new Map(selectedSkills);
    updated.set(skillName, true);
    setSelectedSkills(updated);
    setSearchTerm("");
    setResults([]);
  };

  const removeSkill = async (skillName) => {
    if (profile) {
      try { await userService.removeSkill(skillName); } catch {}
    }
    const updated = new Map(selectedSkills);
    updated.delete(skillName);
    setSelectedSkills(updated);
  };

  const showDropdown = searchTerm.trim().length > 0;

  return (
    <div ref={wrapperRef} className="space-y-3">

      {/* Selected pills */}
      {selectedSkills.size > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from(selectedSkills.keys()).map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium rounded-lg">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + dropdown wrapper */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="e.g. Python, React, Data Analysis"
          autoComplete="off"
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
        />

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C2030] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden" style={{ zIndex: 99999 }}>
            {results.length > 0 ? (
              <ul>
                {results.map((skill, i) => (
                  <li
                    key={i}
                    onMouseDown={(e) => { e.preventDefault(); addSkill(skill.name); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-indigo-500/10 hover:text-white cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div
                onMouseDown={(e) => { e.preventDefault(); addSkill(searchTerm.trim()); }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-indigo-500/10 hover:text-white cursor-pointer transition-colors"
              >
                <span className="text-indigo-400 text-base">+</span>
                Add <span className="font-semibold text-white mx-1">"{searchTerm}"</span> as a skill
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillsSearch;