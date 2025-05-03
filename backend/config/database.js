// src/config/database.js
import { Sequelize } from "sequelize";

const db = new Sequelize("note", "root", "", {
  host: "localhost",
  //host: "34.133.192.60",
  dialect: "mysql",
});

export default db;
