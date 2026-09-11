const { pool } = require("../config/db");

const findActiveCartId = async (connection, userId) => {
    const [rows] = await connection.query(
        "select id from carts where user_id = ? and lower(status) = 'active'",
        [userId]
    );
    return rows.length > 0 ? rows[0].id : null;
};

const getActiveCartId = async (connection, userId) => {
    const cartId = await findActiveCartId(connection, userId);
    if (cartId === null) {
        const error = new Error("Active cart not found");
        error.statusCode = 404;
        throw error;
    }
    return cartId;
};

const getOrCreateActiveCartId = async (connection, userId) => {
    const existingCartId = await findActiveCartId(connection, userId);
    if (existingCartId !== null) {
        return existingCartId;
    }

    const [result] = await connection.query(
        "insert into carts (user_id) values (?)",
        [userId]
    );
    return result.insertId;
};

const withTransaction = async (callback) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getCartById = async (connection, cartId) => {
    const [rows] = await connection.query(
        `select c.id as cart_id, c.user_id, c.status,
                ci.id as cart_item_id, ci.product_id, ci.quantity
         from carts c
         left join cart_items ci on ci.cart_id = c.id
         where c.id = ?`,
        [cartId]
    );

    return {
        id: rows[0].cart_id,
        user_id: rows[0].user_id,
        status: rows[0].status,
        items: rows
            .filter((row) => row.cart_item_id !== null)
            .map((row) => ({
                id: row.cart_item_id,
                product_id: row.product_id,
                quantity: row.quantity
            }))
    };
};

const getCartByUserId = async (userId) => {
    const connection = await pool.getConnection();
    try {
        const cartId = await getActiveCartId(connection, userId);
        return getCartById(connection, cartId);
    } finally {
        connection.release();
    }
}
   

const addItemToUserCart = async (userId, productId, quantity) => {
    return withTransaction(async (connection) => {
        const cartId = await getOrCreateActiveCartId(connection, userId);
        const [result] = await connection.query(
            "insert into cart_items (cart_id, product_id, quantity) values (?, ?, ?)",
            [cartId, productId, quantity]
        );
        return { id: result.insertId, cart_id: cartId, product_id: productId, quantity };
    });
};

const updateCartItem = async (userId, productId, quantity) => {
    return withTransaction(async (connection) => {
        const cartId = await getActiveCartId(connection, userId);
        const [result] = await connection.query(
            "update cart_items set quantity = ? where cart_id = ? and product_id = ?",
            [quantity, cartId, productId]
        );
        if (result.affectedRows === 0) {
            const error = new Error("Cart item not found");
            error.statusCode = 404;
            throw error;
        }
        return getCartById(connection, cartId);
    });
};

const deleteCartItem = async (userId, productId) => {
    return withTransaction(async (connection) => {
        const cartId = await getActiveCartId(connection, userId);
        const [result] = await connection.query(
            "delete from cart_items where cart_id = ? and product_id = ?",
            [cartId, productId]
        );
        if (result.affectedRows === 0) {
            const error = new Error("Cart item not found");
            error.statusCode = 404;
            throw error;
        }
    });
}

module.exports = {
    getCartByUserId,
    addItemToUserCart,
    updateCartItem,
    deleteCartItem
};