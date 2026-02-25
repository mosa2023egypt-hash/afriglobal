const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock database for users
let users = [];

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.' });
    }
});

// Verify token route
router.get('/verify-token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided.' });
    jwt.verify(token, 'secret', (err) => {
        if (err) return res.status(401).json({ message: 'Invalid token.' });
        res.json({ message: 'Token is valid.' });
    });
});

// Logout route
router.post('/logout', (req, res) => {
    // Invalidating token logic can go here (e.g., adding to blacklist)
    res.json({ message: 'Logged out successfully.' });
});

// Change password route
router.post('/change-password', async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;
        const user = users.find(u => u.username === username);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        res.json({ message: 'Password changed successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password.' });
    }
});

module.exports = router;
