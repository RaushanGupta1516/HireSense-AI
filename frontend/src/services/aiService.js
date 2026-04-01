

import { apiCall } from "./apiBase";

// All AI feature endpoints.
const aiService = {
  // Generates an HTML job description from job details
  generateJD: (data) => apiCall("post", "/ai/generate-jd", data),

  // Screens a resume against a job posting
  screenResume: (data) => apiCall("post", "/ai/screen-resume", data),

  // Ranks all applicants for a job
  rankCandidates: (jobId) => apiCall("get", `/ai/rank-candidates/${jobId}`),

  // Generates interview questions tailored to a candidate
  generateInterviewKit: (data) => apiCall("post", "/ai/interview-kit", data),

  // Calculates how well the current user matches a job
  getJobMatchScore: (jobId) => apiCall("get", `/ai/job-match/${jobId}`),

  // Analyzes user profile and suggests improvements
  optimizeProfile: () => apiCall("get", "/ai/optimize-profile"),

  // Estimates salary range for a role
  estimateSalary: (data) => apiCall("post", "/ai/salary-estimate", data),

  // General purpose AI chat
  chat: (message, context = {}) => apiCall("post", "/ai/chat", { message, context }),
};

export default aiService;