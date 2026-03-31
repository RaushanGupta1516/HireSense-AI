
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";

// Load environment variables first, before anything else.
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("FATAL: Failed to connect to database.", err);
    process.exit(1);
  }
};

startServer();