import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  generateJD,
  screenResumeController,
  rankCandidatesController,
  generateInterviewKitController,
  jobMatchScoreController,
  optimizeProfileController,
  salaryEstimatorController,
  aiChatController,
  parseResumeController,
} from "../controllers/ai.controllers.js";

const router = Router();

router.use(verifyJWT);

// recruiter only
router.post("/generate-jd", generateJD);
router.post("/screen-resume", screenResumeController);
router.get("/rank-candidates/:jobId", rankCandidatesController);
router.post("/interview-kit", generateInterviewKitController);

// candidate only
router.get("/job-match/:jobId", jobMatchScoreController);
router.get("/optimize-profile", optimizeProfileController);
router.post("/parse-resume", parseResumeController);

// both
router.post("/salary-estimate", salaryEstimatorController);
router.post("/chat", aiChatController);

export default router;