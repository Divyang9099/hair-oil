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
    email: { type: String, required: true },
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


app.get('/api/orders', async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] GET /api/orders - Fetching all orders`);
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (err) {
        console.error(`[${new Date().toISOString()}] CRITICAL ERROR: GET /api/orders failed.`, err);
        res.status(500).json({
            error: 'સર્વરથી ઓર્ડર લાવવામાં સમસ્યા આવી',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Capture Lead Route (Save as partial Order)
app.post('/api/leads', async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] POST /api/leads - Payload:`, req.body);
        const { email, phone } = req.body;

        if (!phone) {
            console.warn(`[${new Date().toISOString()}] WARN: Lead post missing phone number`);
            return res.status(400).json({ error: 'ફોન નંબર જરૂરી છે' });
        }

        const order = new Order({
            email,
            phone,
            date: new Date(),
            status: false
        });
        await order.save();
        console.log(`[${new Date().toISOString()}] SUCCESS: Lead saved (ID: ${order._id})`);
        res.status(201).json({ message: 'Lead captured successfully', order });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] CRITICAL ERROR: POST /api/leads failed.`, error);
        res.status(500).json({ error: 'લીડ સેવ કરવામાં સમસ્યા આવી', details: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] POST /api/orders - Creating full order`);
        const { name, email, phone, address, bottleSize, quantity, price, total } = req.body;

        if (!name || !phone || !address) {
            console.warn(`[${new Date().toISOString()}] WARN: Order missing critical info (name/phone/address)`);
            return res.status(400).json({ error: 'બધી માહિતી ભરવી જરૂરી છે' });
        }

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

        const savedOrder = await order.save();
        console.log(`[${new Date().toISOString()}] SUCCESS: Order created (ID: ${savedOrder._id})`);
        res.status(201).json({ order: savedOrder });
    } catch (err) {
        console.error(`[${new Date().toISOString()}] CRITICAL ERROR: POST /api/orders failed.`, err);
        res.status(500).json({ error: 'ઓર્ડર બનાવવામાં સમસ્યા આવી', details: err.message });
    }
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
            console.log(`[Email] Status changed to Completed for Order ${id}.`);

            const emailSubject = 'Order Completed - Gujarati Divyang';
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #006400; text-align: center;">Order Completed! ✅</h2>
                    <p>Dear <b>${updatedOrder.name || 'Customer'}</b>,</p>
                    <p>Your order for <b>${updatedOrder.bottleSize}</b> hair oil has been marked as <b>Completed</b>.</p>
                    <p>Your medicine will be safely developed and delivered within <b>7 days</b>.</p>
                    <p>Total amount: ₹${updatedOrder.total}</p>
                    <hr/>
                    <p>Thank you for choosing Gujarati Divyang!</p>
                </div>
            `;

            const sendEmail = async () => {
                // PRIMARY: BREVO API (300 Free Emails/Day - Sends to any customer)
                if (process.env.BREVO_API_KEY) {
                    try {
                        console.log("[Email] Sending direct via Brevo API...");
                        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                            method: 'POST',
                            headers: {
                                'accept': 'application/json',
                                'api-key': process.env.BREVO_API_KEY,
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                sender: { name: "Gujarati Divyang", email: process.env.EMAIL_USER || "divyang.softcolon@gmail.com" },
                                to: [{ email: updatedOrder.email }],
                                subject: emailSubject,
                                htmlContent: emailHtml
                            })
                        });

                        const result = await response.json();
                        if (response.ok) {
                            console.log("[Email] SUCCESS: Sent via Brevo API", result.messageId);
                            return;
                        }
                        console.error("[Email] Brevo API Error:", result);
                    } catch (e) {
                        console.error("[Email] Brevo Connection Error:", e.message);
                    }
                }

                // FALLBACK: GMAIL SMTP (Only if Brevo is not configured or fails)
                if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                    try {
                        console.log("[Email] Falling back to Gmail SMTP...");
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com', port: 587, secure: false,
                            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                            connectionTimeout: 3000, family: 4
                        });
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER, to: updatedOrder.email,
                            subject: emailSubject, html: emailHtml
                        });
                        console.log("[Email] SUCCESS: Sent via Gmail SMTP backup.");
                    } catch (e) {
                        console.error("[Email] CRITICAL: All email methods failed.", e.message);
                    }
                } else if (!process.env.BREVO_API_KEY) {
                    console.warn("[Email] ERROR: No email provider (Brevo or Gmail) is configured in environment variables.");
                }
            };

            await sendEmail();
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

    // DEBUG LOGS (Detailed)
    console.log('--- Login Attempt Debug ---');
    console.log(`Received -> ID: [${id}], Password Length: ${password ? password.length : 0}`);
    console.log(`Expected -> ID: [${ADMIN_ID}], Password Length: ${ADMIN_PASSWORD ? ADMIN_PASSWORD.length : 0}`);
    console.log(`Matching -> ID Match: ${id === ADMIN_ID}, Password Match: ${password === ADMIN_PASSWORD}`);
    console.log('---------------------------');

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

app.get('/api/products', async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] GET /api/products - Fetching products`);
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] CRITICAL ERROR: GET /api/products failed.`, err);
        res.status(500).json({ error: 'પ્રોડક્ટ્સ લાવવામાં સમસ્યા આવી', details: err.message });
    }
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

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[${new Date().toISOString()}] DELETE /api/products/${id}`);

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'અમાન્ય પ્રોડક્ટ ID' });
        }

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'પ્રોડક્ટ મળી નથી' });
        }

        console.log(`[${new Date().toISOString()}] SUCCESS: Product deleted`);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(`[${new Date().toISOString()}] CRITICAL ERROR: DELETE /api/products/ failed.`, err);
        res.status(500).json({ error: 'પ્રોડક્ટ કાઢી નાખવામાં સમસ્યા આવી', details: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
