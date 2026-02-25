'use strict';

const express = require('express');
const router = express.Router();

// Mock Data Storage
let suppliers = [];

// Create a supplier
router.post('/', (req, res) => {
    const supplier = req.body;
    suppliers.push(supplier);
    res.status(201).json(supplier);
});

// Read all suppliers
router.get('/', (req, res) => {
    res.status(200).json(suppliers);
});

// Update a supplier
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
        suppliers[index] = req.body;
        res.status(200).json(suppliers[index]);
    } else {
        res.status(404).send('Supplier not found');
    }
});

// Delete a supplier
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    suppliers = suppliers.filter(s => s.id !== id);
    res.status(204).send();
});

module.exports = router;
