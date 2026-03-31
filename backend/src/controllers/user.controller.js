import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.service.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const ping     = (req, res) => res.send("User API is working");
export const authPing = (req, res) => res.send("User Auth is working");

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken  = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, userProfile } = req.body;

  if (!email || !password) throw new ApiError(400, "Email and password required");
  if (!role) throw new ApiError(400, "Role is required");

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, "Account already exists with this email");

  const username = email.split("@")[0].toLowerCase();

  const user = await User.create({
    email: email.toLowerCase(),
    username,
    password,
    role,
    userProfile: userProfile || {},
  });

  const created = await User.findById(user._id).select("-password -refreshToken");
  if (!created) throw new ApiError(500, "Something went wrong during registration");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(201)
    .json(new ApiResponse(201, { user: created, accessToken, refreshToken }, "Registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new ApiError(404, "No account found with this email");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Incorrect password");

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw new ApiError(401, "Refresh token missing");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token, please log in again");
  }

  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(401, "User not found");
  if (user.refreshToken !== token) throw new ApiError(401, "Session expired, please log in again");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
});

const ALLOWED_PROFILE_FIELDS = [
  "contactNumber", "address", "dateOfBirth", "gender", "nationality",
  "savedJobs", "profilePicture", "resume", "certifications", "languages",
  "interests", "projectExperience", "name", "location", "primaryRole",
  "yearsOfExperience", "bio", "skills", "education", "workExperience",
  "applications", "socialProfiles", "publicProfile", "jobPreferences",
  "doneOnboarding", "companyName", "companyDescription", "companySize",
  "companyLogo", "companySocialProfiles",
];

export const updateUserProfile = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);

  const invalid = updates.filter((f) => !ALLOWED_PROFILE_FIELDS.includes(f));
  if (invalid.length) throw new ApiError(400, `Invalid fields: ${invalid.join(", ")}`);

  const payload = {};
  updates.forEach((f) => (payload[`userProfile.${f}`] = req.body[f]));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: payload },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

export const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file?.path) throw new ApiError(400, "No file uploaded");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const oldUrl = user.userProfile?.profilePicture || user.userProfile?.companyLogo;

  const uploaded = await uploadOnCloudinary(req.file.path);
  if (!uploaded?.url) throw new ApiError(500, "Cloudinary upload failed");

  const field = user.role === "jobSeeker" ? "profilePicture" : "companyLogo";
  user.userProfile[field] = uploaded.url;
  user.markModified("userProfile");
  await user.save();

  // cleanup old pic, best effort
  if (oldUrl && !oldUrl.includes("Default_pfp.svg")) {
    try {
      const publicId = oldUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err.message);
    }
  }

  const updated = await User.findById(req.user._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, updated, "Profile picture updated"));
});

export const addSkill = asyncHandler(async (req, res) => {
  if (req.user.role !== "jobSeeker") throw new ApiError(403, "Only job seekers can add skills");

  const { skill } = req.body;
  if (!skill) throw new ApiError(400, "Skill is required");

  const user = await User.findById(req.user._id);
  if (user.userProfile.skills.includes(skill)) throw new ApiError(409, "Skill already added");

  user.userProfile.skills.push(skill);
  user.markModified("userProfile.skills");
  await user.save();

  return res.status(200).json(new ApiResponse(200, user.userProfile.skills, "Skill added"));
});

export const removeSkill = asyncHandler(async (req, res) => {
  if (req.user.role !== "jobSeeker") throw new ApiError(403, "Only job seekers can remove skills");

  const { skill } = req.body;
  if (!skill) throw new ApiError(400, "Skill is required");

  const user = await User.findById(req.user._id);
  user.userProfile.skills = user.userProfile.skills.filter((s) => s !== skill);
  user.markModified("userProfile.skills");
  await user.save();

  return res.status(200).json(new ApiResponse(200, user.userProfile.skills, "Skill removed"));
});

export const updateResume = asyncHandler(async (req, res) => {
  if (req.user.role !== "jobSeeker") throw new ApiError(403, "Only job seekers can update resume");

  const { resume } = req.body;
  if (!resume) throw new ApiError(400, "Resume link is required");

  const user = await User.findById(req.user._id);
  user.userProfile.resume = resume;
  user.markModified("userProfile.resume");
  await user.save();

  return res.status(200).json(new ApiResponse(200, { resume }, "Resume updated"));
});

export const savedJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) throw new ApiError(400, "Job ID required");

  const user = await User.findById(req.user._id);
  const isSaved = user.userProfile.savedJobs?.includes(jobId);

  if (isSaved) {
    user.userProfile.savedJobs = user.userProfile.savedJobs.filter(
      (id) => id.toString() !== jobId
    );
    user.markModified("userProfile.savedJobs");
    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Job removed from saved"));
  }

  user.userProfile.savedJobs = [...(user.userProfile.savedJobs || []), jobId];
  user.markModified("userProfile.savedJobs");
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Job saved"));
});

export const removeSavedJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) throw new ApiError(400, "Job ID required");

  const user = await User.findById(req.user._id);
  user.userProfile.savedJobs = (user.userProfile.savedJobs || []).filter(
    (id) => id.toString() !== jobId
  );
  user.markModified("userProfile.savedJobs");
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Job removed from saved"));
});

export const userPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "email _id userProfile.profilePicture userProfile.address userProfile.bio userProfile.location userProfile.yearsOfExperience userProfile.socialProfiles userProfile.workExperience userProfile.education userProfile.skills userProfile.name userProfile.resume userProfile.primaryRole"
  );
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "Public profile fetched"));
});

export const getNotifications = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("notifications");
  const sorted = (user.notifications || []).sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json(new ApiResponse(200, sorted, "Notifications fetched"));
});

export const markNotificationsRead = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { $set: { "notifications.$[].read": true } }
  );

  return res.status(200).json(new ApiResponse(200, {}, "Marked as read"));
});