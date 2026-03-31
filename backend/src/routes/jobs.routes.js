import { Router } from "express";
import {
  ping,
  authPing,
  getJobs,
  getJobById,
  postJob,
  sendJobDescription,
  applyForJob,
  saveJob,
  removeSavedJob,
  getJobLocations,
  getCompanies,
  getSavedJobs,
} from "../controllers/job.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/ping", ping);
router.get("/auth-ping", verifyJWT, authPing);

router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.post("/jobs", verifyJWT, postJob);
router.post("/generate-job-description", verifyJWT, sendJobDescription);

router.post("/apply/:id", verifyJWT, applyForJob);

router.post("/save/:id", verifyJWT, saveJob);
router.delete("/remove-saved-job/:id", verifyJWT, removeSavedJob);

router.get("/job-locations", getJobLocations);
router.get("/companies", getCompanies);

export default router;