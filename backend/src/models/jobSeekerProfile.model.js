import mongoose, { Schema } from "mongoose";
import { socialProfilesSchema } from "./socialProfiles.schema.js";

const certificationSchema = new Schema({
  name:                String,
  issuingOrganization: String,
  dateObtained:        Date,
  link:                String,
});

const languageSchema = new Schema({
  language:    String,
  proficiency: String,
});

const educationSchema = new Schema({
  institution:  String,
  degree:       String,
  fieldOfStudy: String,
  startYear:    Number,
  endYear:      Number,
});

const workExperienceSchema = new Schema({
  jobTitle: String,
  company: {
    name:    String,
    logoUrl: { type: String, default: "" },
    domain:  String,
  },
  startMonth:  Date,
  endMonth:    Date,
  currentJob:  { type: Boolean, default: false },
  description: String,
});

const projectExperienceSchema = new Schema({
  projectName: String,
  description: String,
  role:        String,
});

const jobPreferencesSchema = new Schema({
  types:      [String],
  industries: [String],
  locations:  [String],
});

const jobSeekerProfileSchema = new Schema({
  contactNumber:  String,
  doneOnboarding: { type: Boolean, default: false },
  address: {
    city:    String,
    state:   String,
    country: String,
  },
  dateOfBirth:  Date,
  gender:       String,
  nationality:  String,
  savedJobs:    [{ type: Schema.Types.ObjectId, ref: "Job" }],
  profilePicture: {
    type:    String,
    default: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
  },
  resume:            String,
  certifications:    [certificationSchema],
  languages:         [languageSchema],
  interests:         [String],
  projectExperience: [projectExperienceSchema],
  name:              { type: String, default: "" },
  location:          String,
  bio:               String,
  skills:            { type: [String], default: [] },
  education:         { type: [educationSchema], default: [] },
  workExperience:    { type: [workExperienceSchema], default: [] },
  applications:      [{ type: Schema.Types.ObjectId, ref: "Job" }],
  socialProfiles:    { type: socialProfilesSchema, default: () => ({}) },
  publicProfile:     { type: Boolean, default: true },
  jobPreferences:    jobPreferencesSchema,
  yearsOfExperience: String,
  primaryRole:       String,
  aiUseLimit:        { type: Number, default: 1 },
});

export { jobSeekerProfileSchema as JobSeekerProfile };