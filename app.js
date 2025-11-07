const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Order = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

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



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});