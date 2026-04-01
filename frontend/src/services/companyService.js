import { apiCall } from "./apiBase";

// All API calls for the employer/recruiter dashboard.
export const companyService = {
  postNewJob,
  getAllJobListings,
  getCompanyJobListings,
  generateJobDescription,
  getActiveJobListings,
  getNonActiveJobListings,
  getAllApplications,
  getShortListedCandidates,
  shortlistCandidate,
  removeApplication,
  removeFromShortlist,
};

function postNewJob(data) {
  return apiCall("post", "/jobs", data);
}

function generateJobDescription(data) {
  return apiCall("post", "/ai/generate-jd", data);
}

function getAllJobListings() {
  return apiCall("get", "/company/listings");
}

// same endpoint as getAllJobListings, kept for backward compat
function getCompanyJobListings() {
  return apiCall("get", "/company/listings");
}

function getActiveJobListings() {
  return apiCall("get", "/company/active-listings");
}

function getNonActiveJobListings() {
  return apiCall("get", "/company/non-active-listings");
}

function getAllApplications() {
  return apiCall("get", "/company/applications");
}

function getShortListedCandidates() {
  return apiCall("get", "/company/shortlisted-candidates");
}

function shortlistCandidate(data) {
  return apiCall("post", "/company/shortlist-candidate", data);
}

function removeApplication(data) {
  return apiCall("post", "/company/remove-from-applications", data);
}

function removeFromShortlist(data) {
  return apiCall("post", "/company/remove-from-shortlisted", data);
}