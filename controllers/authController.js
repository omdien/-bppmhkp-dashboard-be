import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tb_user from "../models/tb_user.js";
import dotenv from "dotenv";

dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "15m";
const isProd = process.env.NODE_ENV === "production";

// ==========================
// Helper: convert JWT_EXPIRES ke ms untuk cookie maxAge
// ==========================
const getMaxAge = (expires) => {
  const match = expires.match(/(\d+)([smhd])/); // s=detik, m=menit, h=jam, d=hari
  if (!match) return 15 * 60 * 1000; // default 15 menit
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return 15 * 60 * 1000;
  }
};

// ==========================
// LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user
    const user = await Tb_user.findOne({ where: { USERNAME: username } });
    if (!user) return res.status(401).json({ message: "Username atau password salah" });

    // Cek password
    const match = await bcrypt.compare(password, user.PASSWORD);
    if (!match) return res.status(401).json({ message: "Username atau password salah" });

    // Buat token JWT
    const token = jwt.sign(
      { id: user.USER_ID, role: user.ROLE },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Hitung maxAge cookie dari JWT_EXPIRES
    const maxAge = getMaxAge(JWT_EXPIRES);

    // Set cookie dengan aman sesuai environment
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,                 // cookie tidak bisa diakses JS
      secure: isProd,                 // true hanya di prod (HTTPS)
      sameSite: isProd ? "None" : "Lax", // cross-origin di prod, lax di dev
      path: "/",
      maxAge,                          // sinkron dengan JWT_EXPIRES
    });

    return res.json({
      message: "Login berhasil",
      id: user.USER_ID,
      username: user.USERNAME,
      role: Number(user.ROLE),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// ==========================
// LOGOUT
// ==========================
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  });
  return res.json({ message: "Logout berhasil" });
};

// ==========================
// ME
// ==========================
export const me = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await Tb_user.findByPk(decoded.id, {
      attributes: ["USER_ID", "USERNAME", "ROLE", "EMAIL","NAMA","KD_UNIT"],
    });

    if (!user) {
      res.clearCookie(COOKIE_NAME);
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({
      id: user.USER_ID,
      username: user.USERNAME,
      role: Number(user.ROLE),
      nama: user.NAMA,
      email: user.EMAIL,
      kd_unit: user.KD_UNIT,
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.clearCookie(COOKIE_NAME); // hapus cookie jika token invalid
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
