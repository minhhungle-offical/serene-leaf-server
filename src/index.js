import bodyParser from "body-parser";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config(); // Load .env variables ngay đầu

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3000", // local dev (frontend)
  "http://localhost:5173",
  "https://sereneleaf.vercel.app",
  "https://admin-sereneleaf.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
});

// Connect to MongoDB
(async () => {
  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL is not defined in environment variables.");
    process.exit(1);
  }

  try {
    // Suppress deprecation warning for strictQuery
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(chalk.red("❌ MongoDB connection error:", error));
    process.exit(1); // Exit app if DB connection fails
  }
})();

app.listen(port, () =>
  console.log(chalk.cyan(`🚀 Server is running on http://localhost:${port}`))
);

export default app;
