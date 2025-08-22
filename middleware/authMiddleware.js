import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // sync verify
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid atau expired" });
  }
};
