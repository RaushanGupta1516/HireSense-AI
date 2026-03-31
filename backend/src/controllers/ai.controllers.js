import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  generateJobDescription,
  screenResume,
  rankCandidates,
  generateInterviewKit,
  getJobMatchScore,
  optimizeProfile,
  estimateSalary,
  aiChat,
} from "../utils/openAi.service.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import Groq from "groq-sdk";

const generateJD = asyncHandler(async (req, res) => {
  const { jobTitle, skills, experience, location, companyName, companyDescription, employmentType } = req.body;

  if (!jobTitle) throw new ApiError(400, "Job title is required");

  const result = await generateJobDescription({
    jobTitle, skills, experience, location,
    companyName, companyDescription, employmentType,
  });

  res.status(200).json(new ApiResponse(200, { description: result }, "JD generated"));
});

const screenResumeController = asyncHandler(async (req, res) => {
  const { resumeText, jobId } = req.body;

  if (!resumeText) throw new ApiError(400, "Resume text is required");
  if (!jobId) throw new ApiError(400, "Job ID is required");

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  const result = await screenResume(resumeText, job.description || job.title, job.skills || []);
  res.status(200).json(new ApiResponse(200, result, "Resume screened"));
});

const rankCandidatesController = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  // merge applicants and shortlisted, then deduplicate
  const allIds = [...(job.applicants || []), ...(job.shortlistedCandidates || [])];
  const uniqueIds = [...new Map(allIds.map(id => [id.toString(), id])).values()];

  if (!uniqueIds.length) throw new ApiError(400, "No applicants to rank");

  const users = await User.find({ _id: { $in: uniqueIds } }).select(
    "_id userProfile.name userProfile.skills userProfile.yearsOfExperience userProfile.primaryRole userProfile.bio"
  );

  if (!users.length) throw new ApiError(400, "No applicants to rank");

  const candidates = users.map(u => ({
    id: u._id.toString(),
    name: u.userProfile?.name || "Unknown",
    skills: u.userProfile?.skills || [],
    yearsOfExperience: u.userProfile?.yearsOfExperience || 0,
    primaryRole: u.userProfile?.primaryRole || "",
    bio: u.userProfile?.bio || "",
  }));

  const result = await rankCandidates(candidates, job.title, job.description || job.title, job.skills || []);
  res.status(200).json(new ApiResponse(200, result, "Candidates ranked"));
});

const generateInterviewKitController = asyncHandler(async (req, res) => {
  const { candidateId, jobId } = req.body;

  if (!candidateId || !jobId) throw new ApiError(400, "Candidate ID and Job ID required");

  const [candidate, job] = await Promise.all([
    User.findById(candidateId).select("userProfile"),
    Job.findById(jobId),
  ]);

  if (!candidate) throw new ApiError(404, "Candidate not found");
  if (!job) throw new ApiError(404, "Job not found");

  const profile = candidate.userProfile || {};
  const resumeText = `
    Name: ${profile.name || "Candidate"}
    Skills: ${profile.skills?.join(", ") || "Not listed"}
    Experience: ${profile.yearsOfExperience || 0} years
    Role: ${profile.primaryRole || "Not specified"}
    Bio: ${profile.bio || ""}
    Work Experience: ${JSON.stringify(profile.workExperience || [])}
  `.trim();

  const result = await generateInterviewKit(profile.name || "Candidate", resumeText, job.title, job.description || job.title);
  res.status(200).json(new ApiResponse(200, result, "Interview kit generated"));
});

const jobMatchScoreController = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  const result = await getJobMatchScore(
    req.user.userProfile || {},
    job.title,
    job.description || job.title,
    job.skills || []
  );

  res.status(200).json(new ApiResponse(200, result, "Match score calculated"));
});

const optimizeProfileController = asyncHandler(async (req, res) => {
  const result = await optimizeProfile(req.user.userProfile || {});
  res.status(200).json(new ApiResponse(200, result, "Profile analyzed"));
});

const salaryEstimatorController = asyncHandler(async (req, res) => {
  const { jobTitle, location, experienceYears, skills } = req.body;

  if (!jobTitle) throw new ApiError(400, "Job title is required");

  const result = await estimateSalary(
    jobTitle,
    location || "India",
    experienceYears || 0,
    skills || []
  );

  res.status(200).json(new ApiResponse(200, result, "Salary estimated"));
});

const aiChatController = asyncHandler(async (req, res) => {
  const { message, context } = req.body;

  if (!message) throw new ApiError(400, "Message is required");

  const result = await aiChat(message, context || {});
  res.status(200).json(new ApiResponse(200, { reply: result }, "Chat response"));
});

const parseResumeController = asyncHandler(async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) throw new ApiError(400, "Resume text is required");

  const prompt = `You are a resume parser. Extract structured data from the resume below.

RESUME:
${resumeText.substring(0, 3000)}

Return ONLY valid JSON with this shape:
{"name":"","primaryRole":"","yearsOfExperience":0,"location":"","bio":"","skills":[],"education":[{"degree":"","institution":"","year":""}],"workExperience":[{"jobTitle":"","company":"","duration":""}]}

Rules:
- Extract up to 15 skills
- Write bio in first person (2-3 sentences)
- Use null for missing fields`;

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  res.status(200).json(new ApiResponse(200, parsed, "Resume parsed"));
});

export {
  generateJD,
  screenResumeController,
  rankCandidatesController,
  generateInterviewKitController,
  jobMatchScoreController,
  optimizeProfileController,
  salaryEstimatorController,
  aiChatController,
  parseResumeController,
};