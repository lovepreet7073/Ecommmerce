const productService = require('../Services/productService');
const Product = require('../models/productModel')

const createProduct = async (req, res) => {
    try {
        const  data  = req.body;
        const files = req.files; // Retrieve uploaded files (images)
console.log(files,data,"files")
        if (!data) {
            return res.status(400).send({ error: 'Request body data is required.' });
        }

        if (!files || files.length === 0) {
            return res.status(400).send({ error: 'At least one image is required.' });
        }

        // Call productService.createProduct with both the product data and image files
        const product = await productService.createProduct(data, files);

        return res.status(201).send(product);
    } catch (error) {
        console.log(error, "error");
        return res.status(500).send({ error: error.message });
    }
}
const deleteProduct = async (req, res) => {

    const productId = req.params.id;
    try {
        const product = await productService.deleteProduct(productId);
        return res.status(201).send(product)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const updateProduct = async (req, res) => {

    const productId = req.params.id;
    try {
        const product = await productService.updateProduct(productId);
        return res.status(201).send(product)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const findProductById = async (req, res) => {

    const productId = req.params.id;
    try {
        const product = await productService.findProductById(productId);
        return res.status(201).send(product)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const getAllProducts = async (req, res) => {

    try {
        const products = await productService.getAllProducts(req.query);
        return res.status(201).send(products)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const createMutipleProducts = async (req, res) => {

    const productId = req.params.id;
    try {
        const product = await productService.findProductById(req.body);
        return res.status(201).send({ message: "Products created Successfully" })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const searchProducts = async (req, res) => {
    const { search, minPrice, maxPrice, size, brand, color } = req.query;

    // Initialize query object
    let query = {};

    // Handle the search term with multiple words
    if (search) {
        const searchTerms = search.split(/\s+/).map(term => term.trim()).filter(term => term);
        if (searchTerms.length > 0) {
            query.$or = searchTerms.map(term => ({
                $or: [
                    { title: { $regex: term, $options: 'i' } },
                    { description: { $regex: term, $options: 'i' } }
                ]
            }));
        }
    }

    // Handle price range
    if (minPrice && maxPrice) {
        query.discountedPrice = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
        query.discountedPrice = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
        query.discountedPrice = { $lte: parseInt(maxPrice) };
    }

    if (brand) query.brand = brand;
    if (color) query.color = color;
    if (size) query['sizes.name'] = size;

    try {
        const products = await Product.find(query)
            .populate({
                path: 'category', // First, populate the category field
                populate: {
                    path: 'parentCategory', // Then populate the parent category
                    model: 'categories', // Ensure the correct model is used
                    populate: {
                        path: 'parentCategory', // Now populate the grandparent category (nested)
                        model: 'categories', // Ensure the correct model is used for the grandparent
                    }
                }
            })
            .exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products' });
    }
};


module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMutipleProducts,
    searchProducts
}