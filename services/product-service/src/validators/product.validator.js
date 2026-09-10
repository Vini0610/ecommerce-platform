const {z} = require('zod');

const createProductSchema = z.object({
    name: z.string().min(2).max(255),
    description: z.string().min(2).max(255).optional(),
    price: z.coerce.number().min(0).positive(),
    currency: z.string().min(2).max(3),
    stock: z.coerce.number().int().min(1).nonnegative(),
    status: z.string().max(50).optional()
});

const updateProductSchema = createProductSchema.partial();

module.exports = {
    createProductSchema,
    updateProductSchema,
};