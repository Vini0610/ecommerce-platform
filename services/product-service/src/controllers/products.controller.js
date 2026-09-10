const productService = require("../services/products.service");

const getProducts = async (req, res) => {
    console.log(req.query);
    const products = await productService.getProducts();
    res.json(products)
}

const getProductsById = async (req, res) => {
    const id =Number(req.params.id);
    if(!Number.isInteger(id) || id <=0){
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
    }
    const product = await productService.getProductsById(id);
    res.json(product);
}

const createProduct = async (req, res) => {
    console.log(req.body);
    const product = await productService.createProduct(req.body);
    res.status(200).json(product);
}

const updateProductsById = async (req, res) => {
    const id =Number(req.params.id);
    if(!Number.isInteger(id) || id <=0){
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
    }
    const product = await productService.updateProductsById(id);
    res.json(product);
}

const deleteProductsById = async (req, res) => {
    const id =Number(req.params.id);
    if(!Number.isInteger(id) || id <=0){
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
    }
    const product = await productService.deleteProductById(id);
    res.json(product);
}

module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    updateProductsById,
    deleteProductsById
}