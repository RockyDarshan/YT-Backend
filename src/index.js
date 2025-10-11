import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

// load the project's .env file (default)
dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection failed", err);
  });
