import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tb_user from "../models/tb_user.js";
import dotenv from "dotenv";
dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";

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

        // Buat JWT
        const token = jwt.sign(
            { id: user.USER_ID, role: user.ROLE },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "15m" }
        );

        // Simpan di cookie HttpOnly
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true di production
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 menit
        });

        res.json({
            message: "Login berhasil",
            role: user.ROLE,
        });
    } catch (error) {
        console.error(error);
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

// ==========================
// CHECK AUTH
// ==========================
export const checkAuth = (req, res) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token) return res.status(401).json({ authenticated: false });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ authenticated: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ authenticated: false });
    }
};
