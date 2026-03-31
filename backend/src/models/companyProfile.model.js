import mongoose, { Schema } from "mongoose";
import { socialProfilesSchema } from "./socialProfiles.schema.js";

const companyProfileSchema = new Schema({
  companyName:        { type: String, default: "" },
  doneOnboarding:     { type: Boolean, default: false },
  companyDescription: String,
  contactNumber:      String,
  address: {
    city:    String,
    state:   String,
    country: String,
  },
  industry:    String,
  companySize: {
    from: { type: Number, default: 0 },
    to:   { type: Number, default: 0 },
  },
  companyLogo: {
    type:    String,
    default: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
  },
  companyWebsite:        String,
  jobListings:           { type: [{ type: Schema.Types.ObjectId, ref: "Job" }], default: [] },
  companySocialProfiles: { type: socialProfilesSchema, default: () => ({}) },
  employeeBenefits:      { type: [String], default: [] },
  aiUseLimit:            { type: Number, default: 1 },
});

export { companyProfileSchema as CompanyProfile };