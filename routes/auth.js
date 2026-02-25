'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Dummy user data for example
const users = [
    { id: 1, username: 'user1', password: 'pass1', permissions: ['read', 'write'] },
    { id: 2, username: 'user2', password: 'pass2', permissions: ['read'] }
];

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Create a token with user permissions
        const token = jwt.sign({ id: user.id, permissions: user.permissions }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
