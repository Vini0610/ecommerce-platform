const { z } = require("zod");

const cartItemSchema = z.object({
    productId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive()
});

module.exports = {
    cartItemSchema
};