const pool = require("../config/db")
const getProducts = async () => {
    const [products] = await pool.query("SELECT * from products");
    return products;
}

const getProductsById = async (id) => {
    const [rows] = await pool.query("select * from users products id = ?", [id]);
    if (rows.length === 0) {
        const error = new Error("Products not found");
        error.statusCode = 404;
        throw error;
    }
    return rows[0];
}

const createProduct = async (productData) => {
    const { name, description, price, currency, stock, status } = productData;
    try {
        const [result] = await pool.query(`insert into products (name, description, price, currency, stock, status) 
            values (?, ?, ?, ?, ?, ?)`, [name, description, price, currency, stock, status])
        console.log(result, "Result")
        return {
            id: result.insertId,
            name,
            description,
            price,
            currency,
            stock,
            status
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Product already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }
        throw error;
    }
}

const updateProductsById = async (id) => {
    const [result] = await pool.query(`update products 
        set name = ?, description = ?, price = ?, currency = ?, stock = ?, status = ? where id = ?`, 
        [name, description, process, currency, stock, status, id]);
    if (result.affectedRows === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    console.log(result)
    return result[0];
}

const deleteProductById = async (id) => {
    const [result] = await pool.query(`delete from products where id = ?`, [id]);
    if (result.affectedRows === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    console.log(result)
    return result[0];
}
module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    updateProductsById,
    deleteProductById
}