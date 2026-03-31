import { apiCall } from "./apiBase";

// All API calls related to the 'company' or 'employer' role.
export const companyService = {
  postNewJob,
  getJobListings, // Merged getAllJobListings and getCompanyJobListings
  generateJD: (data) => apiCall("post", "/ai/generate-jd", data), // Re-using AI service for convenience
  getActiveListings,
  getInactiveListings,
  getApplications,
  getShortlisted,
  shortlistCandidate,
  removeApplication,
  removeShortlisted,
};

function postNewJob(data) {
  return apiCall("post", "/jobs", data);
}

// Renamed and combined two identical functions.
function getJobListings() {
  return apiCall("get", "/company/listings");
}

function getActiveListings() {
  return apiCall("get", "/company/active-listings");
}

function getInactiveListings() {
  return apiCall("get", "/company/non-active-listings");
}

function getApplications() {
  return apiCall("get", "/company/applications");
}

function getShortlisted() {
  return apiCall("get", "/company/shortlisted-candidates");
}

function shortlistCandidate(data) {
  return apiCall("post", "/company/shortlist-candidate", data);
}

function removeApplication(data) {
  return apiCall("post", "/company/remove-from-applications", data);
}

function removeShortlisted(data) {
  return apiCall("post", "/company/remove-from-shortlisted", data);
}