// routes/orders.js

const express = require('express');
const router = express.Router();

let orders = []; // This will act as a simple in-memory database

// Create an order
router.post('/', (req, res) => {
    const order = req.body;
    orders.push(order);
    res.status(201).json(order);
});

// Read all orders
router.get('/', (req, res) => {
    res.json(orders);
});

// Read a single order by ID
router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).send('Order not found.');
    res.json(order);
});

// Update an order
router.put('/:id', (req, res) => {
    let order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).send('Order not found.');

    order = {...order, ...req.body};
    orders[orders.indexOf(orders.find(o => o.id === parseInt(req.params.id)))] = order;
    res.json(order);
});

// Delete an order
router.delete('/:id', (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex === -1) return res.status(404).send('Order not found.');
    orders.splice(orderIndex, 1);
    res.status(204).send();
});

module.exports = router;