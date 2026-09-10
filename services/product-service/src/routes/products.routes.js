const express = require("express");
const validate = require("../middleware/validator.middleware");

const router = express.Router();

const { getProducts, getProductsById , createProduct , updateProductsById, deleteProductsById} = require("../controllers/products.controller")

const { createProductSchema, updateProductSchema } = require("../validators/product.validator")

router.get("/products", getProducts);

router.get("/products/:id", getProductsById);

router.post("/products", validate(createProductSchema), createProduct);

router.patch("/products/:id", validate(updateProductSchema) , updateProductsById);

router.delete("/products/:id", deleteProductsById);


module.exports = router;