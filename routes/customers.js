// customers.js

const express = require('express');
const router = express.Router();

let customers = []; // This will serve as an in-memory database for demo purposes.

// Create a customer
router.post('/', (req, res) => {
    const { id, name } = req.body;
    customers.push({ id, name });
    res.status(201).send({ message: 'Customer created', customer: { id, name } });
});

// Read all customers
router.get('/', (req, res) => {
    res.status(200).send(customers);
});

// Read a single customer by ID
router.get('/:id', (req, res) => {
    const customer = customers.find(c => c.id === req.params.id);
    if (customer) {
        res.status(200).send(customer);
    } else {
        res.status(404).send({ message: 'Customer not found' });
    }
});

// Update a customer by ID
router.put('/:id', (req, res) => {
    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    if (customerIndex !== -1) {
        customers[customerIndex] = { ...customers[customerIndex], ...req.body };
        res.status(200).send({ message: 'Customer updated', customer: customers[customerIndex] });
    } else {
        res.status(404).send({ message: 'Customer not found' });
    }
});

// Delete a customer by ID
router.delete('/:id', (req, res) => {
    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send({ message: 'Customer not found' });
    }
});

module.exports = router;