const {z} = require('zod');

const createProductSchema = z.object({
    name: z.string().min(2).max(255),
    description: z.string().min(2).max(255),
    price: z.number(),
    currency: z.string().min(2),
    stock: z.number(),
    status: z.string()
});

module.exports = {
    createProductSchema
};