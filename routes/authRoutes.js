import express from "express";
import { login, logout, checkAuth } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me   ← ganti supaya konsisten dengan middleware
router.get("/me", checkAuth);

export default router;