import { apiCall } from "./apiBase";

// All functions for interacting with the AI backend endpoints.
const aiService = {
  /**
   * Generates a job description from a set of details.
   * @param {object} data - { jobTitle, skills[], ... }
   * @returns {Promise<object>} - { description: "<html string>" }
   */
  generateJD: (data) => apiCall("post", "/ai/generate-jd", data),

  /**
   * Screens a resume against a job.
   * @param {object} data - { resumeText, jobId }
   * @returns {Promise<object>} - { overallScore, ... }
   */
  screenResume: (data) => apiCall("post", "/ai/screen-resume", data),

  /**
   * Ranks all applicants for a given job.
   * @param {string} jobId
   * @returns {Promise<array>} - [{ candidateId, name, fitScore, ... }]
   */
  rankCandidates: (jobId) => apiCall("get", `/ai/rank-candidates/${jobId}`),

  /**
   * Creates a set of interview questions for a candidate/job.
   * @param {object} data - { candidateId, jobId }
   * @returns {Promise<object>} - { technicalQuestions[], ... }
   */
  generateInterviewKit: (data) => apiCall("post", "/ai/interview-kit", data),

  /**
   * Calculates a match score for the current user against a job.
   * @param {string} jobId
   * @returns {Promise<object>} - { matchScore, ... }
   */
  getJobMatchScore: (jobId) => apiCall("get", `/ai/job-match/${jobId}`),

  /**
   * Analyzes the current user's profile and suggests improvements.
   * @returns {Promise<object>} - { overallScore, improvements[], ... }
   */
  optimizeProfile: () => apiCall("get", "/ai/optimize-profile"),

  /**
   * Estimates the salary for a role.
   * @param {object} data - { jobTitle, location, experienceYears, ... }
   * @returns {Promise<object>} - { low, mid, high, ... }
   */
  estimateSalary: (data) => apiCall("post", "/ai/salary-estimate", data),

  /**
   * Sends a message to the general-purpose AI chat.
   * @param {string} message
   * @param {object} context - Optional context for the conversation.
   * @returns {Promise<object>} - { reply: "<string>" }
   */
  chat: (message, context = {}) => apiCall("post", "/ai/chat", { message, context }),
};

export default aiService;