const Order = require('../models/Order');
const { sendCompletionEmail } = require('../utils/emailHelper');
const mongoose = require('mongoose');

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] GET /api/orders - Fetching all orders`);
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (err) {
        console.error(`[${new Date().toISOString()}] CRITICAL ERROR: GET /api/orders failed.`, err);
        res.status(500).json({
            error: 'સર્વરથી ઓર્ડર લાવવામાં સમસ્યા આવી',
            details: err.message
        });
    }
};

// @desc    Capture Lead (Partial Order)
// @route   POST /api/leads
exports.captureLead = async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] POST /api/leads - Payload:`, req.body);
        const { email, phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'ફોન નંબર જરૂરી છે' });
        }

        const order = new Order({
            email,
            phone,
            date: new Date(),
            status: false
        });
        await order.save();
        res.status(201).json({ message: 'Lead captured successfully', order });
    } catch (error) {
        res.status(500).json({ error: 'લીડ સેવ કરવામાં સમસ્યા આવી', details: error.message });
    }
};

// @desc    Create full order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        const { name, email, phone, address, bottleSize, quantity, price, total } = req.body;

        if (!name || !phone || !address) {
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
        res.status(201).json({ order: savedOrder });
    } catch (err) {
        res.status(500).json({ error: 'ઓર્ડર બનાવવામાં સમસ્યા આવી', details: err.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

        const newStatus = req.body.status === true || req.body.status === 'true';
        const oldStatus = existingOrder.status === true || existingOrder.status === 'true';

        if (newStatus === true && oldStatus === false) {
            await sendCompletionEmail(updatedOrder);
        }

        res.status(200).json({ order: updatedOrder });
    } catch (err) {
        res.status(500).json({ error: 'Error updating order', details: err.message });
    }
};
