import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Tes koneksi DB
await db.authenticate();
console.log("✅ Database connected...");

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN, // contoh: http://localhost:3001
  credentials: true                   // penting agar cookie dikirim
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Global error handler
app.use(errorHandler);

// Jalankan server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});