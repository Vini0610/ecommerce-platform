const {z} = require('zod');

const createUserSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.email()
});

module.exports = {
    createUserSchema
};