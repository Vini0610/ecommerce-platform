require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const testDataBaseConnection = async () => {
    const connection = await pool.getConnection();
    console.log("MySQL connection successfull");
    connection.release();
}

module.exports = {
    pool, testDataBaseConnection
};