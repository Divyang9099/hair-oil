const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    bottleSize: String,
    quantity: Number,
    price: Number,
    total: Number,
    date: Date,
    status: Boolean
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;