// Dot env setup
import * as dotenv from "dotenv";
dotenv.config();

import "express-async-errors";
import express from "express";
import morgan from "morgan";
import JobRouter from "./routes/JobRouter.js";
import UserRouter from "./routes/UserRouter.js";
import UserDetailsRouter from "./routes/UserDetailsRouter.js";
import { connect } from "./db/connect.js";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middleware/authMiddleware.js";
import { v2 as cloudinary } from "cloudinary";

// Initializing an express app
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Public folder
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Bcos of es6 we have to do this acrobatics
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(cookieParser());
// Public folder middlemware
app.use(express.static(path.resolve(__dirname, "./public")));

// Routers
app.use("/api/v1/jobs", authenticateUser, JobRouter);
app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/user", authenticateUser, UserDetailsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

const port = process.env.PORT || 3000;

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "welcome" });
});

app.get("/api/v1/jobs");

// Create Job
app.post("/api/v1/jobs");

// Get Single Job
app.get("/api/v1/jobs/:id");

// Edit Job
app.patch("/api/v1/jobs/:id");

// Delete Job
app.delete("/api/v1/jobs/:id");

// Not found
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not Found" });
});

// Error Route
app.use(errorHandlerMiddleware);

try {
  connect();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
