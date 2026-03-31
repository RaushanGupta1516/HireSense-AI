import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const APPLICANT_SELECT =
  "_id userProfile.profilePicture userProfile.address userProfile.bio userProfile.location userProfile.yearsOfExperience userProfile.socialProfiles userProfile.workExperience userProfile.education userProfile.skills userProfile.name userProfile.resume userProfile.primaryRole";

const checkEmployer = (role) => {
  if (role !== "employer") throw new ApiError(403, "Access denied");
};

const hydrateApplicants = async (list, shortlistedIds = []) => {
  return Promise.all(
    list.map(async (item) => {
      const [applicantProfile, jobDetails] = await Promise.all([
        User.findById(item.applicant).select(APPLICANT_SELECT).exec(),
        Job.findById(item.job).select("_id title").exec(),
      ]);
      return {
        applicantProfile,
        jobDetails,
        isShortlisted: shortlistedIds.includes(item.applicant?.toString()),
      };
    })
  );
};

const getAllJobListings = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);
  const jobs = await Job.find({ employer: req.user._id });
  res.status(200).json(new ApiResponse(200, jobs, "Job listings fetched"));
});

const getActiveJobListings = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);
  const jobs = await Job.find({ employer: req.user._id, active: true });
  res.status(200).json(new ApiResponse(200, jobs, "Active listings fetched"));
});

const getNonActiveJobListings = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);
  const jobs = await Job.find({ employer: req.user._id, active: false });
  res.status(200).json(new ApiResponse(200, jobs, "Inactive listings fetched"));
});

const getAllApplications = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);

  const jobs = await Job.find({ employer: req.user._id });
  const shortlistedIds = jobs.flatMap(j =>
    (j.shortlistedCandidates || []).map(id => id.toString())
  );

  const raw = await Job.aggregate([
    { $match: { employer: new mongoose.Types.ObjectId(req.user._id) } },
    { $match: { "applicants.0": { $exists: true } } },
    { $unwind: "$applicants" },
    { $project: { _id: 1, applicant: "$applicants", job: "$_id" } },
  ]);

  const data = await hydrateApplicants(raw, shortlistedIds);
  res.status(200).json(new ApiResponse(200, data, "Applications fetched"));
});

const getShortListedCandidates = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);

  const raw = await Job.aggregate([
    { $match: { employer: new mongoose.Types.ObjectId(req.user._id) } },
    { $match: { "shortlistedCandidates.0": { $exists: true } } },
    { $unwind: "$shortlistedCandidates" },
    { $project: { _id: 1, applicant: "$shortlistedCandidates", job: "$_id" } },
  ]);

  const ids = raw.map(s => s.applicant?.toString());
  const data = await hydrateApplicants(raw, ids);
  res.status(200).json(new ApiResponse(200, data, "Shortlisted candidates fetched"));
});

const removeFromApplications = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);

  const { jobId, applicantId } = req.body;
  if (!jobId || !applicantId) throw new ApiError(400, "jobId and applicantId required");

  const job = await Job.findByIdAndUpdate(
    jobId,
    { $pull: { applicants: applicantId } },
    { new: true }
  );

  const company = req.user.userProfile?.companyName || "the company";
  await User.findByIdAndUpdate(applicantId, {
    $push: {
      notifications: {
        message: `Your application for "${job?.title}" at ${company} was not selected.`,
        type: "rejected",
        read: false,
        createdAt: new Date(),
      },
    },
  });

  res.status(200).json(new ApiResponse(200, {}, "Applicant removed"));
});

const shortlistCandidate = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);

  const { jobId, applicantId } = req.body;
  if (!jobId || !applicantId) throw new ApiError(400, "jobId and applicantId required");

  const job = await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { shortlistedCandidates: applicantId } },
    { new: true }
  );
  if (!job) throw new ApiError(404, "Job not found");

  const company = req.user.userProfile?.companyName || "a company";
  await User.findByIdAndUpdate(applicantId, {
    $push: {
      notifications: {
        message: `You've been shortlisted for "${job.title}" at ${company}!`,
        type: "shortlisted",
        read: false,
        createdAt: new Date(),
      },
    },
  });

  res.status(200).json(new ApiResponse(200, job, "Candidate shortlisted"));
});

const removeFromShortlist = asyncHandler(async (req, res) => {
  checkEmployer(req.user.role);

  const { jobId, applicantId } = req.body;
  if (!jobId || !applicantId) throw new ApiError(400, "jobId and applicantId required");

  await Job.findByIdAndUpdate(jobId, { $pull: { shortlistedCandidates: applicantId } });
  res.status(200).json(new ApiResponse(200, {}, "Removed from shortlist"));
});

export {
  getAllJobListings,
  getAllApplications,
  getActiveJobListings,
  getNonActiveJobListings,
  getShortListedCandidates,
  removeFromApplications,
  shortlistCandidate,
  removeFromShortlist,
};