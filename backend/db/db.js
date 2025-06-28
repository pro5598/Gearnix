const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', 
  }
);

const db = () => {
  try {
    sequelize.sync({ alter: true });
    console.log("database connected successfully");
  } catch (e) {
    console.error("fail to connect database successfully", e);
  }
};

module.exports = { sequelize, db };
