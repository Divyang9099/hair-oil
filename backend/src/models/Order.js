const mongoose = require('mongoose');

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

module.exports = mongoose.model('Order', orderSchema);
