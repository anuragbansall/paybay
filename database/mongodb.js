import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

if (!MONGO_URI) {
  throw new Error("MongoDB URI is not defined in the environment variables.");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
