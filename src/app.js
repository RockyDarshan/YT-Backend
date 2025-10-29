import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import-User
import userRouter from "./routes/user.routes.js";

//routes declaration-User
app.use("/api/v1/users", userRouter);

//routes import-Video
import videoRouter from "./routes/video.routes.js";

//routes declaration-Video
app.use("/api/v1/videos", videoRouter);

export default app;
