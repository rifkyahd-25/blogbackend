import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import JobRoutes from "./routes/job.routes.js";
import cookieParser from "cookie-parser";
import path from 'path';
import cors from "cors";

dotenv.config();

const app = express(); // <-- app must be defined first
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Or replace with: 'https://styledmaven.vercel.app'
  credentials: true
})); // Enable CORS for all origins
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/job", JobRoutes);

// // Serve frontend
// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
