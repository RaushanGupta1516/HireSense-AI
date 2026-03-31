import React, { useState, useEffect } from "react";
import Searchbar from "./Searchbar";
import SideBarFilter from "./SideBarFilter";
import JobCard from "./JobCard";
import { contentService } from "../../services/contentService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MainJobSection() {
  const [filters, setFilters] = useState({
    datePosted: "",
    jobTypes: [],
    experience: 30,
    salaryRange: { from: 0, to: 10000000000 },
    workMode: [],
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const { userData } = useSelector((store) => store.auth);
  const isCandidate = userData?.role === "jobSeeker";

  const getJobs = async (filters) => {
    setLoading(true);
    try {
      const res = await contentService.getJobs(filters);
      if (res) setJobs(res.jobs);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getJobs({ ...filters, search, location: selectedLocation });
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters, search, selectedLocation]);

  const redirectToDetail = (id) => navigate(`/job/${id}`);

  return (
    <div className="flex flex-col lg:flex-row gap-8">

      {/* Sidebar */}
      <div className="hidden lg:block lg:w-[28%]">
        <div className="sticky top-24">
          <SideBarFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* Jobs */}
      <div className="w-full lg:w-[72%]">
        <div className="mb-6">
          <Searchbar setSearch={setSearch} search={search} setSelectedLocation={setSelectedLocation} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm font-medium">
            {loading ? "Searching..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
          </p>
          {isCandidate && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-medium text-indigo-400">AI Match Active</span>
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#131720] border border-white/5 rounded-2xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 w-20 bg-white/5 rounded-full" />
                    <div className="h-6 w-24 bg-white/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No jobs found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or search term</p>
            </div>
          )}

          {!loading && jobs.map((job) => (
            <JobCard key={job._id} job={job} redirectToDetail={redirectToDetail} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainJobSection;