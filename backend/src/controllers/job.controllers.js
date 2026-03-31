import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateJobDescription } from "../utils/openAi.service.js";
import { User } from "../models/user.model.js";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);

export const ping = (req, res) => res.json({ msg: "API is healthy!" });
export const authPing = (req, res) => res.send("Job Auth is working");

export const getJobs = asyncHandler(async (req, res) => {
  const query = { active: true };

  let page  = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;

  const skip = (page - 1) * limit;

  if (req.query.search) {
    const r = { $regex: req.query.search, $options: "i" };
    query.$or = [{ title: r }, { description: r }];
  }

  if (req.query.datePosted) {
    const now = new Date();
    const dateMap = {
      today:      new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      this_week:  new Date(Date.now() - 7  * 24 * 60 * 60 * 1000),
      this_month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };
    if (dateMap[req.query.datePosted]) {
      query.datePosted = { $gte: dateMap[req.query.datePosted] };
    }
  }

  if (req.query.type)       query.type     = req.query.type;
  if (req.query.workMode)   query.workMode = req.query.workMode;
  if (req.query.location)   query.location = { $regex: req.query.location, $options: "i" };
  if (req.query.experience) query.experience = { $lte: Number(req.query.experience) };

  if (req.query.salaryFrom && req.query.salaryTo) {
    const from = Number(req.query.salaryFrom);
    const to   = Number(req.query.salaryTo);
    query.$or = [
      { "salaryRange.from": { $gte: from, $lte: to } },
      { "salaryRange.to":   { $gte: from, $lte: to } },
      { "salaryRange.from": { $lte: from }, "salaryRange.to": { $gte: to } },
    ];
  }

  const [total, jobs] = await Promise.all([
    Job.countDocuments(query),
    Job.find(query)
      .populate({ path: "employer", select: "userProfile.companyLogo userProfile.companyName" })
      .sort({ datePosted: -1 })
      .skip(skip)
      .limit(limit)
      .select("-applicants -shortlistedCandidates"),
  ]);

  const pagination = {};
  if (skip + limit < total) pagination.next = { page: page + 1, limit };
  if (skip > 0)             pagination.prev = { page: page - 1, limit };

  return res.status(200).json(
    new ApiResponse(200, { jobs, pagination, total }, "Jobs fetched successfully")
  );
});

export const getJobById = asyncHandler(async (req, res) => {
  const jobDoc = await Job.findById(req.params.id).populate({
    path: "employer",
    select: "userProfile.companyLogo userProfile.companyName",
  });

  if (!jobDoc) throw new ApiError(404, "Job not found");

  const job = jobDoc.toObject();
  job.numberOfApplicants = job.applicants?.length || 0;
  job.description = DOMPurify.sanitize(job.description || "");
  job.applicants = (job.applicants || []).map((id) => id.toString()); // only ids, not full docs

  return res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"));
});

export const postJob = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  if (role !== "employer") throw new ApiError(403, "Only employers can post jobs");

  const { title, description } = req.body;
  if (!title)       throw new ApiError(400, "Title is required");
  if (!description) throw new ApiError(400, "Description is required");

  const job = await Job.create({ ...req.body, employer: _id });

  await User.findByIdAndUpdate(_id, { $push: { "userProfile.jobListings": job._id } });

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});

export const sendJobDescription = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  if (role !== "employer") throw new ApiError(403, "Only employers can generate job descriptions");

  const user = await User.findById(_id);
  if (!user) throw new ApiError(404, "User not found");

  if ((user.userProfile?.aiUseLimit ?? 0) < 1)
    throw new ApiError(429, "AI usage limit hit. Upgrade your plan.");

  const response = await generateJobDescription(req.body);
  if (!response) throw new ApiError(500, "Failed to generate job description");

  await User.findByIdAndUpdate(_id, { $inc: { "userProfile.aiUseLimit": -1 } });

  return res.status(200).json(new ApiResponse(200, response, "Job description generated"));
});

export const applyForJob = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  if (role !== "jobSeeker") throw new ApiError(403, "Only job seekers can apply");

  const job = await Job.findById(req.params.id);
  if (!job)        throw new ApiError(404, "Job not found");
  if (!job.active) throw new ApiError(400, "This job is no longer active");
  if (job.applicants.includes(_id)) throw new ApiError(400, "Already applied for this job");

  job.applicants.push(_id);
  await job.save();

  await User.findByIdAndUpdate(_id, {
    $addToSet: { "userProfile.applications": job._id },
  });

  return res.status(200).json(new ApiResponse(200, {}, "Application submitted"));
});

export const saveJob = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  if (role !== "jobSeeker") throw new ApiError(403, "Only job seekers can save jobs");

  const { id: jobId } = req.params;

  const [job, user] = await Promise.all([Job.findById(jobId), User.findById(_id)]);
  if (!job) throw new ApiError(404, "Job not found");

  const alreadySaved = user.userProfile.savedJobs.some((id) => id.toString() === jobId);
  if (alreadySaved) throw new ApiError(400, "Job already saved");

  await User.findByIdAndUpdate(_id, { $addToSet: { "userProfile.savedJobs": jobId } });

  return res.status(200).json(new ApiResponse(200, {}, "Job saved"));
});

export const getJobLocations = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.search) query.location = { $regex: req.query.search, $options: "i" };

  const locations = await Job.distinct("location", query);
  const filtered  = locations.filter(Boolean).slice(0, 5);

  return res.status(200).json(new ApiResponse(200, filtered, "Locations fetched"));
});

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await User.find({
    role: "employer",
    "userProfile.doneOnboarding": true,
    "userProfile.jobListings.0": { $exists: true },
  }).select(
    "userProfile.companyName userProfile.companyLogo userProfile.jobListings userProfile.companySize userProfile.companySocialProfiles"
  );

  const hydrated = await Promise.all(
    companies.map(async (c) => {
      const obj = c.toObject();
      const listings = await Promise.all(
        obj.userProfile.jobListings.map((id) =>
          Job.findById(id).select("title location _id active").lean()
        )
      );
      obj.userProfile.jobListings = listings.filter(Boolean);
      return obj;
    })
  );

  return res.status(200).json(new ApiResponse(200, hydrated, "Companies fetched successfully"));
});

export const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  const savedIds = user?.userProfile?.savedJobs || [];

  const savedJobs = await Promise.all(
    savedIds.map((id) =>
      Job.findById(id)
        .populate({ path: "employer", select: "userProfile.companyLogo userProfile.companyName" })
        .select("salaryRange _id title location type workMode datePosted")
        .lean()
    )
  );

  return res.status(200).json(
    new ApiResponse(200, savedJobs.filter(Boolean), "Saved jobs fetched")
  );
});

export const removeSavedJob = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  if (role !== "jobSeeker") throw new ApiError(403, "Only job seekers can do this");

  await User.findByIdAndUpdate(_id, {
    $pull: { "userProfile.savedJobs": req.params.id },
  });

  return res.status(200).json(new ApiResponse(200, {}, "Job removed from saved list"));
});