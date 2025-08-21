// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.listen(process.env.APP_PORT, () => {
//   console.log(`Server is running on port ${process.env.APP_PORT}`);
// });

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();

// app.use(cors({
//   origin: "http://localhost:3001",  // alamat frontend Next.js
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"], // 🚀 izinkan Authorization
// }));

// app.use(express.json());

// app.listen(process.env.APP_PORT, () => {
//   console.log(`Server is running on port ${process.env.APP_PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3001", // alamat frontend Next.js
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // izinkan Authorization
}));

app.use(express.json());

// 👉 Route test untuk cek token
app.get("/api/test", (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log("🔎 Authorization Header diterima:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No Authorization header" });
  }

  res.json({
    message: "Authorization header diterima",
    authorization: authHeader,
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
