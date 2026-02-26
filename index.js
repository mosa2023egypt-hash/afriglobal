const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/sales-orders', require('./routes/salesOrders'));
app.use('/api/procurement', require('./routes/procurement'));
app.use('/api/approvals', require('./routes/approvals'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/warehouse', require('./routes/warehouse'));
app.use('/api/accounting', require('./routes/accounting'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/roles', require('./routes/roles'));

// HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/sales', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sales.html')));
app.get('/procurement', (req, res) => res.sendFile(path.join(__dirname, 'public', 'procurement.html')));
app.get('/approvals', (req, res) => res.sendFile(path.join(__dirname, 'public', 'approvals.html')));
app.get('/gm-dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gm-dashboard.html')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});

module.exports = app;
