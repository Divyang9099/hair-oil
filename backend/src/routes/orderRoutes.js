const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrder, captureLead } = require('../controllers/orderController');

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.post('/leads', captureLead);

module.exports = router;
