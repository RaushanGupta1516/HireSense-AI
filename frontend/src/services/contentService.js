import { apiCall } from "./apiBase";

// API calls for public content — jobs, companies, etc.
export const contentService = {
  getJobs,
  getSingleJob,
  getJobLocations,
  getCompanies,
  getSavedJobs,
};

function getJobs(filters) {
  let params = new URLSearchParams();
  params.append("search", filters.search);
  params.append("datePosted", filters.datePosted);
  params.append("experience", filters.experience);
  params.append("salaryFrom", filters.salaryRange.from);
  params.append("salaryTo", filters.salaryRange.to);
  params.append("location", filters.location);
  filters.jobTypes.forEach((jobType) => params.append("type", jobType));
  filters.workMode.forEach((workMode) => params.append("workMode", workMode));

  return apiCall("get", "/jobs", { params: params });
}

function getSingleJob(id) {
  return apiCall("get", `/jobs/${id}`);
}

function getJobLocations(location) {
  return apiCall("get", "/job-locations", { params: { search: location } });
}

function getCompanies() {
  return apiCall("get", "/companies");
}

function getSavedJobs() {
  return apiCall("get", "/users/saved-jobs");
}