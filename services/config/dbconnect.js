// config/db.js
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: './.env' }); 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVERNAME,
    dialect: "mysql",
    dialectOptions: {
        charset: "utf8",
    },
    define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        engine: "InnoDB",
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected succesfuly!");
        await sequelize.sync({ alter: true });
        console.log("Models synchronized!");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

module.exports = {
    sequelize,
    connectDB,
    DataTypes
};
