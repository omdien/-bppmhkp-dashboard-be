import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "Token tidak ada" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = decoded;
    next();
  });
};