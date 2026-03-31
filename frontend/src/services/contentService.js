import { apiCall } from "./apiBase";

// API calls for public-facing content like job listings and company profiles.
export const contentService = {
  getJobs,
  getSingleJob,
  getJobLocations,
  getCompanies,
  getSavedJobs,
};

/**
 * Fetches a paginated and filtered list of jobs.
 * @param {object} filters - An object containing all filter criteria.
 * @returns {Promise<object>}
 */
function getJobs(filters = {}) {
  const params = {
    search: filters.search,
    datePosted: filters.datePosted,
    experience: filters.experience,
    salaryFrom: filters.salaryRange?.from,
    salaryTo: filters.salaryRange?.to,
    location: filters.location,
    type: filters.jobTypes,
    workMode: filters.workMode,
  };

  // A real developer would clean up the params to avoid sending empty values.
  // This prevents URLs like `/jobs?search=&location=undefined`.
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete params[key];
    }
  });

  return apiCall("get", "/jobs", { params });
}

/**
 * Fetches a single job by its ID.
 * @param {string} id - The job's ID.
 */
function getSingleJob(id) {
  return apiCall("get", `/jobs/${id}`);
}

/**
 * Fetches a list of job locations for autocomplete.
 * @param {string} location - The search term for the location.
 */
function getJobLocations(location) {
  // Only send the param if a search term is provided.
  const params = location ? { search: location } : {};
  return apiCall("get", "/job-locations", { params });
}

/**

 * Fetches a list of all companies with active job listings.
 */
function getCompanies() {
  return apiCall("get", "/companies");
}

/**
 * Fetches the saved jobs for the currently logged-in user.
 */
function getSavedJobs() {
  // This is a user-specific action, so it hits the /users endpoint.
  return apiCall("get", "/users/saved-jobs");
}