import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

const notificationSchema = new Schema({
  message:   { type: String, required: true },
  // type helps frontend decide which icon/color to show
  type:      { type: String, enum: ["shortlisted", "rejected", "application", "general"], default: "general" },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema({
  username:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true, select: false }, // never comes back in queries by default
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  role:          { type: String, required: true, enum: ["jobSeeker", "employer"] },
  refreshToken:  { type: String, select: false },
  userProfile:   { type: Schema.Types.Mixed, default: {} }, // shape depends on role, see pre-save below
  notifications: { type: [notificationSchema], default: [] },
}, { timestamps: true });

// default profile shape based on role — only runs on first save
const jobSeekerDefaults = {
  name: "", bio: "", location: "", primaryRole: "",
  yearsOfExperience: "", resume: "",
  profilePicture: DEFAULT_AVATAR,
  skills: [], education: [], workExperience: [], applications: [],
  savedJobs: [], certifications: [], languages: [], interests: [],
  projectExperience: [], socialProfiles: {}, publicProfile: true,
  doneOnboarding: false, aiUseLimit: 1,
};

const employerDefaults = {
  companyName: "", companyDescription: "",
  companyLogo: DEFAULT_AVATAR,
  companyWebsite: "", companySize: { from: 0, to: 0 },
  industry: "", jobListings: [], employeeBenefits: {},
  companySocialProfiles: {}, doneOnboarding: false, aiUseLimit: 1,
};

userSchema.pre("save", function (next) {
  if (!this.isNew) return next();

  const defaults = this.role === "jobSeeker" ? jobSeekerDefaults : employerDefaults;
  this.userProfile = { ...defaults, ...(this.userProfile || {}) };
  this.markModified("userProfile");
  next();
});

// hash password only when it's changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );
};

// refresh token only needs id, less data in the token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

export const User = mongoose.model("User", userSchema);