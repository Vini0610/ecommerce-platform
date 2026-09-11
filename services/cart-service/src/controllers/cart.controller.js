const cartService = require("../services/cart.service");

const parseId = (value, name) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error(`Invalid ${name}`);
        error.statusCode = 400;
        throw error;
    }
    return id;
};

const getCartByUserId = async (req, res) => {
    const userId = parseId(req.params.userId, "user ID");
    res.json(await cartService.getCartByUserId(userId));
};

const addItemToCart = async (req, res) => {
    const userId = parseId(req.params.userId, "user ID");
    const item = await cartService.addItemToUserCart(
        userId,
        req.body.productId,
        req.body.quantity
    );
    res.status(201).json(item);
};

const updateCartItem = async (req, res) => {
    const userId = parseId(req.params.userId, "user ID");
    const productId = parseId(req.params.productId, "product ID");
    const cart = await cartService.updateCartItem(userId, productId, req.body.quantity);
    res.json(cart);
};

const deleteCartItem = async (req, res) => {
    const userId = parseId(req.params.userId, "user ID");
    const productId = parseId(req.params.productId, "product ID");
    await cartService.deleteCartItem(userId, productId);
    res.status(204).send();
};

module.exports = {
    getCartByUserId,
    addItemToCart,
    updateCartItem,
    deleteCartItem
}