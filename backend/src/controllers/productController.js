const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'પ્રોડક્ટ્સ લાવવામાં સમસ્યા આવી', details: err.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        let productData = req.body;

        if (productData.image && productData.image.startsWith('data:image')) {
            const uploadResponse = await cloudinary.uploader.upload(productData.image, {
                folder: 'hair_oil_products'
            });
            productData.image = uploadResponse.secure_url;
        }

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error creating product', details: err.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        let productData = req.body;

        if (productData.image && productData.image.startsWith('data:image')) {
            const uploadResponse = await cloudinary.uploader.upload(productData.image, {
                folder: 'hair_oil_products'
            });
            productData.image = uploadResponse.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error updating product', details: err.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'અમાન્ય પ્રોડક્ટ ID' });
        }

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'પ્રોડક્ટ મળી નથી' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'પ્રોડક્ટ કાઢી નાખવામાં સમસ્યા આવી', details: err.message });
    }
};
