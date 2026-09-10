const pool = require("../config/db")
const getUsers = async () => {
    const [users] = await pool.query("SELECT * from users");
    return users;
}

const getUserById = async (id) => {
    const [rows] = await pool.query("select * from users where id = ?", [id]);
    if (rows.length === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return rows[0];
}

const createUser = async (userData) => {
    const { name, email } = userData;
    try {
        const [result] = await pool.query("Insert into users(name, email) values (?, ?)", [name, email])
        console.log(result, "Result")
        return {
            id: result.insertId,
            name,
            email
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Email already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }
        throw error;
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser
}