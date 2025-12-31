const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
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

mongoose.connect('mongodb+srv://divyang:divyanggujarati@cluster0.ykivylh.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
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

app.post('/api/orders', (req, res) => {
    const { name, phone, address, bottleSize, quantity, price, total } = req.body;
    const order = new Order({
        name,
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

app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    Order.findByIdAndUpdate(id, { status }, { new: true })
        .then((order) => {
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.status(200).json({ order });
        })
        .catch((err) => {
            console.error('Error updating order:', err);
            res.status(500).json({ error: 'Error updating order', details: err.message });
        });
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

app.post('/api/products', (req, res) => {
    const newProduct = new Product(req.body);
    newProduct.save().then(product => {
        res.status(201).json(product);
    }).catch(err => {
        res.status(500).json({ error: 'Error creating product' });
    });
});

app.put('/api/products/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedProduct => {
            res.json(updatedProduct);
        }).catch(err => {
            res.status(500).json({ error: 'Error updating product' });
        });
});

app.delete('/api/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({ message: 'Product deleted' });
        }).catch(err => {
            res.status(500).json({ error: 'Error deleting product' });
        });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
