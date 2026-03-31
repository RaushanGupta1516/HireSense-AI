import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PRODUCTION_URL } from "./constants.js";
import passport from "./utils/passport.js";

export const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(passport.initialize());

// --- routes ---
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/jobs.routes.js";
import companyRouter from "./routes/company.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/ai", aiRouter);

// global error handler, catches anything `next(err)` sends it
app.use((err, req, res, _) => {
  // don't spam logs with expected auth errors
  if (err.statusCode !== 401) {
    console.error(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});