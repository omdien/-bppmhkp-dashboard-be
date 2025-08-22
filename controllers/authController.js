import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tb_user from "../models/tb_user.js";
import dotenv from "dotenv";
dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================
// LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Tb_user.findOne({ where: { USERNAME: username } });
    if (!user) return res.status(401).json({ message: "Username atau password salah" });

    const match = await bcrypt.compare(password, user.PASSWORD);
    if (!match) return res.status(401).json({ message: "Username atau password salah" });

    const token = jwt.sign(
      { id: user.USER_ID, role: user.ROLE },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "15m" }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    res.json({
      message: "Login berhasil",
      id: user.USER_ID,
      username: user.USERNAME,
      role: user.ROLE,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// ==========================
// LOGOUT
// ==========================
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: "Logout berhasil" });
};

export const me = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await Tb_user.findOne({
      where: { USER_ID: decoded.id },
      attributes: ["USER_ID", "USERNAME", "ROLE", "EMAIL"], // wajib sesuai field aman
    });

    if (!user) {
      res.clearCookie(COOKIE_NAME);
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({
      id: user.USER_ID,
      username: user.USERNAME,
      role: Number(user.ROLE), // **pastikan role number**
      email: user.EMAIL,
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
