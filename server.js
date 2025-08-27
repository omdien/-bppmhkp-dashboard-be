import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5004;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3001";

// Tes koneksi DB (async IIFE agar bisa pakai top-level await lebih aman)
(async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected...");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();

// Middleware global
app.use(
  cors({
    origin: FRONTEND_ORIGIN, // contoh: https://ecert.kkp.go.id/report
    credentials: true,       // penting: cookie ikut dikirim cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // untuk form-data sederhana

// Routes
app.use("/api/auth", authRoutes);

// Future: tinggal tambah group routes lain
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/report", reportRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Error handler global
app.use(errorHandler);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
