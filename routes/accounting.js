'use strict';

const express = require('express');
const router = express.Router();

// In-memory storage for transactions
a let transactions = [];

// Get all transactions
router.get('/transactions', (req, res) => {
    res.json(transactions);
});

// Get single transaction by ID
router.get('/transactions/:id', (req, res) => {
    const transaction = transactions.find(t => t.id === parseInt(req.params.id));
    if (!transaction) return res.status(404).send('Transaction not found.');
    res.json(transaction);
});

// Create transaction
router.post('/transactions', (req, res) => {
    const transaction = {
        id: transactions.length + 1,
        ...req.body
    };
    transactions.push(transaction);
    res.status(201).json(transaction);
});

// Update transaction
router.put('/transactions/:id', (req, res) => {
    const transaction = transactions.find(t => t.id === parseInt(req.params.id));
    if (!transaction) return res.status(404).send('Transaction not found.');

    Object.assign(transaction, req.body);
    res.json(transaction);
});

// Delete transaction
router.delete('/transactions/:id', (req, res) => {
    const transactionIndex = transactions.findIndex(t => t.id === parseInt(req.params.id));
    if (transactionIndex === -1) return res.status(404).send('Transaction not found.');

    transactions.splice(transactionIndex, 1);
    res.status(204).send();
});

// Financial summary
router.get('/summary', (req, res) => {
    const totalIncome = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : 0), 0);
    const totalExpense = transactions.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
    const totalTransactions = transactions.length;

    res.json({ totalIncome, totalExpense, totalTransactions });
});

module.exports = router;