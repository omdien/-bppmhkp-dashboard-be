import Tb_user from "./tb_user.js";
import Tb_r_upt from "./tb_r_upt.js";

// Definisi relasi
Tb_user.belongsTo(Tb_r_upt, {
  foreignKey: "KD_UNIT",
  targetKey: "KD_UNIT",
  as: "upt",
});

Tb_r_upt.hasMany(Tb_user, {
  foreignKey: "KD_UNIT",
  sourceKey: "KD_UNIT",
  as: "users",
});

// Export SATU KALI semua model
export { Tb_user, Tb_r_upt };