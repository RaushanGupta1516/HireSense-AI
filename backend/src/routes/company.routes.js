import { Router } from "express";
import {
  getActiveJobListings,
  getAllApplications,
  getAllJobListings,
  getNonActiveJobListings,
  getShortListedCandidates,
  removeFromApplications,
  removeFromShortlist,
  shortlistCandidate,
} from "../controllers/company.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/listings", getAllJobListings);
router.get("/active-listings", getActiveJobListings);
router.get("/non-active-listings", getNonActiveJobListings);
router.get("/applications", getAllApplications);
router.get("/shortlisted-candidates", getShortListedCandidates);
router.post("/remove-from-applications", removeFromApplications);
router.post("/shortlist-candidate", shortlistCandidate);
router.post("/remove-from-shortlisted", removeFromShortlist);

export default router;