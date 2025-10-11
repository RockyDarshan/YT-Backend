import dotenv from "dotenv";
import connectDB from "./db/index.js";

// load the project's .env file (default)
dotenv.config();

connectDB();
