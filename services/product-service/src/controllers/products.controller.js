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
    res.status(201).json(product);
}

const updateProductsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const updatedProduct = await productService.updateProductsById(
      id,
      productData
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

const deleteProductsById = async (req, res) => {
    const id =Number(req.params.id);
    if(!Number.isInteger(id) || id <=0){
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
    }
    await productService.deleteProductById(id);
    res.status(204).send();
}

module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    updateProductsById,
    deleteProductsById
}