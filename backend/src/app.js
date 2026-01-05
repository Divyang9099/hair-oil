const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const { captureLead } = require('./controllers/orderController');
// Routes
app.use('/api/orders', orderRoutes);
app.post('/api/leads', captureLead);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Root point
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
