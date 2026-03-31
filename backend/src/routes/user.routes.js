import { Router } from "express";
import {
  ping, authPing, registerUser, loginUser, logoutUser,
  refreshAccessToken, getUserProfile, updateUserProfile,
  updateProfilePicture, addSkill, removeSkill, updateResume,
  savedJob, removeSavedJob, userPublicProfile,
  getNotifications, markNotificationsRead,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getSavedJobs } from "../controllers/job.controllers.js";
import passport from "../utils/passport.js";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get("/ping", ping);
router.get("/auth-ping", verifyJWT, authPing);

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

// google oauth
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken  = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      // where to send them after login depends on role + onboarding status
      const base = process.env.FRONTEND_URL;
      let redirectTo;

      if (!user.userProfile?.doneOnboarding) {
        redirectTo = user.role === "employer"
          ? `${base}/company-onboarding`
          : `${base}/user-onboarding`;
      } else {
        redirectTo = user.role === "employer"
          ? `${base}/dashboard/home`
          : `${base}/`;
      }

      res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect(redirectTo);
    } catch {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
  }
);

router.get("/profile", verifyJWT, getUserProfile);
router.patch("/profile/update", verifyJWT, updateUserProfile);
router.post("/profile-picture", verifyJWT, upload.single("profilePicture"), updateProfilePicture);

router.post("/add-skill", verifyJWT, addSkill);
router.post("/remove-skill", verifyJWT, removeSkill);

router.post("/resume", verifyJWT, updateResume);

router.get("/saved-jobs", verifyJWT, getSavedJobs);
router.post("/saved-jobs/:jobId", verifyJWT, savedJob);
router.delete("/saved-jobs/:jobId", verifyJWT, removeSavedJob);

router.get("/public-profile/:id", userPublicProfile);

router.get("/notifications", verifyJWT, getNotifications);
router.patch("/notifications/read", verifyJWT, markNotificationsRead);

export default router;