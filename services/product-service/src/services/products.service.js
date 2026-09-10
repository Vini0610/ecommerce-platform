const {pool} = require("../config/db")

const formatProduct = (product) => ({
    ...product,
    price: product.price === null || product.price === undefined
        ? product.price
        : Number(product.price).toFixed(2)
});

const getProducts = async () => {
    const [products] = await pool.query("SELECT * from products");
    return products.map(formatProduct);
}

const getProductsById = async (id) => {
    const [rows] = await pool.query("select * from products where id = ?", [id]);
    if (rows.length === 0) {
        const error = new Error("Products not found");
        error.statusCode = 404;
        throw error;
    }
    return formatProduct(rows[0]);
}

const createProduct = async (productData) => {
    const { name, description, price, currency, stock, status } = productData;
    try {
        const [result] = await pool.query(`insert into products (name, description, price, currency, stock, status) 
            values (?, ?, ?, ?, ?, ?)`, [name, description, price, currency, stock, status])
        console.log(result, "Result")
        return getProductsById(result.insertId);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Product already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }
        throw error;
    }
}

const updateProductsById = async (id, productData) => {
    const allowedFields = ["name", "description", "price", "currency", "stock", "status"];
    const fieldsToUpdate = Object.keys(productData).filter((field) =>
        allowedFields.includes(field)
    );

    if (fieldsToUpdate.length === 0) {
        const error = new Error("At least one product field is required");
        error.statusCode = 400;
        throw error;
    }

    const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(", ");
    const values = fieldsToUpdate.map((field) => productData[field]);
    values.push(id);

    const [result] = await pool.query(
        `update products set ${setClause} where id = ?`,
        values
    );
    if (result.affectedRows === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    console.log(result, "Result")
    return getProductsById(id);
}

const deleteProductById = async (id) => {
    const [result] = await pool.query(`delete from products where id = ?`, [id]);
    if (result.affectedRows === 0) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    return result.affectedRows;
}

module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    updateProductsById,
    deleteProductById
}