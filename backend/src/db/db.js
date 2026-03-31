import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const MONGODB_URL = process.env.MONGODB_URL

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error("MongoDB connection failed:", err.message)
    process.exit(1)
  }
}