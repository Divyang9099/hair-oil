const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors({
    origin: '*', // Allow all origins to fix CORS issues
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    bottleSize: String,
    quantity: Number,
    price: Number,
    total: Number,
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: false } // false = pending, true = completed
});

const Order = mongoose.model('Order', orderSchema);

mongoose.connect('mongodb+srv://divyang:divyanggujarati@cluster0.ykivylh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


app.get('/api/orders', (req, res) => {
    Order.find().then((orders) => {
        res.status(200).json({ orders });
    }).catch((err) => {
        res.status(500).json({ error: 'Error fetching orders' });
    });
});

// Capture Lead Route (Save as partial Order)
app.post('/api/leads', async (req, res) => {
    try {
        const { email, phone } = req.body;
        // Create a partial order
        const order = new Order({
            email,
            phone,
            date: new Date(),
            status: false
        });
        await order.save();
        res.status(201).json({ message: 'Lead captured successfully', order });
    } catch (error) {
        console.error('Error capturing lead:', error);
        res.status(500).json({ error: 'Error capturing lead' });
    }
});

app.post('/api/orders', (req, res) => {
    // If creating a fresh order without lead capture
    const { name, email, phone, address, bottleSize, quantity, price, total } = req.body;
    const order = new Order({
        name,
        email,
        phone,
        address,
        bottleSize,
        quantity,
        price,
        total,
        date: new Date(),
        status: false
    });

    order.save().then((order) => {
        res.status(201).json({ order });
    }).catch((err) => {
        res.status(500).json({ error: 'Error creating order' });
    });
});

const nodemailer = require('nodemailer');

app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        // Find existing order to check previous status
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update order
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

        // DEBUG LOGGING
        const newStatus = req.body.status === true || req.body.status === 'true';
        const oldStatus = existingOrder.status === true || existingOrder.status === 'true';

        console.log(`Checking Email Trigger: OldStatus=${oldStatus}, NewStatus=${newStatus}, EmailConfigured=${!!(process.env.EMAIL_USER && process.env.EMAIL_PASS)}`);

        // Check if status changed to True (Completed)
        if (newStatus === true && oldStatus === false) {
            console.log("Status changed to Completed. Attempting to send email...");

            // Send Email
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: updatedOrder.email,
                    subject: 'Order Confirmation - Gujarati Divyang',
                    text: 'your order dilevrd in eithin 7 dsyd'
                };

                console.log(`Sending email to: ${updatedOrder.email} from: ${process.env.EMAIL_USER}`);

                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('SUCCESS: Email sent:', info.response);
                } catch (emailError) {
                    console.error('SERVER ERROR: Could not send email details:', emailError);
                }
            } else {
                console.error('FAILURE: Skipping email because EMAIL_USER or EMAIL_PASS is missing in Environment Variables.');
            }
        }

        res.status(200).json({ order: updatedOrder });
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Error updating order', details: err.message });
    }
});

app.post('/api/admin/login', (req, res) => {
    const { id, password } = req.body;

    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!id || !password) {
        return res.status(400).json({
            success: false,
            error: 'ID and password are required'
        });
    }

    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
        res.status(200).json({
            success: true,
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
});



// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false }
});

const Product = mongoose.model('Product', productSchema);

// --- PRODUCT ROUTES ---

app.get('/api/products', (req, res) => {
    Product.find().then(products => {
        res.json(products);
    }).catch(err => {
        res.status(500).json({ error: 'Error fetching products' });
    });
});

app.post('/api/products', async (req, res) => {
    try {
        let productData = req.body;

        // Handle Cloudinary Upload
        if (productData.image && productData.image.startsWith('data:image')) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(productData.image, {
                    folder: 'hair_oil_products'
                });
                productData.image = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary Upload Error:', uploadError);
                return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
            }
        }

        const newProduct = new Product(productData);
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Create Product Error:', err);
        res.status(500).json({ error: 'Error creating product' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        let productData = req.body;

        // Handle Cloudinary Upload if image is new (starts with data:image)
        if (productData.image && productData.image.startsWith('data:image')) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(productData.image, {
                    folder: 'hair_oil_products'
                });
                productData.image = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary Upload Error:', uploadError);
                return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(500).json({ error: 'Error updating product' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({ message: 'Product deleted' });
        }).catch(err => {
            res.status(500).json({ error: 'Error deleting product' });
        });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
