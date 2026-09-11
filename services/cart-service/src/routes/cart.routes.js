const express = require("express");
const validate = require("../middleware/validator.middleware");

const router = express.Router();

const {
	getCartByUserId,
	addItemToCart,
	updateCartItem,
	deleteCartItem
} = require("../controllers/cart.controller");

const { cartItemSchema } = require("../validators/cart.validator");

router.get("/carts/:userId", getCartByUserId);

router.post("/carts/:userId/items", validate(cartItemSchema), addItemToCart);

router.patch(
	"/carts/:userId/items/:productId",
	validate(cartItemSchema.omit({ productId: true })),
	updateCartItem
);

router.delete("/carts/:userId/items/:productId", deleteCartItem);

module.exports = router;