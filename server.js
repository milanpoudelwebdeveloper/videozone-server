import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videosRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://videozone-client.vercel.app/"],
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/comments", commentRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Running on port ${port}...`));
