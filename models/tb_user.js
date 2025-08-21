import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;

const Tb_user = db_hc.define(
  "tb_user",
  {
    USER_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ROLE: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    KODE_TRADER: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    USERNAME: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    PASSWORD: {
      type: DataTypes.STRING(70),
      allowNull: true,
    },
    JNS_ID: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    NO_ID: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NAMA: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ALAMAT: {
      type: DataTypes.STRING(170),
      allowNull: false,
    },
    EMAIL: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    TELEPON: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    JABATAN: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    KD_UNIT: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    STATUS: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    STS_LOGIN: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    DATE_LOGIN: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    IP_LOGIN: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    LAST_LOGIN: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DATE_CREATED: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    USER_CREATED: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LAST_UPDATED: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    USER_UPDATED: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    Sequelize,
    tableName: "tb_user",
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "USER_ID" }],
      },
      {
        name: "KODE_TRADER",
        using: "BTREE",
        fields: [{ name: "KODE_TRADER" }],
      },
      {
        name: "USR",
        using: "BTREE",
        fields: [{ name: "USERNAME" }],
      },
      {
        name: "PWD",
        using: "BTREE",
        fields: [{ name: "PASSWORD" }],
      },
      {
        name: "MAIL",
        using: "BTREE",
        fields: [{ name: "EMAIL" }],
      },
    ],
  }
);

export default Tb_user;
