const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.json({ success: true, data: orders });
});

router.post('/', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, data: order });
});

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json({ success: true, data: order });
});

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: order });
});

router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;
