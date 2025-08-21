import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

export const sessionConfig = session({
    name: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true jika HTTPS
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 // 1 jam
    }
});
