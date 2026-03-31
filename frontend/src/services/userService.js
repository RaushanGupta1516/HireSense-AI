import { apiCall } from "./apiBase";

// All API calls related to user accounts, profiles, and actions.
export const userService = {
  login,
  signup,
  logout,
  refreshToken,
  getCurrentUser,
  updateProfilePicture,
  updateUserProfile,
  addSkill,
  removeSkill,
  updateResume,
  saveJob,
  removeSavedJob,
  applyForJob,
  getPublicProfile,
};

function login(userData) {
  return apiCall("post", "/users/login", userData);
}

function signup(userData) {
  return apiCall("post", "/users/signup", userData);
}

function logout() {
  return apiCall("post", "/users/logout");
}

function refreshToken() {
  return apiCall("post", "/users/refresh-token");
}

function getCurrentUser() {
  return apiCall("get", "/users/profile");
}

function updateUserProfile(data) {
  return apiCall("patch", "/users/profile/update", data);
}

/**
 * Uploads a profile picture file.
 * @param {File} file - The image file from an input.
 */
function updateProfilePicture(file) {
  const formPayload = new FormData();
  formPayload.append("profilePicture", file);
  return apiCall("post", "/users/profile-picture", formPayload, {
    // The browser will set the correct boundary for multipart/form-data
    // so we don't need to specify the header here.
  });
}

function addSkill(skill) {
  return apiCall("post", "/users/add-skill", { skill });
}

function removeSkill(skill) {
  return apiCall("post", "/users/remove-skill", { skill });
}

function updateResume(resume) {
  return apiCall("post", "/users/resume", { resume });
}

function saveJob(jobId) {
  return apiCall("post", `/users/saved-jobs/${jobId}`);
}

function removeSavedJob(jobId) {
  return apiCall("delete", `/users/saved-jobs/${jobId}`);
}

function applyForJob(jobId) {
  return apiCall("post", `/apply/${jobId}`);
}

function getPublicProfile(userId) {
  return apiCall("get", `/users/public-profile/${userId}`);
}