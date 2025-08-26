import { Sequelize } from "sequelize";

// Hardcode credentials untuk test
const db = new Sequelize("hc", "ppm", "Rahasia!@#123", {
  host: "192.168.12.15",
  dialect: "mysql",
  logging: console.log, // aktifkan log supaya kelihatan query
});

(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi MySQL berhasil!");
  } catch (error) {
    console.error("Koneksi gagal:", error);
  }
})();
