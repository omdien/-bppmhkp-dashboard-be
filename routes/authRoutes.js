import express from "express";
import { login, logout, me } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// AUTH ROUTES
// ==========================

// Login → set cookie JWT
router.post("/login", login);

// Logout → clear cookie
router.post("/logout", logout);

// Check apakah token valid (untuk frontend ping session)
// router.get("/check-auth", checkAuth);

// Protected: hanya bisa diakses jika sudah login (verifyToken)
router.get("/me", verifyToken, me);

export default router;
