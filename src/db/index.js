import mongoose from "mongoose";
import { config } from "../config/config.js";
import { DB_NAME } from "../constants/constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${config.mongoUri}/${DB_NAME}`);

    console.log(`🔗  MongoDB connected successfully: ${connection.connection.host}`);

    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
