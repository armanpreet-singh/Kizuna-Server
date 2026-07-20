import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.routes.js";

import errorHandler from "./middleware/error.middleware.js";


const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: {
    success: false,
    message: "😒  Too many requests. Please try again later.",
  },
});

app.use(helmet());

app.use(morgan("dev"));

app.use(hpp());

app.use(limiter);

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Kizuna API is running 🚀",
  });
});

// import { asyncHandler } from "./utils/asyncHandler.js";
// import { ApiError } from "./utils/ApiError.js";

// app.get(
//   "/test-error",
//   asyncHandler(async (req, res) => {
//     throw new ApiError(400, "This is a test error");
//   })
// );

// app.use(errorHandler);

export default app;
