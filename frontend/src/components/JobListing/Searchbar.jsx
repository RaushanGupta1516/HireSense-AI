import React, { useEffect, useState, useRef } from "react";
import { contentService } from "../../services/contentService";

// ── POPULAR SEARCHES ──
const popularSearches = [
  "React Developer",
  "Full Stack",
  "UI/UX Designer",
  "DevOps",
  "Product Manager",
  "Data Scientist",
];

function Searchbar({ setSearch, setSelectedLocation }) {
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(null); // "job" | "location"
  const locationRef = useRef(null);
  const jobRef = useRef(null);

  // ── LOCATION AUTOCOMPLETE ──
  const getLocations = async () => {
    if (!locationQuery.trim()) return;
    try {
      const res = await contentService.getJobLocations(locationQuery);
      setLocations(res || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isSearching) return;
    const timer = setTimeout(() => getLocations(), 400);
    return () => clearTimeout(timer);
  }, [locationQuery, isSearching]);

  // ── CLOSE ON OUTSIDE CLICK ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocations([]);
        setIsSearching(false);
      }
      if (jobRef.current && !jobRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleJobInputChange = (e) => {
    setJobQuery(e.target.value);
    setSearch(e.target.value);
  };

  const handleLocationInputChange = (e) => {
    setLocationQuery(e.target.value);
    setIsSearching(true);
  };

  const handleLocationSelection = (value) => {
    setLocationQuery(value);
    setLocations([]);
    setIsSearching(false);
    setSelectedLocation(value);
  };

  const handleFindJob = () => {
    setSelectedLocation(locationQuery);
    setSearch(jobQuery);
    setLocations([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleFindJob();
  };

  const handlePopularSearch = (term) => {
    setJobQuery(term);
    setSearch(term);
    setShowSuggestions(false);
  };

  const clearJob = () => { setJobQuery(""); setSearch(""); };
  const clearLocation = () => { setLocationQuery(""); setSelectedLocation(""); setLocations([]); };

  return (
    <div className="w-full space-y-3">

      {/* ── MAIN SEARCH BAR ── */}
      <div className="bg-[#131720] border border-white/10 rounded-2xl p-2 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-2">

          {/* Job Search Input */}
          <div
            ref={jobRef}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl flex-1 transition-all duration-150 ${
              focused === "job"
                ? "bg-white/5 ring-2 ring-indigo-500/30"
                : "bg-white/[0.03] hover:bg-white/5"
            }`}
          >
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              type="text"
              placeholder="Job title, skills, or company"
              value={jobQuery}
              onChange={handleJobInputChange}
              onFocus={() => { setFocused("job"); setShowSuggestions(true); }}
              onBlur={() => setFocused(null)}
              onKeyDown={handleKeyDown}
              className="bg-transparent w-full outline-none text-gray-200 placeholder-gray-600 text-sm font-medium"
            />

            {jobQuery && (
              <button onClick={clearJob} className="text-gray-600 hover:text-gray-400 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Popular searches dropdown */}
            {showSuggestions && !jobQuery && (
              <div className="absolute left-0 top-full mt-2 w-full bg-[#1C2030] border border-white/10 rounded-xl shadow-2xl z-30 p-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 px-1">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onMouseDown={() => handlePopularSearch(term)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 text-gray-400 hover:text-indigo-400 text-xs font-medium rounded-lg transition-all duration-150"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-white/5 my-2" />

          {/* Location Input */}
          <div
            ref={locationRef}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl lg:w-72 transition-all duration-150 ${
              focused === "location"
                ? "bg-white/5 ring-2 ring-indigo-500/30"
                : "bg-white/[0.03] hover:bg-white/5"
            }`}
          >
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            <input
              type="text"
              placeholder="Location"
              value={locationQuery}
              onChange={handleLocationInputChange}
              onFocus={() => setFocused("location")}
              onBlur={() => setFocused(null)}
              onKeyDown={handleKeyDown}
              className="bg-transparent w-full outline-none text-gray-200 placeholder-gray-600 text-sm font-medium"
            />

            {locationQuery && (
              <button onClick={clearLocation} className="text-gray-600 hover:text-gray-400 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Location suggestions */}
            {locations.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full bg-[#1C2030] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden">
                <ul className="max-h-56 overflow-y-auto py-1">
                  {locations.map((item, i) => (
                    <li
                      key={i}
                      onMouseDown={() => handleLocationSelection(item)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white text-sm transition-colors duration-100"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleFindJob}
            className="flex items-center justify-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:-translate-y-0.5 active:translate-y-0 text-sm shrink-0 lg:w-auto w-full"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Jobs
          </button>
        </div>
      </div>

      {/* ── QUICK FILTER PILLS ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-600 font-medium">Trending:</span>
        {popularSearches.slice(0, 5).map((term) => (
          <button
            key={term}
            onClick={() => handlePopularSearch(term)}
            className="px-3 py-1 bg-white/[0.04] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 text-gray-500 hover:text-indigo-400 text-xs font-medium rounded-full transition-all duration-150"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Searchbar;