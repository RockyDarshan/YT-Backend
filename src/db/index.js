import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const rawUrl = process.env.MONGODB_URL?.trim();
    if (!rawUrl) {
      throw new Error("MONGODB_URL is not set in environment");
    }
    if (!/^mongodb(\+srv)?:\/\//.test(rawUrl)) {
      throw new Error(
        "Invalid MongoDB URL scheme. URL must start with mongodb:// or mongodb+srv://"
      );
    }

    const connectionInstance = await mongoose.connect(`${rawUrl}/${DB_NAME}`);
    console.log(
      `\n MongoDB connected !!! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
