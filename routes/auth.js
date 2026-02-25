// authentication routes

const express = require('express');
const router = express.Router();

// Mock user data
const users = [
    { id: 1, username: 'user1', password: 'pass1' },
    { id: 2, username: 'user2', password: 'pass2' }
];

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful', userId: user.id });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // You would normally save this to a database
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered', user: newUser });
});

module.exports = router;